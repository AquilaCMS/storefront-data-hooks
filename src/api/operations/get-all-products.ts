import type {
  GetAllProductsQuery,
  GetAllProductsQueryVariables,
} from "../../schema";
import type { RecursivePartial } from "../utils/types";
import setProductLocaleMeta from "../utils/set-product-locale-meta";
import { productConnectionFragment } from "../fragments/product";
import { AquilacmsConfig, getConfig } from "..";
import productsToBigProducts from "../utils/convert/products-to-big-products";

export const getAllProductsQuery = /* GraphQL */ `
  query getAllProducts(
    $hasLocale: Boolean = false
    $locale: String = "null"
    $entityIds: [Int!]
    $first: Int = 10
    $products: Boolean = false
    $featuredProducts: Boolean = false
    $bestSellingProducts: Boolean = false
    $newestProducts: Boolean = false
  ) {
    site {
      products(first: $first, entityIds: $entityIds) @include(if: $products) {
        ...productConnnection
      }
      featuredProducts(first: $first) @include(if: $featuredProducts) {
        ...productConnnection
      }
      bestSellingProducts(first: $first) @include(if: $bestSellingProducts) {
        ...productConnnection
      }
      newestProducts(first: $first) @include(if: $newestProducts) {
        ...productConnnection
      }
    }
  }

  ${productConnectionFragment}
`;

export type ProductEdge = NonNullable<
  NonNullable<GetAllProductsQuery["site"]["products"]["edges"]>[0]
>;

export type ProductNode = ProductEdge["node"];

export type GetAllProductsResult<
  T extends Record<keyof GetAllProductsResult, any[]> = {
    products: ProductEdge[];
  }
> = T;

const FIELDS = [
  "products",
  "featuredProducts",
  "bestSellingProducts",
  "newestProducts",
];

export type ProductTypes =
  | "products"
  | "featuredProducts"
  | "bestSellingProducts"
  | "newestProducts";

export type ProductVariables = { field?: ProductTypes } & Omit<
  GetAllProductsQueryVariables,
  ProductTypes | "hasLocale"
>;

async function getAllProducts(opts?: {
  variables?: ProductVariables;
  config?: AquilacmsConfig;
  preview?: boolean;
}): Promise<GetAllProductsResult>;

async function getAllProducts<
  T extends Record<keyof GetAllProductsResult, any[]>,
  V = any
>(opts: {
  query: string;
  variables?: V;
  config?: AquilacmsConfig;
  preview?: boolean;
}): Promise<GetAllProductsResult<T>>;

async function getAllProducts({
  query = getAllProductsQuery,
  variables: { field = "products", ...vars } = {},
  config,
}: {
  query?: string;
  variables?: ProductVariables;
  config?: AquilacmsConfig;
  preview?: boolean;
} = {}): Promise<GetAllProductsResult> {
  config = getConfig(config);

  const locale = (vars.locale || config.locale)?.split('-')[0];
  const variables: GetAllProductsQueryVariables = {
    ...vars,
    locale,
    hasLocale: !!locale,
  };

  if (!FIELDS.includes(field)) {
    throw new Error(
      `The field variable has to match one of ${FIELDS.join(", ")}`
    );
  }

  variables[field] = true;

  // RecursivePartial forces the method to check for every prop in the data, which is
  // required in case there's a custom `query`
  const options = {
    method: "POST",
    body: JSON.stringify({
      lang: locale,
      PostBody: {
        structure: {
          code: 1,
          id: 1,
          translation: 1,
          attributes: 1,
          pictos: 1,
          canonical: 1,
        },
        page: 1,
        limit: variables.first
      },
    }),
  };
  let products: any = await config.storeApiFetch('/v2/products', options);
  products = productsToBigProducts(products.datas, locale)

  if (locale && config.applyLocale) {
    products.forEach((product: RecursivePartial<ProductEdge>) => {
      if (product.node) setProductLocaleMeta(product.node);
    });
  }
  return { products };
}

export default getAllProducts;
