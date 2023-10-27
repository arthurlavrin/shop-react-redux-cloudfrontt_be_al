import { middyfy } from '@libs/lambda';
import {lunarTerritoryProductsListData} from './mock'
import {formatJSONResponse} from "@libs/api-gateway";
import {ErrorMessages, StatusCodeEnums} from "../../constants";

export const getProductsList = async () => {
  if (lunarTerritoryProductsListData.length) {
    return formatJSONResponse(lunarTerritoryProductsListData, StatusCodeEnums.SUCCESS)
  }

  return formatJSONResponse({ error: ErrorMessages.PRODUCTS_NOT_FOUND }, StatusCodeEnums.NOT_FOUND)
};

export const main = middyfy(getProductsList);
export default main;
