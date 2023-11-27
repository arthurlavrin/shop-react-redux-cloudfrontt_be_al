import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "import",
        cors: true,
        authorizer: {
          arn: "arn:aws:lambda:eu-west-1:003178017432:function:authorization-service-dev-basicAuthorizer",
          type: "request",
        },
      },
    },
  ],
};