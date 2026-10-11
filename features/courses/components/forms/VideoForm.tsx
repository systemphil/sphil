"use client";

import { useEffect, useRef, useState } from "react";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import type { SeminarVideo, Video } from "@prisma/client";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { sleep } from "lib/utils";
import { MAX_VIDEO_UPLOAD_BYTES } from "lib/config/consts";
import { VideoViewer } from "lib/components/VideoViewer";
import { VideoFileInput } from "./VideoFileInput";
import { SubmitInput } from "./SubmitInput";
import {
    actionCreateSignedPostUrl,
    actionCreateSignedPostUrlSeminar,
    actionCreateSignedReadUrl,
    actionCreateTranscription,
    actionDeleteVideoFile,
    actionUpdateLessonCache,
    actionUpdateSeminarCohortCache,
} from "features/courses/server/actions";
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
} from "@mui/material";

type FileInput = {
    fileInput: FileList | undefined;
};

type VideoFormValuesLesson = Omit<Video, "duration" | "posterUrl"> & FileInput;

type VideoFormValuesSeminar = Omit<
    SeminarVideo,
    "duration" | "posterUrl" | "createdAt" | "updatedAt"
> &
    FileInput;

type VideoFormInput =
    | { videoEntry: Video | null; videoKind: "lesson"; courseSlug: string }
    | {
          videoEntry: SeminarVideo | null;
          videoKind: "seminar";
          courseSlug: string;
      };

/**
 * Configuration for different video types. Since Prisma does not support
 * polymorphic models, we use different video models attached to either Lesson
 * or Seminar. This config delineates the two models and configures the correct
 * function calls downstream.
 */
const videoConfig = {
    lesson: {
        paramKey: "lessonId" as const,
        createSignedPostUrl: actionCreateSignedPostUrl,
        getDefaultValues: (
            videoEntry: Video | null,
            paramId: string
        ): VideoFormValuesLesson => ({
            id: videoEntry?.id || "",
            lessonId: paramId,
            fileName: videoEntry?.fileName || "",
            fileInput: undefined,
        }),
    },
    seminar: {
        paramKey: "seminarId" as const,
        createSignedPostUrl: actionCreateSignedPostUrlSeminar,
        getDefaultValues: (
            videoEntry: SeminarVideo | null,
            paramId: string
        ): VideoFormValuesSeminar => ({
            id: videoEntry?.id || "",
            seminarId: paramId,
            fileName: videoEntry?.fileName || "",
            fileInput: undefined,
        }),
    },
} as const;

/**
 * Video upload client component that uses lessonId or seminarId parameter to retrieve Video entry from database (if it exists).
 * When user hits submit on an upload, it will request a signed upload link from the server and let the client upload to the bucket.
 * The server will handle create/update of Video entry. Given an existing record, the submit handler will check whether a new upload's
 * filename is different from the old one, at which point a signal will be sent to storage to delete the old file. A new upload of
 * the same filename will automatically replace the old file on the storage.
 * @route Intended for the /admin route where the lessonId or seminarId parameter is exposed.
 */
