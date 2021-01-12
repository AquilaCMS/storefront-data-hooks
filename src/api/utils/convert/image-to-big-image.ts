import { getConfig } from "../..";

export default function convertToBigImage(images: any) {
    const allImages = [];
    const config = getConfig()
    for (let indexImg = 0; indexImg < images.length; indexImg++) {
      const oneImage = images[indexImg];
      allImages.push({
        node: {
          urlOriginal: `${config.commerceUrl}/${oneImage.url}`,
          altText: oneImage.alt,
          isDefault: oneImage.default,
        },
      });
    }
    return allImages;
};