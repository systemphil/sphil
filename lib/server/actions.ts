"use server";

import { validateAdminAccess } from "lib/auth/authFuncs";
import sharp from "sharp";
import {
    bucketGenerateReadSignedUrl,
    bucketPipeImageUpload,
} from "lib/bucket/bucketFuncs";
import { auth } from "lib/auth/authConfig";
import { z } from "zod";
import { dbVerifyVideoToUserId } from "lib/database/dbFuncs";

/**
 * @legacy Using old POST Api: Thanks to these resources for helping me understand how to do this!
 * @link https://stackoverflow.com/questions/62411430/post-multipart-form-data-to-serverless-next-js-api-running-on-vercel-now-sh/77353442#77353442
 * @link https://github.com/DanielOttodev/GoogleStorage-UploadTutorial/blob/master/index.js
 */
export async function actionUploadImage(formData: FormData) {
    const isAdmin = await validateAdminAccess();
    if (!isAdmin) {
        return { error: "Unauthorized" };
    }

    const imageFile = formData.get("image") as unknown as File | null;

    if (!imageFile) {
        return { error: "No image file found" };
    }

    const imageFileName = imageFile.name;
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());

    const editedImageBuffer = await sharp(imageBuffer)
        .jpeg({ quality: 80 })
        .toBuffer();

    const imageUrl = bucketPipeImageUpload({
        file: editedImageBuffer,
        fileName: `${imageFileName}`,
    });

    return {
        data: {
            imageUrl,
        },
    };
}

const refreshVideoSchema = z.object({
    videoId: z.string(),
    fileName: z.string(),
});
type RefreshVideoUrlInput = z.infer<typeof refreshVideoSchema>;

type ActionResponse<T> =
    | {
          status: "Ok";
          data: T;
          error: undefined;
      }
    | {
          status: "Error";
          data: undefined;
          error: string;
      };

export async function actionRefreshVideoUrl(
    input: RefreshVideoUrlInput
): Promise<ActionResponse<string>> {
    const session = await auth();

    if (!session?.user) {
        return { error: "Unauthorized", data: undefined, status: "Error" };
    }

    const parsedInput = refreshVideoSchema.safeParse(input);

    if (!parsedInput.success) {
        return {
            status: "Error",
            error: `Bad request ${parsedInput.error.message}`,
            data: undefined,
        };
    }

    const isOwner = dbVerifyVideoToUserId({
        videoId: input.videoId,
        userId: session.user.id,
    });

    if (!isOwner) {
        return { status: "Error", error: "Forbidden", data: undefined };
    }

    const newUrl = await bucketGenerateReadSignedUrl({
        id: input.videoId,
        fileName: input.fileName,
    });

    return {
        status: "Ok",
        data: newUrl,
        error: undefined,
    };
}
