import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Subscription, catchError, switchMap } from 'rxjs';
import { Breadcrumb } from 'primeng/breadcrumb';
import { ButtonDirective } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { IssuerStore } from '../../../../core/services/issuer-store';
import { IssuerDetailResponse } from '../../../../core/models/issuer.model';
import { IssuerOverview } from '../../components/issuer-overview/issuer-overview';
import { RatingHistory } from '../../components/rating-history/rating-history';
import { KeyDrivers } from '../../components/key-drivers/key-drivers';
import { AiInsight } from '../../components/ai-insight/ai-insight';
import { LoadingState } from '../../../../shared/components/loading-state/loading-state';
import { ErrorState } from '../../../../shared/components/error-state/error-state';

@Component({
  selector: 'app-issuer-detail-page',
  imports: [
    Breadcrumb,
    ButtonDirective,
    IssuerOverview,
    RatingHistory,
    KeyDrivers,
    AiInsight,
    LoadingState,
    ErrorState,
  ],
  templateUrl: './issuer-detail-page.html',
  styleUrl: './issuer-detail-page.scss',
})
export class IssuerDetailPage implements OnInit, OnDestroy {
  data: IssuerDetailResponse | null = null;
  loading = true;
  errorMessage = '';
  issuerId = '';
  breadcrumbItems: MenuItem[] = [];
  homeCrumb: MenuItem = { label: 'Dashboard', routerLink: '/dashboard' };

  private routeSubscription?: Subscription;
  private stateSubscription?: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly issuerStore: IssuerStore
  ) {}

  ngOnInit(): void {
    this.stateSubscription = this.issuerStore.issuerDetailState$.subscribe((state) => {
      if (state.issuerId !== this.issuerId) {
        return;
      }

      this.loading = state.status === 'loading';
      this.data = state.data;
      this.errorMessage = state.error?.error?.message ?? '';
      this.breadcrumbItems = state.data ? [{ label: state.data.issuer.name }] : [];
    });

    this.routeSubscription = this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.issuerId = params.get('id') ?? '';
          return this.issuerStore.loadIssuerDetail(this.issuerId).pipe(catchError(() => EMPTY));
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.stateSubscription?.unsubscribe();
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  openFeedback(): void {
    if (this.data) {
      this.router.navigate(['/issuer', this.data.issuer.id, 'feedback']);
    }
  }

  retry(): void {
    if (this.issuerId) {
      this.issuerStore.loadIssuerDetail(this.issuerId, { force: true }).subscribe({
        error: () => undefined,
      });
    }
  }
}
