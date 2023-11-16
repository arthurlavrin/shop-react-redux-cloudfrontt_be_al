import type { AWS } from "@serverless/typescript";

import { importProductsFile, importFileParser } from "src/functions";

const serverlessConfiguration: AWS = {
  service: "import-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-offline", 'serverless-auto-swagger', 'serverless-webpack'],
  provider: {
    name: "aws",
    runtime: "nodejs18.x",
    httpApi: {
      cors: true,
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    region: "eu-west-1",
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },

    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: ["s3:*"],
            Resource: ["arn:aws:s3:::uploaded-artlav/*"],
          },
          {
            Effect: "Allow",
            Action: "sqs:*",
            Resource: "arn:aws:sqs:eu-west-1:003178017432:catalogItemsQueue",
          },
        ],
      },
    },
  },

  functions: { importProductsFile, importFileParser },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
    webpack: {
      excludeFiles: '**/*.spec.ts'
    },
  },
};

module.exports = serverlessConfiguration;
