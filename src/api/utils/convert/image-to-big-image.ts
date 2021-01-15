import { getConfig } from "../..";
import { Image } from '../../../schema'

export type ImageAquila = {
  url: string
  alt: string
  default: boolean
}

export default function convertToBigImage(images: ImageAquila[]): {
  node: Pick<
    Image,
    "urlOriginal" | "altText" | "isDefault"
  >
}[] {
  const allImages = [];
  const config = getConfig()
  for (let i = 0; i < images.length; i++) {
    const oneImage = images[i];
    allImages.push({
      node: {
        urlOriginal: `${config.commerceUrl}/${oneImage.url}`,
        altText: oneImage.alt,
        isDefault: oneImage.default,
      },
      cursor: ''
    });
  }
  return allImages;
};