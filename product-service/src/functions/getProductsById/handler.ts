import { middyfy } from '@libs/lambda';
import { lunarTerritoryProductsListData } from './mock'
import {formatJSONResponse} from "@libs/api-gateway";
import { APIGatewayProxyEvent } from 'aws-lambda';
import {ErrorMessages, StatusCodeEnums} from "../../constants";

export const getProductsById = async (event: APIGatewayProxyEvent) => {
  const lunarTerritoryProduct = lunarTerritoryProductsListData.find(
      (item) => item.id === Number(event.pathParameters.id)
  );

  if (lunarTerritoryProduct) {
    return formatJSONResponse(lunarTerritoryProduct, StatusCodeEnums.SUCCESS)
  }

  return formatJSONResponse({ error: ErrorMessages.PRODUCT_NOT_FOUND }, StatusCodeEnums.NOT_FOUND)
};

export const main = middyfy(getProductsById);
export default main;
