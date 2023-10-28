export type Product = {
  description: string,
  id: string,
  price: number,
  title: string,
  count: number,
}

export type Stock = {
  ProductId: string,
  count: number,
}
