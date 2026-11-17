import { BaseApiClient } from './BaseApiClient';
import { ApiMessage, ApiResult, BrandsResponse, ProductsResponse } from './types';

export class ProductApi extends BaseApiClient {
  getAllProducts(): Promise<ApiResult<ProductsResponse>> {
    return this.get<ProductsResponse>('productsList');
  }

  /** POST is not supported on this endpoint — used for negative tests. */
  postToProductsList(): Promise<ApiResult<ApiMessage>> {
    return this.post<ApiMessage>('productsList');
  }

  searchProducts(term: string): Promise<ApiResult<ProductsResponse>> {
    return this.post<ProductsResponse>('searchProduct', { search_product: term });
  }

  /** Calls searchProduct without the required parameter — used for negative tests. */
  searchProductsWithoutTerm(): Promise<ApiResult<ApiMessage>> {
    return this.post<ApiMessage>('searchProduct');
  }

  getAllBrands(): Promise<ApiResult<BrandsResponse>> {
    return this.get<BrandsResponse>('brandsList');
  }
}
