import { formatJSONResponse } from '@libs/api-gateway';
import { v4 as uuidv4 } from 'uuid';
import { createProductInDB, createStockInDB } from '@services/db';
import { middyfy } from '@libs/lambda';

import {StatusCodeEnums} from "../../constants";

export const createProduct = async (event) => {
  try {
    const id = uuidv4();
    console.log('event', event);

    const { description, title, price, count } = event.body;

    await createProductInDB({
      description,
      title,
      price,
      id
    });
    await createStockInDB({
      count,
      ProductId: id
    });

    return formatJSONResponse({
      message: "Product created"
    }, StatusCodeEnums.SUCCESS);
  } catch ({message}) {
    return {
      ...formatJSONResponse(
        {
          message
        }, StatusCodeEnums.NOT_FOUND)
    }
  }
};

export const main = middyfy(createProduct);
export default main;