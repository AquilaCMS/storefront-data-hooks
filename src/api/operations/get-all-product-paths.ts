import type {
  GetAllProductPathsQuery,
  GetAllProductPathsQueryVariables,
} from "../../schema";
import type { RecursivePartial, RecursiveRequired } from "../utils/types";
import filterEdges from "../utils/filter-edges";
import { AquilacmsConfig, getConfig } from "..";

export type getAllProductsResultAquila = {
  datas: any[],
  count: number,
  min: {
    et: number,
    ati: number
  },
  max: {
    et: number,
    ati: number
  },
  specialPriceMin: {
    et: number,
    ati: number
  },
  specialPriceMax: {
    et: number,
    ati: number
  }
}

export const getAllProductPathsQuery = /* GraphQL */ `
  query getAllProductPaths($first: Int = 100) {
    site {
      products(first: $first) {
        edges {
          node {
            path
          }
        }
      }
    }
  }
`;

export type ProductPath = NonNullable<
  NonNullable<GetAllProductPathsQuery["site"]["products"]["edges"]>[0]
>;

export type ProductPaths = ProductPath[];

export type { GetAllProductPathsQueryVariables };

export type GetAllProductPathsResult<
  T extends { products: any[] } = { products: ProductPaths }
> = T;

async function getAllProductPaths(opts?: {
  variables?: GetAllProductPathsQueryVariables;
  config?: AquilacmsConfig;
}): Promise<GetAllProductPathsResult>;

async function getAllProductPaths<
  T extends { products: any[] },
  V = any
>(opts: {
  query: string;
  variables?: V;
  config?: AquilacmsConfig;
}): Promise<GetAllProductPathsResult<T>>;

async function getAllProductPaths({
  query = getAllProductPathsQuery,
  variables,
  config,
}: {
  query?: string;
  variables?: GetAllProductPathsQueryVariables;
  config?: AquilacmsConfig;
} = {}): Promise<GetAllProductPathsResult> {
  config = getConfig(config);
  // RecursivePartial forces the method to check for every prop in the data, which is
  // required in case there's a custom `query`
  const locale: any = config.locale?.split('-')[0]
  const options = {
    method: 'POST',
    body: JSON.stringify({
      PostBody: {
        structure: {
          translation: 1
        },
        limit: 200,
        page: 1
      }
    })
  }
  try {
    const result: getAllProductsResultAquila = await config.storeApiFetch('/v2/products', options)

    return {
      products: result.datas.map(p => {
        return {
          node: {
            path: `/${p.slug[locale || 'en']}/`
          }
        }
      }
    )}
  } catch (err) {
    console.error(err)
  }
  return { products: [] }
}

export default getAllProductPaths;
