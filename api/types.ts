/**
 * The demo API (automationexercise.com) answers most requests with HTTP 200
 * and reports the real outcome in `body.responseCode`. Every client call
 * therefore returns both values so tests can assert on the one that matters.
 */
export interface ApiResult<T> {
  httpStatus: number;
  body: T;
}

export interface ApiMessage {
  responseCode: number;
  message: string;
}

export interface Product {
  id: number;
  name: string;
  price: string;
  brand: string;
  category: {
    usertype: { usertype: string };
    category: string;
  };
}

export interface ProductsResponse {
  responseCode: number;
  products: Product[];
}

export interface Brand {
  id: number;
  brand: string;
}

export interface BrandsResponse {
  responseCode: number;
  brands: Brand[];
}

/** Payload accepted by POST /api/createAccount (form fields). */
export type UserAccount = {
  name: string;
  email: string;
  password: string;
  title: 'Mr' | 'Mrs';
  birth_date: string;
  birth_month: string;
  birth_year: string;
  firstname: string;
  lastname: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  zipcode: string;
  state: string;
  city: string;
  mobile_number: string;
};

export interface UserDetailResponse {
  responseCode: number;
  user: {
    id: number;
    name: string;
    email: string;
    title: string;
    first_name: string;
    last_name: string;
    company: string;
    address1: string;
    address2: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
  };
}
