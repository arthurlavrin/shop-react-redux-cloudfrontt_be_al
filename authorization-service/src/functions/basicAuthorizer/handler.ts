import {
  APIGatewayAuthorizerResult,
  APIGatewayRequestAuthorizerEvent,
} from "aws-lambda";

const generateAuthResponse = ({ resource, username, effect }) => {
  return {
    principalId: username,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
};

const basicAuthorizer = async (
  event: APIGatewayRequestAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
  const { headers, methodArn } = event;
  const authorizationHeader = headers.Authorization;
  if (!authorizationHeader)
    return generateAuthResponse({
      resource: methodArn,
      username: "no user",
      effect: "Deny",
    });

  const encodedCreds = authorizationHeader.split(" ")[1];
  const decodedCredentials = Buffer.from(encodedCreds, "base64").toString(
    "utf-8"
  );
  const [username, password] = decodedCredentials.split(":");
  const isAuthorized =
    username === process.env.USER_LOGIN &&
    password === process.env.USER_PASSWORD;

  return generateAuthResponse({
    username,
    effect: isAuthorized ? "Allow" : "Deny",
    resource: methodArn,
  });
};

export const main = basicAuthorizer;
