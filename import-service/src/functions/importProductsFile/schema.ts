import type { JSONSchema } from "json-schema-to-ts";

export const schema: JSONSchema = {
  type: "object",
  properties: {
    queryStringParameters: {
      type: "object",
      properties: {
        filename: {
          type: "string",
        },
      },
      required: ["filename"],
    },
  },
  required: ["queryStringParameters"],
};
