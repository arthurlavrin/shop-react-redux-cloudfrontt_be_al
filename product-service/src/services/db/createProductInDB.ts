import {DynamoDBClient, PutItemCommand} from "@aws-sdk/client-dynamodb";
import {Product} from "../../types";

const client = new DynamoDBClient({region: 'eu-west-1'});

export const createProductInDB = async (product: Omit<Product, 'count'>) => {
  const params = {
    TableName: "product",
    Item: {
      id: { S: product.id },
      description: { S: product.description },
      price: { N: product.price.toString() },
      title: { S: product.title },
    },
  };
  const command = new PutItemCommand(params);

  return client.send(command);
}