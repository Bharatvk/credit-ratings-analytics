import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Issuer as IssuerModel, IssuerDetailResponse } from '../models/issuer.model';
import { ApiError } from '../models/api.model';

@Injectable({
  providedIn: 'root',
})
export class IssuerService {
  constructor(private readonly http: HttpClient) {}

  getIssuers(): Observable<IssuerModel[]> {
    return this.http
      .get<IssuerModel[]>('/api/issuers')
      .pipe(catchError((error) => this.toApiError(error, 'ISSUER_LIST_LOAD_FAILED', 'Unable to load issuers right now. Please try again.')));
  }

  getIssuerDetail(issuerId: string): Observable<IssuerDetailResponse> {
    return this.http.get<IssuerDetailResponse>(`/api/issuers/${issuerId}`).pipe(
      catchError((error) =>
        this.toApiError(error, 'ISSUER_DETAIL_LOAD_FAILED', 'Unable to load issuer details right now. Please try again.')
      )
    );
  }

  private toApiError(
    error: unknown,
    fallbackCode: string,
    fallbackMessage: string
  ): Observable<never> {
    const httpError = error as HttpErrorResponse;
    const apiError = httpError?.error as ApiError | undefined;

    return throwError(() => ({
      success: false,
      error: {
        code: apiError?.error?.code ?? fallbackCode,
        message: apiError?.error?.message ?? fallbackMessage,
      },
    } as ApiError));
  }
}
