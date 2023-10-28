import {DynamoDBClient, ScanCommand} from "@aws-sdk/client-dynamodb";
const { unmarshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({region: 'eu-west-1'});

const params = {
  TableName: "product",
};

export const getProductsListFromDB = async () => {
  const command = new ScanCommand(params);
  const response = await client.send(command);
  const products = response.Items.map(item => unmarshall(item));
  return products;
}