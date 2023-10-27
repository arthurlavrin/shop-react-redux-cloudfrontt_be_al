import {getProductsById} from "@functions/getProductsById/handler";
import {APIGatewayProxyEvent} from "aws-lambda";
import {lunarTerritoryProductsListData} from "@functions/getProductsList/mock";

jest.mock('../../../libs/lambda');

describe('getProductsById', () => {
  test('handler', async () => {
    const event = {
      pathParameters: {
        id: 1,
      },
    } as unknown as APIGatewayProxyEvent;

    const response = await getProductsById(event);

    expect(response).toEqual({
      body: JSON.stringify(lunarTerritoryProductsListData[0]),
      statusCode: 200,
    });
  });
});