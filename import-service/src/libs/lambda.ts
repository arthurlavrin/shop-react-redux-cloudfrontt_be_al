import middy from "@middy/core";
import middyJsonBodyParser from "@middy/http-json-body-parser";
import validator from "@middy/validator";
import { transpileSchema } from "@middy/validator/transpile";
import httpErrorHandler from "@middy/http-error-handler";

export const middyfy = (handler, eventSchema) => {
  return middy(handler)
  .use(middyJsonBodyParser())
  .use(validator({ eventSchema: transpileSchema(eventSchema) }))
  .use(httpErrorHandler());
};
