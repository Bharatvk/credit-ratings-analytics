import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FeedbackRequest, FeedbackResponse } from '../models/feedback.model';
import { ApiError } from '../models/api.model';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  constructor(private readonly http: HttpClient) {}

  submitFeedback(payload: FeedbackRequest): Observable<FeedbackResponse> {
    return this.http.post<FeedbackResponse>('/api/feedback', payload).pipe(
      catchError((error) =>
        this.toApiError(error, 'FEEDBACK_SUBMIT_FAILED', 'Unable to submit feedback right now. Please retry in a moment.')
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
