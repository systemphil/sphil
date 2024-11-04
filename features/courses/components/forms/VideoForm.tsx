"use client";

import { useEffect, useRef, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import VideoFileInput from "./VideoFileInput";
import { Video } from "@prisma/client";
import SubmitInput from "./SubmitInput";
import { apiClientside } from "@/lib/trpc/trpcClientside";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import VideoViewer from "../VideoViewer";
import { sleep } from "@/utils/utils";

type VideoFormValues = Video & {
    fileInput: FileList;
};
/**
 * Video upload client component that that uses lessonId parameter to retrieve Video entry from database (if it exists).
 * When user hits submit on an upload, it will request a signed upload link from the server and let the client upload to the bucket.
 * The server will handle create/update of Video entry. Given an existing record, the submit handler will check whether a new upload's
 * filename is different from the old one, at which point a signal will be sent to storage to delete the old file. A new upload of
 * the same filename will automatically replace the old file on the storage.
 * @route Intended for the /admin route where the lessonId parameter is exposed.
 */
const VideoForm = () => {
    const [error, setError] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File>();
    const [handlerLoading, setHandlerLoading] = useState<boolean>(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [queryIsRefreshing, setQueryIsRefreshing] = useState<boolean>(false);
    const isCalledRef = useRef(false);
    const params = useParams();
    const utils = apiClientside.useContext();
    const lessonId = typeof params.lessonId === "string" ? params.lessonId : "";

    // Queries and mutations
    const { data: videoEntry } = apiClientside.db.getVideoByLessonId.useQuery({
        id: lessonId,
    });
    const createSignedPostUrlMutation =
        apiClientside.gc.createSignedPostUrl.useMutation({
            onError: (error) => {
                console.error(error);
                toast.error("Oops! Something went wrong");
            },
        });
    const deleteVideoMutation = apiClientside.gc.deleteVideoFile.useMutation({
        onError: (error) => {
            console.error(error);
            toast.error("Oops! Could not delete the old file!");
        },
    });
    const createSignedReadUrlMutation =
        apiClientside.gc.createSignedReadUrl.useMutation({
            onError: (error) => {
                console.error(error);
            },
        });

    // Event handlers and other hooks
    const handleSelectedFileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target && e.target.files && e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const methods = useForm<VideoFormValues>({
        defaultValues: {
            id: videoEntry?.id || "",
            lessonId: lessonId,
            fileName: videoEntry?.fileName || "",
            fileInput: undefined,
        },
    });

    const onSubmit: SubmitHandler<VideoFormValues> = async (data) => {
        try {
            //
            // 0. Preliminary setup and check that there is a file.
            //
            setHandlerLoading(true);
            if (!data.fileInput || data.fileInput.length === 0) {
                toast.error("No files selected!");
                return;
            }
            //
            // 1. Retrieving file details, requesting signed post url for storage and performing checks.
            //
            const file = data.fileInput[0];
            const filename = encodeURIComponent(file.name);
            const response = await createSignedPostUrlMutation.mutateAsync({
                id: videoEntry?.id || undefined,
                lessonId: lessonId,
                fileName: filename,
            });
            if (!response.url) {
                console.error(response);
                throw new Error("No URL in the response from gc.");
            }
            //
            // 2. Preparing post for upload, sending request and checking response for OK.
            //
            const { url } = response;
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
                    await deleteVideoMutation.mutateAsync({
                        id: videoEntry.id,
                        fileName: videoEntry.fileName,
                    });
                    setQueryIsRefreshing(true);
                }
                toast.success("Success! Video uploaded / updated.");
            } else {
                throw new Error("Post to GC did not return OK");
            }
            //
            // 3. Upload complete. Cleanup of form and resetting queries and states.
            //
            await sleep(1000);
            void utils.db.getVideoByLessonId.invalidate();
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
        if (videoEntry && !previewUrl) {
            if (error) return;
            if (queryIsRefreshing) return;
            if (isCalledRef.current === true) return;
            isCalledRef.current = true; // Stop double call in strict mode.
            createSignedReadUrlMutation
                .mutateAsync({
                    id: videoEntry.id,
                    fileName: videoEntry.fileName,
                })
                .then((url) => {
                    setPreviewUrl(url);
                })
                .catch((error) => {
                    setError(true);
                    toast.error("Oops! Unable to get video preview");
                    console.error("Error retrieving preview URL: ", error);
                })
                .finally(() => {
                    isCalledRef.current = false;
                });
        }
    }, [
        videoEntry,
        createSignedReadUrlMutation,
        previewUrl,
        error,
        queryIsRefreshing,
    ]);

    return (
        <FormProvider {...methods}>
            <form
                className="flex flex-col max-w-lg border-dotted border-2 border-slate-500 p-4 rounded-md"
                onSubmit={methods.handleSubmit(onSubmit)}
                method="put"
                encType="multipart/form-data"
            >
                {previewUrl && <VideoViewer videoUrl={previewUrl} />}
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
                />
            </form>
        </FormProvider>
    );
};

export default VideoForm;
