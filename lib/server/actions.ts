import { validateAdminAccess } from "lib/auth/authFuncs";
import sharp from "sharp";
import { bucketPipeImageUpload } from "lib/bucket/bucketFuncs";

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
