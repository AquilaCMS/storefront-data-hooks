import imageToBigImage from './image-to-big-image'
import productToProductOptions from './product-to-product-options'
import productToBigProductVariant from './product-to-big-product-variant'

export default function productToBigProduct(product: any, locale: string | undefined): any {
  if (!product || !locale) return {}
  return {
    __typename: 'Product',
    entityId: product.code,
    name: product.name,
    path: `/${product?.slug[locale]}/`,
    description: product.description1?.text,
    prices: {
      price: {
        value: product.price?.ati?.normal,
        currencyCode: "EUR",
      },
      salePrice: null,
      retailPrice: null
    },
    images: {
      edges: imageToBigImage(product.images),
    },
    variants: {
      edges: [
        {
          node: productToBigProductVariant(product)
        }
      ],
    },
    productOptions: productToProductOptions(product?.attributes),
  }
};
