import {DynamoDBClient, ScanCommand} from "@aws-sdk/client-dynamodb";
import { unmarshall }  from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({region: 'eu-west-1'});

const params = {
  TableName: "Stocks",
};

export const getStocksListFromDB = async () => {
  const command = new ScanCommand(params);
  const response = await client.send(command);
  const stocks = response.Items.map(item => unmarshall(item));
  return stocks;
}