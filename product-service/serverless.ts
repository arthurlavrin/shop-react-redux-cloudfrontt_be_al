import type { AWS } from '@serverless/typescript';

import { getProducts, getProductsById, createProduct } from 'src/functions';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-auto-swagger', 'serverless-esbuild', 'serverless-webpack'],
  provider: {
    name: 'aws',
    region: 'eu-west-1',
    stage: 'dev',
    runtime: 'nodejs18.x',
    httpApi: {
      cors: true,
    },
    iam: {
      role: {
        managedPolicies: ['arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess']
      },
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      TABLE_PRODUCT: 'product'
    },
  },
  // import the function via paths
  functions: { getProducts, getProductsById, createProduct },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    webpack: {
      excludeFiles: '**/*.spec.ts'
    },
  },
  resources: {
    Resources: {
      ProductsTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          AttributeDefinitions: [{
            AttributeName: 'id',
            AttributeType: 'S'
          }],
          KeySchema:  [{
            AttributeName: 'id',
            KeyType: 'HASH'
          }],
          TableName: 'product',
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
          }
        }
      },
      StocksTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'Stocks',
          AttributeDefinitions: [
            {
              AttributeName: 'ProductId',
              AttributeType: 'S'
            }
          ],
          KeySchema: [
            {
              AttributeName: 'ProductId',
              KeyType: 'HASH'
            }
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
          }
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