export const VideoForm = ({
    videoEntry,
    videoKind,
    courseSlug,
}: VideoFormInput) => {
    const [error, setError] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File>();
    const [handlerLoading, setHandlerLoading] = useState<boolean>(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [queryIsRefreshing, setQueryIsRefreshing] = useState<boolean>(false);
    const isCalledRef = useRef(false);
    const params = useParams();
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [transcriptionRetrying, setTranscriptionRetrying] =
        useState<boolean>(false);
    const [isRetryDialogOpen, setIsRetryDialogOpen] = useState(false);

    const config = videoConfig[videoKind];
    const paramId = params[config.paramKey];

    if (!paramId || Array.isArray(paramId)) {
        throw new Error(`${config.paramKey} parameter is missing or invalid.`);
    }

    const handleSelectedFileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target?.files?.[0];
        if (file) {
            setSelectedFile(file);
            if (file.size > MAX_VIDEO_UPLOAD_BYTES) {
                toast.error(
                    `Video is ${formatGB(file.size)}, which exceeds the 2 GB limit.`
                );
            }
        }
    };

    const methods = useForm({
        defaultValues:
            videoKind === "lesson"
                ? videoConfig.lesson.getDefaultValues(
                      videoEntry as Video | null,
                      paramId
                  )
                : videoConfig.seminar.getDefaultValues(
                      videoEntry as SeminarVideo | null,
                      paramId
                  ),
    });

    /**
     * Requests a signed read url for the video and kicks off server-side transcription.
     * Used after a successful lesson upload and by the manual retry button.
     */
    const triggerTranscription = async ({
        id,
        fileName,
    }: {
        id: string;
        fileName: string;
    }) => {
        const resp = await actionCreateSignedReadUrl({ id, fileName });
        if (resp?.error || !resp.data) {
            toast.error(
                "Oops! Unable to get video url for transcription processing"
            );
            console.error("Error retrieving URL: ", resp.error);
            return false;
        }

        const actionRes = await actionCreateTranscription({
            fileUrl: resp.data.url,
            parentId: paramId,
        });

        if (actionRes.error) {
            toast.error("Oops! Error during transcription trigger request");
            console.error(
                "Error during transcription trigger request ",
                actionRes.message
            );
            return false;
        }
        return true;
    };

    const handleRetryTranscription = async () => {
        if (!videoEntry) return;
        setTranscriptionRetrying(true);
        try {
            const ok = await triggerTranscription({
                id: videoEntry.id,
                fileName: videoEntry.fileName,
            });
            if (ok) {
                toast.success(
                    "Transcription restarted. It may take a few minutes."
                );
            }
        } catch (e) {
            toast.error("Oops! Something went wrong");
            console.error(e);
        } finally {
            setTranscriptionRetrying(false);
            setIsRetryDialogOpen(false);
        }
    };

    const onSubmit: SubmitHandler<
        VideoFormValuesLesson | VideoFormValuesSeminar
    > = async (data) => {
        try {
            // 0. Preliminary setup and check that there is a file.
            setHandlerLoading(true);
            if (!data.fileInput || data.fileInput.length === 0) {
                toast.error("No files selected!");
                return;
            }

            // 1. Retrieving file details, requesting signed post url for storage and performing checks.
            const file = data.fileInput[0];
            if (file.size > MAX_VIDEO_UPLOAD_BYTES) {
                toast.error(
                    `Video is ${formatGB(file.size)}, which exceeds the 2 GB limit. Please compress it and try again.`
                );
                return;
            }
            const filename = encodeURIComponent(file.name);

            const requestParams =
                videoKind === "lesson"
                    ? {
                          id: videoEntry?.id || undefined,
                          lessonId: paramId,
                          fileName: filename,
                          fileSize: file.size,
                      }
                    : {
                          id: videoEntry?.id || undefined,
                          seminarId: paramId,
                          fileName: filename,
                          fileSize: file.size,
                      };

            // biome-ignore lint/suspicious/noExplicitAny: <Fix when we overhaul this>
            const resp = await config.createSignedPostUrl(requestParams as any);

            if (resp?.error) {
                toast.error(`Error getting upload link ${resp.error}`);
                throw new Error("Error getting upload link");
            }

            if (!resp.data || !resp.data.url) {
                toast.error(`Error getting upload link ${resp.data}`);
                throw new Error("No URL in the response from bucket.");
            }

            // 2. Preparing post for upload, sending request and checking response for OK.
            const { url, videoEntryId } = resp.data;
            await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();

                xhr.upload.addEventListener("progress", (e) => {
                    if (e.lengthComputable) {
                        const percentComplete = (e.loaded / e.total) * 100;
                        setUploadProgress(Math.round(percentComplete));
                    }
                });

                xhr.addEventListener("load", () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(xhr.response);
                    } else {
                        reject(new Error("Upload failed"));
                    }
                });

                xhr.addEventListener("error", () =>
                    reject(new Error("Upload failed"))
                );
                xhr.addEventListener("abort", () =>
                    reject(new Error("Upload aborted"))
                );

                xhr.open("PUT", url);
                xhr.send(file);
            });

            if (videoEntry && filename !== videoEntry.fileName) {
                /**
                 * If there is an existing entry and the incoming upload filename is different,
                 * the bucket will not overwrite the old file, in which case we must manually
                 * send a signal to the bucket to delete the old file. At this stage, videoEntry data is
                 * not yet updated (this invalidation takes place at the end of this function), so we can use its data.
                 */
                try {
                    const resp = await actionDeleteVideoFile({
                        id: videoEntry.id,
                        fileName: videoEntry.fileName,
                    });
                    if (resp?.error) {
                        toast.error(`Error deleting old file ${resp.error}`);
                    }
                    setQueryIsRefreshing(true);
                } catch (e) {
                    console.error(e);
                }
            }

            toast.success("Success! Video uploaded / updated.");

            await sleep(1000);

            if (videoKind === "lesson" && paramId) {
                await triggerTranscription({
                    id: videoEntryId,
                    fileName: filename,
                });
            }

            // Finally, update serve cache
            if (videoKind === "lesson" && videoEntry?.lessonId) {
                await actionUpdateLessonCache({
                    courseSlug,
                    lessonId: videoEntry.lessonId,
                });
            }
            if (videoKind === "seminar") {
                await actionUpdateSeminarCohortCache({ courseSlug });
            }
        } catch (error) {
            toast.error("Oops! Something went wrong");
            throw error;
        } finally {
            setSelectedFile(undefined);
            setPreviewUrl(null);
            setUploadProgress(0);
            methods.reset();
            setHandlerLoading(false);
            setTimeout(() => {
                setQueryIsRefreshing(false);
            }, 1000);
        }
    };

    useEffect(() => {
        const loadVideo = async () => {
            if (videoEntry && !previewUrl) {
                if (error) return;
                if (queryIsRefreshing) return;
                if (isCalledRef.current === true) return;
                isCalledRef.current = true; // Stop double call in strict mode.

                const resp = await actionCreateSignedReadUrl({
                    id: videoEntry.id,
                    fileName: videoEntry.fileName,
                });

                if (resp?.error) {
                    setError(true);
                    toast.error("Oops! Unable to get video preview");
                    console.error("Error retrieving preview URL: ", resp.error);
                } else if (!resp.data) {
                    setError(true);
                    toast.error("Oops! No video preview available");
                } else {
                    setPreviewUrl(resp.data.url);
                }
                isCalledRef.current = false;
            }
        };
        loadVideo();
    }, [videoEntry, previewUrl, error, queryIsRefreshing]);

    return (
        <FormProvider {...methods}>
            <form
                className="flex flex-col w-full max-w-3xl mx-auto gap-2 border-dotted border-2 border-slate-500 p-4 rounded-md"
                onSubmit={methods.handleSubmit(onSubmit)}
                method="put"
                encType="multipart/form-data"
            >
                {videoEntry && (
                    <div className="aspect-video w-full">
                        {previewUrl && (
                            <VideoViewer
                                videoUrl={previewUrl}
                                fileName={videoEntry.fileName}
                                videoId={videoEntry.id}
                            />
                        )}
                    </div>
                )}
                <VideoFileInput
                    label="File*"
                    name="fileInput"
                    options={{
                        required: true,
                        onChange: (e) => handleSelectedFileChange(e),
                    }}
                />
                {selectedFile && (
                    <div>
                        <p>
                            Selected File: {selectedFile.name} (
                            {formatGB(selectedFile.size)})
                        </p>
                        {selectedFile.size > MAX_VIDEO_UPLOAD_BYTES && (
                            <p className="text-red-600 text-sm">
                                Exceeds the 2 GB upload limit. Please compress
                                the video before uploading.
                            </p>
                        )}
                    </div>
                )}
                {handlerLoading && uploadProgress > 0 && (
                    <div className="w-full">
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">
                                Uploading...
                            </span>
                            <span className="text-sm font-medium">
                                {uploadProgress}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                    </div>
                )}
                {videoKind === "lesson" && (
                    <Alert severity="warning">
                        Lessons will automatically be transcribed by the server
                        within a few minutes and{" "}
                        <b>will overwrite any existing transcript</b>. Be sure
                        to double-check the transcript after it has been
                        processed.
                    </Alert>
                )}
                <SubmitInput
                    value={`${videoEntry?.id ? "Update" : "Upload"} video`}
                    isLoading={handlerLoading}
                    isVerbose
                />
            </form>
            {videoKind === "lesson" && videoEntry && (
                <div className="flex flex-col items-start w-full max-w-3xl mx-auto mt-3">
                    <Button
                        variant="outlined"
                        onClick={() => setIsRetryDialogOpen(true)}
                        disabled={transcriptionRetrying || handlerLoading}
                    >
                        Retry transcription
                    </Button>
                    <p className="text-sm mt-1 opacity-70">
                        Re-runs transcription on the current video and
                        overwrites any existing transcript.
                    </p>
                    <Dialog
                        open={isRetryDialogOpen}
                        onClose={() =>
                            !transcriptionRetrying &&
                            setIsRetryDialogOpen(false)
                        }
                        disableScrollLock
                    >
                        <DialogContent>
                            Are you sure you want to re-run transcription for
                            this video?
                        </DialogContent>
                        <Alert severity="warning">
                            This <b>will overwrite any existing transcript</b>,
                            including manual edits.
                        </Alert>
                        <DialogActions>
                            <Button
                                disabled={transcriptionRetrying}
                                onClick={() => setIsRetryDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="warning"
                                disabled={transcriptionRetrying}
                                onClick={handleRetryTranscription}
                            >
                                {transcriptionRetrying
                                    ? "Starting..."
                                    : "Retry transcription"}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            )}
        </FormProvider>
    );
};

const formatGB = (bytes: number) => `${(bytes / 1024 ** 3).toFixed(2)} GB`;
