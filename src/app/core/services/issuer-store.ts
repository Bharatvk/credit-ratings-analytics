import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, finalize, shareReplay, tap } from 'rxjs/operators';
import { ApiError } from '../models/api.model';
import { IssuerDetailResponse } from '../models/issuer.model';
import { IssuerService } from './issuer';

export type IssuerDetailStatus = 'idle' | 'loading' | 'success' | 'error';

export interface IssuerDetailState {
  status: IssuerDetailStatus;
  issuerId: string | null;
  data: IssuerDetailResponse | null;
  error: ApiError | null;
}

@Injectable({
  providedIn: 'root',
})
export class IssuerStore {
  private readonly issuerDetailSubject = new BehaviorSubject<IssuerDetailState>({
    status: 'idle',
    issuerId: null,
    data: null,
    error: null,
  });

  private readonly inFlightRequests = new Map<string, Observable<IssuerDetailResponse>>();

  readonly issuerDetailState$ = this.issuerDetailSubject.asObservable();

  constructor(private readonly issuerService: IssuerService) {}

  loadIssuerDetail(issuerId: string, options: { force?: boolean } = {}): Observable<IssuerDetailResponse> {
    const current = this.issuerDetailSubject.value;

    if (!issuerId) {
      const error = this.createClientError('ISSUER_ID_MISSING', 'Issuer id is missing from the route.');
      this.issuerDetailSubject.next({ status: 'error', issuerId: null, data: null, error });
      return throwError(() => error);
    }

    if (!options.force && current.status === 'success' && current.issuerId === issuerId && current.data) {
      this.issuerDetailSubject.next(current);
      return of(current.data);
    }

    if (!options.force) {
      const existingRequest = this.inFlightRequests.get(issuerId);
      if (existingRequest) {
        this.issuerDetailSubject.next(this.issuerDetailSubject.value);
        return existingRequest;
      }
    }

    this.issuerDetailSubject.next({
      status: 'loading',
      issuerId,
      data: current.issuerId === issuerId ? current.data : null,
      error: null,
    });

    const request$ = this.issuerService.getIssuerDetail(issuerId).pipe(
      tap((data) => {
        this.issuerDetailSubject.next({ status: 'success', issuerId, data, error: null });
      }),
      catchError((error: ApiError) => {
        this.issuerDetailSubject.next({ status: 'error', issuerId, data: null, error });
        return throwError(() => error);
      }),
      finalize(() => this.inFlightRequests.delete(issuerId)),
      shareReplay({ bufferSize: 1, refCount: false })
    );

    this.inFlightRequests.set(issuerId, request$);
    return request$;
  }

  private createClientError(code: string, message: string): ApiError {
    return {
      success: false,
      error: { code, message },
    };
  }
}
