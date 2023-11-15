import { middyfy } from '@libs/lambda';
import {formatJSONResponse} from "@libs/api-gateway";
import { APIGatewayProxyEvent } from 'aws-lambda';
import {ErrorMessages, StatusCodeEnums} from "../../constants";
import { getProductsByIdFromDB, getStockByIdFromDB } from '@services/db';

export const getProductsById = async (event: APIGatewayProxyEvent) => {
  let product;
  let stock;
  let response;

  try {
    console.log('event', event);

    const { id } = event.pathParameters;
    [product, stock] = await Promise.all([getProductsByIdFromDB(id), getStockByIdFromDB(id)]);

    response = formatJSONResponse({product: {
        ...product,
        count: stock?.count || 0
      }}, StatusCodeEnums.SUCCESS)
  } catch (e) {
    return formatJSONResponse({ error: ErrorMessages.PRODUCT_NOT_FOUND }, StatusCodeEnums.NOT_FOUND)
  }

  if(!product) {
    return formatJSONResponse({ error: ErrorMessages.PRODUCT_NOT_FOUND }, StatusCodeEnums.NOT_FOUND)
  }

  return response
};

export const main = middyfy(getProductsById);
export default main;
