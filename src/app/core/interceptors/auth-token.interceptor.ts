import { HttpInterceptorFn } from '@angular/common/http';

const DEMO_BEARER_TOKEN = 'demo-case-study-token';

export const authTokenInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith('/api/')) {
    return next(request);
  }

  const requestWithAuth = request.clone({
    setHeaders: {
      Authorization: `Bearer ${DEMO_BEARER_TOKEN}`,
    },
  });

  return next(requestWithAuth);
};
