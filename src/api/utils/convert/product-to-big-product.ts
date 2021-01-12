import imageToBigImage from './image-to-big-image'

export declare type attributes = {
  type: string;
  position: number;
  visible: boolean;
  _id: string;
  id: any;
  code: string;
  param: string;
  name: string;
  value: string;
}

const TYPES = [
  'color',
  'multiselect'
]

const DISPLAY_TYPES: any = {
  'color': 'Color',
  'multiselect': 'MultipleChoiceOption'
}

export default function productToBigProduct(product: any, locale: string | undefined): any {
  if (!locale) return {}
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
      edges: [],
    },
    productOptions: {
      edges: product?.attributes
        .filter((att: attributes) => TYPES.indexOf(att?.type) !== -1)
        .map((att: attributes) => {
        let hexColors = null;
        if (att?.value) {
          hexColors = Array.isArray(att.value) ? att.value : [att.value];
        }
        return {
          node: {
            __typename: 'MultipleChoiceOption',
            displayName: DISPLAY_TYPES[att.type],
            values: {
              edges: [
                {
                  node: att.type === 'color' ? {
                    label: att.name ?? 'no name',
                    isDefault: false,
                    hexColors
                  } : {
                    label: att.name ?? 'no name'
                  }
                }
              ]
            }
          }
        }
      }) ?? [],
    },
  }
};
