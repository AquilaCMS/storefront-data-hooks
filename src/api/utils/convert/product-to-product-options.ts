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
export default function productToProductOptions(attributes: attributes[] | undefined): any {
  const productOptions = {
    edges: (attributes || null)
    ?.filter((att: attributes) => TYPES.indexOf(att.type) !== -1)
    .map((att: attributes) => {
      let hexColors = null;
      if (att?.value) {
        hexColors = Array.isArray(att.value) ? att.value : [att.value];
      }
      return {
        node: {
          __typename: 'MultipleChoiceOption',
          entityId: 0,
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
    })
  }
  return productOptions;
}