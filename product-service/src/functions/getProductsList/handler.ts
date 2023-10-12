import { middyfy } from '@libs/lambda';
import { lunarTerritoryMockData } from './mock'
import {formatJSONResponse} from "@libs/api-gateway";
import {ErrorMessages, StatusCodeEnums} from "../../constants";

export const getProductsList = async () => {
  if (lunarTerritoryMockData.length) {
    return formatJSONResponse(lunarTerritoryMockData, StatusCodeEnums.SUCCESS)
  }

  return formatJSONResponse({ error: ErrorMessages.PRODUCTS_NOT_FOUND }, StatusCodeEnums.NOT_FOUND)
};

export const main = middyfy(getProductsList);
export default main;
