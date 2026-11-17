import { APIRequestContext, APIResponse } from '@playwright/test';
import { TRANSIENT_STATUSES, withRetry } from '../utils/retry';
import { ApiResult } from './types';

type FormData = Record<string, string>;

export abstract class BaseApiClient {
  constructor(
    protected readonly request: APIRequestContext,
    protected readonly baseUrl: string
  ) {}

  protected get<T>(path: string, params?: FormData): Promise<ApiResult<T>> {
    return this.send<T>(() => this.request.get(this.url(path), { params }));
  }

  protected post<T>(path: string, form?: FormData): Promise<ApiResult<T>> {
    return this.send<T>(() => this.request.post(this.url(path), { form }));
  }

  protected put<T>(path: string, form?: FormData): Promise<ApiResult<T>> {
    return this.send<T>(() => this.request.put(this.url(path), { form }));
  }

  protected delete<T>(path: string, form?: FormData): Promise<ApiResult<T>> {
    return this.send<T>(() => this.request.delete(this.url(path), { form }));
  }

  /** Retries only on gateway / overload statuses — never on real API errors. */
  private async send<T>(call: () => Promise<APIResponse>): Promise<ApiResult<T>> {
    const response = await withRetry(call, (res) => TRANSIENT_STATUSES.has(res.status()));
    return this.parse<T>(response);
  }

  private url(path: string): string {
    return `${this.baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  }

  private async parse<T>(response: APIResponse): Promise<ApiResult<T>> {
    const text = await response.text();
    try {
      return { httpStatus: response.status(), body: JSON.parse(text) as T };
    } catch {
      throw new Error(
        `Expected JSON from ${response.url()} (HTTP ${response.status()}), got: ${text.slice(0, 200)}`
      );
    }
  }
}
