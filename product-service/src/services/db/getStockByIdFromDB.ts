import {DynamoDBClient, GetItemCommand} from "@aws-sdk/client-dynamodb";
import { unmarshall }  from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({region: 'eu-west-1'});


export const getStockByIdFromDB = async (id: string) => {
  const params = {
    TableName: "Stocks",
    Key: {
      product_id: { S: id }
    }
  };
  const command = new GetItemCommand(params);
  const response = await client.send(command);
  const item = response.Item;
  if (item) {
    return unmarshall(item);
  }

  return item;
}