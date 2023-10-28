const {DynamoDBClient, PutItemCommand} = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({region: 'eu-west-1'});
const products = 'product';
const stocks = 'Stocks';

const addStocks = (product) => {
  const count = Math.floor(Math.random() * 100)
  const params = {
    TableName: stocks,
    Item: {
      ProductId: product.id,
      count: {N: count.toString()}
    }
  };

  const command = new PutItemCommand(params);

  return client
  .send(command)
  .then(() => {
    console.log(`Stock added: ${product.title.S}`);
  })
  .catch((error) => {
    console.error(`Error: ${error.message}`);
  });
}

const addProduct = (product) => {
  const params = {
    TableName: products,
    Item: product
  };

  const command = new PutItemCommand(params);

  return client
  .send(command)
  .then(() => {
    console.log(`Product added: ${product.title.S}`);
  })
  .then(() => {
    return addStocks(product);
  })
  .catch((error) => {
    console.error(`Error: ${error.message}`);
  });
}


(async () => {
  for (let i = 1; i <= 10; i++) {
    const product = {
      id: {S: i.toString()},
      title: {S: `LunarArea ${i}`},
      description: {S: `Lunar Area description ${i}`},
      price: {N: Math.floor(Math.random() * 1000 + 500).toString()}
    };
    await addProduct(product);
  }
})()