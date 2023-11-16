import {Handler, SQSEvent} from "aws-lambda";
import {PublishCommand, SNSClient} from "@aws-sdk/client-sns";
import {createProductInDB} from "@services/db";
import {Product} from "../../types";

const sendData = async (product: Product) => {
  const snsClient = new SNSClient({ region: "eu-west-1" });

  try {
    return await snsClient.send(
      new PublishCommand({
        TopicArn: "arn:aws:sns:eu-west-1:003178017432:createProductTopic",
        Message: `The product ${product.description} has been added. The price is ${product.price}`,
        Subject: "The new product has been added",
        MessageAttributes: {
          productPrice: {
            DataType: "Number",
            StringValue: String(product.price),
          },
        },
      })
    );
  } catch (e) {
    console.log("SNS Error: ", e);
  }
};

export const handler: Handler = async (event: SQSEvent) => {
  try {
    await Promise.all(
      event.Records.map(async (record) => {
        const product = JSON.parse(record.body);

        await createProductInDB(product);
        await sendData(product);

        return Promise.resolve("success");
      })
    );

    return {
      message: "success",
    };
  } catch (error) {
    console.log("error", error);
    return { error };
  }
};

export const main = handler
export default main;