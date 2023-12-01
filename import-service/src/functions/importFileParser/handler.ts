import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

import { S3Event } from "aws-lambda";
import csvParser from "csv-parser";

const sqsClient = new SQSClient({ region: "eu-west-1" });
const s3Client = new S3Client({ region: "eu-west-1" });

const getCopyCommand = (key: string) =>
  new CopyObjectCommand({
    Bucket: "uploaded-artlav",
    CopySource: `uploaded-artlav/${key}`,
    Key: key.replace("uploaded", "parsed"),
  });

const getDeleteCommand = (key: string) =>
  new DeleteObjectCommand({
    Bucket: "uploaded-artlav",
    Key: key,
  });

const importFileParser = async (event: S3Event) => {
  try {
    await Promise.all(
      event.Records.map(async (record) => {
        const stream = (
          await s3Client.send(
            new GetObjectCommand({
              Bucket: "uploaded-artlav",
              Key: record.s3.object.key,
            })
          )
        ).Body;

        return new Promise((resolve, reject) => {
          stream
          .pipe(csvParser())
          .on("data", async (data) => {
            try {
              await sqsClient.send(
                new SendMessageCommand({
                  QueueUrl:
                    "https://sqs.eu-west-1.amazonaws.com/003178017432/catalogItemsQueue",
                  DelaySeconds: 10,
                  MessageBody: JSON.stringify(data),
                })
              );
            } catch (error) {
              console.log(error, "error");
              reject(error);
            }
          })
          .on("error", (error) => {
            console.log(error, "error");
            reject(error);
          })
          .on("end", async () => {
            await s3Client.send(getCopyCommand(record.s3.object.key));
            await s3Client.send(getDeleteCommand(record.s3.object.key));

            resolve("success");
          });
        });
      })
    );

    return {
      message: "success",
    };
  } catch (error) {
    return { error };
  }
};

export const main = importFileParser;
