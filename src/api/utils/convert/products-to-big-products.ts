import productToBigProduct from './product-to-big-product'
export default function productsToBigProducts(products: any, locale: string | undefined): any {
  if (!locale) return []
  return products.map((p: any) => {
    return {
      cursor: '',
      node: productToBigProduct(p, locale)
    }
  })
}