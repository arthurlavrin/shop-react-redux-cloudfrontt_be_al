import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { schema } from "./schema";

export const importProductsFile: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  try {
    const client = new S3Client({});
    const command = new PutObjectCommand({
      Bucket: "uploaded-artlav",
      Key: `uploaded/${event.queryStringParameters.filename}`,
      ContentType: "text/csv",
    });
    const signedUrl = await getSignedUrl(client, command, {
      expiresIn: 300,
    });
    return formatJSONResponse({
      signedUrl,
    });
  } catch (err) {
    console.log(err);

    return formatJSONResponse(
      {
        message: err,
      },
      400
    );
  }
};

export const main = importProductsFile
