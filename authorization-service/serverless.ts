import type { AWS } from "@serverless/typescript";

import basicAuthorizer from "@functions/basicAuthorizer";

const serverlessConfiguration: AWS = {
  service: "authorization-service",
  frameworkVersion: "3",
  plugins: [
    "serverless-esbuild",
    "serverless-dotenv-plugin",
    "serverless-offline",
  ],
  useDotenv: true,
  provider: {
    name: "aws",
    region: "eu-west-1",
    runtime: "nodejs18.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
    httpApi: {
      authorizers: {
        basicAuthorizer: {
          name: "basicAuthorizer",
          type: "request",
          enableSimpleResponses: true,
          functionName: "basicAuthorizer",
        },
      },
    },
  },
  functions: { basicAuthorizer },
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
  },
};

module.exports = serverlessConfiguration;
