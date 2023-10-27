import {getProductsList} from "../handler";
import {lunarTerritoryProductsListData} from "@functions/getProductsList/mock";

jest.mock('../../../libs/lambda');

describe('getProductsList', () => {
  test('handler', async () => {
    const response = await getProductsList();

    expect(response).toEqual({
      body: JSON.stringify(lunarTerritoryProductsListData),
      statusCode: 200,
    });
  });
});