import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: "uploaded-artlav",
        existing: true,
        event: "s3:ObjectCreated:*",
        rules: [{ prefix: "uploaded/" }, { suffix: ".csv" }],
        cors: true
      },
    },
  ],
};
