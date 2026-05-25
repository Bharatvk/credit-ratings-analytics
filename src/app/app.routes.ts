import { Routes } from '@angular/router';
import { DashboardPage } from './features/dashboard/pages/dashboard-page/dashboard-page';
import { IssuerDetailPage } from './features/issuer-detail/pages/issuer-detail-page/issuer-detail-page';
import { FeedbackPage } from './features/feedback/pages/feedback-page/feedback-page';
import { NotFoundPage } from './features/not-found/not-found-page/not-found-page';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardPage, canActivate: [authGuard] },
  { path: 'issuer/:id', component: IssuerDetailPage, canActivate: [authGuard] },
  { path: 'issuer/:id/feedback', component: FeedbackPage, canActivate: [authGuard] },
  { path: '**', component: NotFoundPage },
];
