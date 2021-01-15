import { Image } from "src/schema";
import productToProductOptions from "./product-to-product-options";
import imageToBigImage from './image-to-big-image'

export default function productToBigProductVariant(product: any): any {
  const variant: {
    inventory?: any,
    productOptions: any,
    defaultImage?: Pick<
      Image,
      "urlOriginal" | "altText" | "isDefault"
    >
  } = {
    inventory: null,
    productOptions: productToProductOptions(product?.attributes)
  }
  const images: any = imageToBigImage(product.images)
  if (images.length > 0) {
    variant.defaultImage = {
        ...images.filter((i: any) => i.isDefault)[0]
      }
  }
  return variant
}