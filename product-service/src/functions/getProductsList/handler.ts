import {ErrorMessages, StatusCodeEnums} from "../../constants";
import {formatJSONResponse} from "@libs/api-gateway";
import { getProductsListFromDB, getStocksListFromDB } from '@services/db';
import {middyfy} from "@libs/lambda";

const mergeTo = (product, stocks) => {
  return product.map(product => ({
    ...product,
    count: stocks.find(({ProductId}) => ProductId === product.id).count || 0
  }))
}

export const getProductsList = async (event) => {
  console.log('event', event);

  try {
    const [products, stocks] = await Promise.all([getProductsListFromDB(),getStocksListFromDB() ]);
    const result = mergeTo(products, stocks);

    return formatJSONResponse(result, StatusCodeEnums.SUCCESS)
  } catch (e) {
    return formatJSONResponse({ error: ErrorMessages.PRODUCTS_NOT_FOUND }, StatusCodeEnums.NOT_FOUND)
  }
};

export const main = middyfy(getProductsList);
export default main;