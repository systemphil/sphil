import { GetSignedUrlConfig } from "@google-cloud/storage";
import { dbUpsertVideoById } from "lib/database/dbFuncs";
import { primaryBucket, secondaryBucket } from "./bucketInit";
import { withAdmin } from "lib/auth/authFuncs";

const READ_RESOURCE_SIGNED_URL_EXPIRY = 90 * 60 * 1000; // 90 minutes

type GcGenerateSignedPostUploadURLProps = {
    fileName: string;
    id?: string;
    lessonId: string;
};
/**
 * Creates a signed post url for video upload. Requires name of file and the ID of the lesson under which the video
 * will be related. Will create (using lessonId) or update Video entry based on whether existing video ID is provided.
 * Finally, will update the Video record if post url returned provided.
 * @description All lesson videos will be stored the directory named after their ID in the Video entry: /video/[VideoId]/[fileName].ext
 * @access ADMIN
 */
export async function bucketGenerateSignedUploadUrl({
    fileName,
    id,
    lessonId,
}: GcGenerateSignedPostUploadURLProps) {
    async function task() {
        const videoEntry = {
            id: id,
            fileName: fileName,
            lessonId: lessonId,
        };
        if (!videoEntry.id) {
            const newVideoEntry = await dbUpsertVideoById({ lessonId });
            videoEntry.id = newVideoEntry.id;
        }
        const filePath = `video/${videoEntry.id}/${videoEntry.fileName}`;
        // * Alternative method using bucket server
        // if (!BUCKET_SERVER_ORIGIN)
        //     throw new Error("Bucket server URL not set.");
        // const outgoingUrl = `${BUCKET_SERVER_ORIGIN}/write-object`;
        // const res = await fetch(outgoingUrl, {
        //     method: "POST",
        //     body: JSON.stringify({ object: filePath }),
        // });
        // if (!res.ok) {
        //     throw new Error("Failed to get signed upload URL");
        // }
        // const data = await res.json();
        const options = {
            version: "v4",
            action: "write",
            expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        } satisfies GetSignedUrlConfig;
        const [url] = await primaryBucket.file(filePath).getSignedUrl(options);

        if (url) {
            await dbUpsertVideoById({
                lessonId: videoEntry.lessonId,
                id: videoEntry.id,
                fileName: videoEntry.fileName,
            });
        }

        const data = {
            url: url,
        };
        return data;
    }
    return withAdmin(task);
}
type GcVideoFilePathProps = {
    fileName: string;
    id: string;
};
/**
 * Deletes a video file in storage. Requires the ID of the Video entry from db and the filename.
 * @access "ADMIN"
 * @note "Directories" are automatically deleted when empty.
 */
export async function bucketDeleteVideoFile({
    fileName,
    id,
}: GcVideoFilePathProps) {
    async function task() {
        const filePath = `video/${id}/${fileName}`;
        // * Alternative method using bucket server
        // if (!BUCKET_SERVER_ORIGIN) throw new Error("Bucket server URL not set.");
        // const outgoingUrl = `${BUCKET_SERVER_ORIGIN}/delete-object`;
        // const res = await fetch(outgoingUrl, {
        //     method: "POST",
        //     body: JSON.stringify({ object: filePath }),
        // });
        // if (!res.ok) {
        //     console.error(`Failed to delete object ${filePath}`);
        //
        //     throw new Error("Deleting object request failed.");
        // }
        await primaryBucket
            .file(filePath)
            .delete()
            .then(() => {
                console.info(`☑️ bucket|object deleted: ${filePath}`);
            })
            .catch((err) => {
                console.error(`Failed to delete object ${filePath}`);
                console.error(err);
                throw new Error("Deleting object request failed.");
            });
        return;
    }
    return withAdmin(task);
}
/**
 * Generates a signed Read Url for specific video from bucket. Requires the ID of the Video entry from db and the filename.
 * @access PUBLIC
 */
export async function bucketGenerateReadSignedUrl({
    fileName,
    id,
}: GcVideoFilePathProps) {
    const filePath = `video/${id}/${fileName}`;
    // * Alternative method using bucket server
    // if (!BUCKET_SERVER_ORIGIN) throw new Error("Bucket server URL not set.");
    // const outgoingUrl = `${BUCKET_SERVER_ORIGIN}/read-object`;
    // const res = await fetch(outgoingUrl, {
    //     method: "POST",
    //     body: JSON.stringify({ object: filePath }),
    // });
    // if (!res.ok) {
    //     throw new Error("Failed to get signed URL");
    // }
    // const data = await res.json();
    // return data.url;
    const options = {
        version: "v4",
        action: "read",
        expires: Date.now() + READ_RESOURCE_SIGNED_URL_EXPIRY,
    } satisfies GetSignedUrlConfig;
    const [url] = await primaryBucket.file(filePath).getSignedUrl(options);
    return url;
}

/**
 * Uploads image to secondary bucket and returns the public URL.
 */
export function bucketPipeImageUpload({
    file,
    fileName,
}: {
    file: Buffer;
    fileName: string;
}) {
    const filePath = `images/${fileName}`;
    const blob = secondaryBucket.file(filePath);
    const blobStream = blob.createWriteStream();
    blobStream.write(file);
    blobStream.on("error", (err) => {
        console.error(err);
        throw new Error("Failed to upload image");
    });
    blobStream.on("finish", () => {
        console.info(`Image ${fileName} uploaded`);
    });
    blobStream.end(file);
    return `https://storage.googleapis.com/${process.env.GCP_SECONDARY_BUCKET_NAME}/${filePath}`;
}

// Optional for Options:
// Set a generation-match precondition to avoid potential race conditions
// and data corruptions. The request to upload is aborted if the object's
// generation number does not match your precondition. For a destination
// object that does not yet exist, set the ifGenerationMatch precondition to 0
// If the destination object already exists in your bucket, set instead a
// generation-match precondition using its generation number.
