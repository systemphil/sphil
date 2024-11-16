import { Storage } from "@google-cloud/storage";
import { env } from "process";

/* cSpell:disable */

const rawKey = env.GCP_BUCKET_HANDLER_KEY ?? "";

const creds = rawKey
    ? JSON.parse(Buffer.from(rawKey, "base64").toString())
    : {};

const storage =
    process.env.NODE_ENV === "development"
        ? new Storage({
              projectId: creds.project_id,
              credentials: creds,
          })
        : new Storage();

const PRIMARY_BUCKET_NAME = env.GCP_PRIMARY_BUCKET_NAME ?? "invalid";
const SECONDARY_BUCKET_NAME = env.GCP_SECONDARY_BUCKET_NAME ?? "invalid";

/**
 * Storage bucket reference instance. Call methods on this object to interact with the bucket.
 * @see https://cloud.google.com/nodejs/articles/reference/storage/latest
 */
export const primaryBucket = storage.bucket(PRIMARY_BUCKET_NAME);
export const secondaryBucket = storage.bucket(SECONDARY_BUCKET_NAME);
