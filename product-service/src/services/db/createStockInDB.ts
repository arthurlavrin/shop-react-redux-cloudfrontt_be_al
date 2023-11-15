import {DynamoDBClient, PutItemCommand} from "@aws-sdk/client-dynamodb";
import {Stock} from "../../types";

const client = new DynamoDBClient({region: 'eu-west-1'});

export const createStockInDB = async ({ProductId, count}: Stock) => {
  const params = {
    TableName: "Stocks",
    Item: {
      ProductId: { S: ProductId },
      count: { N: count.toString() },
    },
  };
  const command = new PutItemCommand(params);
  return  client.send(command);
}