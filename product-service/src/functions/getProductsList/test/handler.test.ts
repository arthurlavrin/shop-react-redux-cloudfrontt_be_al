import {getProductsList} from "../handler";
import {lunarTerritoryMockData} from "../mock";

jest.mock('../../../libs/lambda');

describe('getProductsList', () => {
  test('handler', async () => {
    const response = await getProductsList();

    expect(response).toEqual({
      body: JSON.stringify(lunarTerritoryMockData),
      statusCode: 200,
    });
  });
});