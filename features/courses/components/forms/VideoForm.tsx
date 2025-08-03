"use client";

import { useEffect, useRef, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { SeminarVideo, Video } from "@prisma/client";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { sleep } from "lib/utils";
import { VideoViewer } from "lib/components/VideoViewer";
import { VideoFileInput } from "./VideoFileInput";
import { SubmitInput } from "./SubmitInput";
import {
    actionCreateSignedPostUrl,
    actionCreateSignedPostUrlSeminar,
    actionCreateSignedReadUrl,
    actionDeleteVideoFile,
} from "features/courses/server/actions";

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
    | { videoEntry: Video | null; videoKind: "lesson" }
    | { videoEntry: SeminarVideo | null; videoKind: "seminar" };

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
export const VideoForm = ({ videoEntry, videoKind }: VideoFormInput) => {
    const [error, setError] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File>();
    const [handlerLoading, setHandlerLoading] = useState<boolean>(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [queryIsRefreshing, setQueryIsRefreshing] = useState<boolean>(false);
    const isCalledRef = useRef(false);
    const params = useParams();

    const config = videoConfig[videoKind];
    const paramId = params[config.paramKey];

    if (!paramId || Array.isArray(paramId)) {
        throw new Error(`${config.paramKey} parameter is missing or invalid.`);
    }

    const handleSelectedFileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target && e.target.files && e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const methods = useForm({
        defaultValues: config.getDefaultValues(videoEntry as any, paramId),
    });

    const onSubmit: SubmitHandler<any> = async (data) => {
        try {
            // 0. Preliminary setup and check that there is a file.
            setHandlerLoading(true);
            if (!data.fileInput || data.fileInput.length === 0) {
                toast.error("No files selected!");
                return;
            }

            // 1. Retrieving file details, requesting signed post url for storage and performing checks.
            const file = data.fileInput[0];
            const filename = encodeURIComponent(file.name);

            const requestParams =
                videoKind === "lesson"
                    ? {
                          id: videoEntry?.id || undefined,
                          lessonId: paramId,
                          fileName: filename,
                      }
                    : {
                          id: videoEntry?.id || undefined,
                          seminarId: paramId,
                          fileName: filename,
                      };

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
            const { url } = resp.data;
            const upload = await fetch(url, {
                method: "PUT",
                body: file,
            });

            if (upload.ok) {
                if (videoEntry && filename !== videoEntry.fileName) {
                    /**
                     * If there is an existing entry and the incoming upload filename is different,
                     * the bucket will not overwrite the old file, in which case we must manually
                     * send a signal to the bucket to delete the old file. At this stage, videoEntry data is
                     * not yet updated (this invalidation takes place at the end of this function), so we can use its data.
                     */
                    const resp = await actionDeleteVideoFile({
                        id: videoEntry.id,
                        fileName: videoEntry.fileName,
                    });
                    if (resp?.error) {
                        toast.error(`Error deleting old file ${resp.error}`);
                    }
                    setQueryIsRefreshing(true);
                }
                toast.success("Success! Video uploaded / updated.");
            } else {
                throw new Error("Post to GC did not return OK");
            }

            // 3. Upload complete. Cleanup of form and resetting queries and states.
            await sleep(1000);
        } catch (error) {
            toast.error("Oops! Something went wrong");
            throw error;
        } finally {
            setSelectedFile(undefined);
            setPreviewUrl(null);
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
                    setPreviewUrl(resp.data);
                }
                isCalledRef.current = false;
            }
        };
        loadVideo();
    }, [videoEntry, previewUrl, error, queryIsRefreshing]);

    return (
        <FormProvider {...methods}>
            <form
                className="flex flex-col max-w-lg border-dotted border-2 border-slate-500 p-4 rounded-md"
                onSubmit={methods.handleSubmit(onSubmit)}
                method="put"
                encType="multipart/form-data"
            >
                {previewUrl && videoEntry && (
                    <VideoViewer
                        videoUrl={previewUrl}
                        fileName={videoEntry.fileName}
                        videoId={videoEntry.id}
                    />
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
                        <p>Selected File: {selectedFile.name}</p>
                    </div>
                )}
                <SubmitInput
                    value={`${
                        videoEntry && videoEntry.id ? "Update" : "Upload"
                    } video`}
                    isLoading={handlerLoading}
                    isVerbose
                />
            </form>
        </FormProvider>
    );
};
