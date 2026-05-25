import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EMPTY, Subscription, catchError, switchMap } from 'rxjs';
import { Breadcrumb } from 'primeng/breadcrumb';
import { StepsModule } from 'primeng/steps';
import { MenuItem, MessageService } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { ProgressSpinner } from 'primeng/progressspinner';
import { FeedbackStepUser } from '../../components/feedback-step-user/feedback-step-user';
import { FeedbackStepRatings } from '../../components/feedback-step-ratings/feedback-step-ratings';
import { FeedbackStepDetails } from '../../components/feedback-step-details/feedback-step-details';
import { FeedbackReview } from '../../components/feedback-review/feedback-review';
import { IssuerStore } from '../../../../core/services/issuer-store';
import { FeedbackService } from '../../../../core/services/feedback';
import { IssuerDetailResponse } from '../../../../core/models/issuer.model';
import { FeedbackRequest } from '../../../../core/models/feedback.model';
import { ApiError } from '../../../../core/models/api.model';
import { LoadingState } from '../../../../shared/components/loading-state/loading-state';
import { ErrorState } from '../../../../shared/components/error-state/error-state';

@Component({
  selector: 'app-feedback-page',
  imports: [
    ReactiveFormsModule,
    Breadcrumb,
    StepsModule,
    ButtonDirective,
    ProgressSpinner,
    FeedbackStepUser,
    FeedbackStepRatings,
    FeedbackStepDetails,
    FeedbackReview,
    LoadingState,
    ErrorState,
  ],
  templateUrl: './feedback-page.html',
  styleUrl: './feedback-page.scss',
})
export class FeedbackPage implements OnInit, OnDestroy {
  @ViewChild('stepHeading') private stepHeading?: ElementRef<HTMLHeadingElement>;

  readonly roleOptions = ['Credit Analyst', 'Portfolio Manager', 'Risk Manager', 'Other'];
  private readonly stepLabels = [
    { label: 'User Information' },
    { label: 'Ratings' },
    { label: 'Detailed Feedback' },
    { label: 'Review' },
  ];
  stepItems: MenuItem[] = [];

  feedbackForm: FormGroup;

  activeStep = 0;
  maxReachedStep = 0;
  isSubmitting = false;
  isLoading = true;
  errorMessage = '';
  detailData: IssuerDetailResponse | null = null;
  issuerId = '';
  breadcrumbItems: MenuItem[] = [];
  homeCrumb: MenuItem = { label: 'Dashboard', routerLink: '/dashboard' };

  private routeSubscription?: Subscription;
  private stateSubscription?: Subscription;

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly issuerStore: IssuerStore,
    private readonly feedbackService: FeedbackService,
    private readonly messageService: MessageService
  ) {
    this.feedbackForm = this.createForm();
    this.updateStepItems();
  }

  get userGroup(): FormGroup {
    return this.feedbackForm.get('user') as FormGroup;
  }

  get ratingsGroup(): FormGroup {
    return this.feedbackForm.get('ratings') as FormGroup;
  }

  get feedbackGroup(): FormGroup {
    return this.feedbackForm.get('feedback') as FormGroup;
  }

  get currentStepLabel(): string {
    return this.stepLabels[this.activeStep]?.label ?? '';
  }

  get stepperClass(): string {
    return `feedback-stepper completed-${this.activeStep}`;
  }

  get draftPayload(): FeedbackRequest | null {
    if (!this.detailData) {
      return null;
    }

    const formValue = this.feedbackForm.getRawValue();
    return {
      issuerId: this.detailData.issuer.id,
      user: {
        name: formValue.user?.name ?? '',
        email: formValue.user?.email ?? '',
        role: (formValue.user?.role ?? 'Other') as FeedbackRequest['user']['role'],
        organization: formValue.user?.organization || undefined,
      },
      ratings: {
        accuracy: Number(formValue.ratings?.accuracy ?? 0),
        driverRelevance: Number(formValue.ratings?.driverRelevance ?? 0),
        aiInsightQuality: Number(formValue.ratings?.aiInsightQuality ?? 0),
        timeliness: Number(formValue.ratings?.timeliness ?? 0),
      },
      feedback: {
        agreedDrivers: formValue.feedback?.agreedDrivers ?? [],
        disagreedDrivers: formValue.feedback?.disagreedDrivers ?? [],
        additionalFactors: formValue.feedback?.additionalFactors || undefined,
        comments: formValue.feedback?.comments || undefined,
      },
      metadata: {
        submittedAt: new Date().toISOString(),
        version: '1.0',
      },
    };
  }

  get agreedDriverTitles(): string[] {
    if (!this.detailData) {
      return [];
    }
    const selected = new Set(this.feedbackGroup.get('agreedDrivers')?.value as string[] | null);
    return this.detailData.drivers.filter((driver) => selected.has(driver.id)).map((driver) => driver.title);
  }

  get disagreedDriverTitles(): string[] {
    if (!this.detailData) {
      return [];
    }
    const selected = new Set(this.feedbackGroup.get('disagreedDrivers')?.value as string[] | null);
    return this.detailData.drivers.filter((driver) => selected.has(driver.id)).map((driver) => driver.title);
  }

  ngOnInit(): void {
    this.stateSubscription = this.issuerStore.issuerDetailState$.subscribe((state) => {
      if (state.issuerId !== this.issuerId) {
        return;
      }

      this.isLoading = state.status === 'loading';
      this.detailData = state.data;
      this.errorMessage = state.error?.error?.message ?? '';
      this.breadcrumbItems = state.data
        ? [
            { label: state.data.issuer.name, routerLink: ['/issuer', state.data.issuer.id] },
            { label: 'Feedback' },
          ]
        : [];
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

  nextStep(): void {
    const currentGroup = this.currentGroup();
    if (currentGroup?.invalid) {
      currentGroup.markAllAsTouched();
      return;
    }

    if (this.activeStep < this.stepLabels.length - 1) {
      this.activeStep += 1;
      this.maxReachedStep = Math.max(this.maxReachedStep, this.activeStep);
      this.updateStepItems();
      this.focusStepHeading();
    }
  }

  previousStep(): void {
    if (this.activeStep > 0) {
      this.activeStep -= 1;
      this.updateStepItems();
      this.focusStepHeading();
    }
  }

  goToIssuerDetail(): void {
    if (this.issuerId) {
      this.router.navigate(['/issuer', this.issuerId]);
    }
  }

  onStepChange(targetStep: number): void {
    if (this.isSubmitting) {
      return;
    }

    if (targetStep <= this.maxReachedStep) {
      this.activeStep = targetStep;
      this.updateStepItems();
      this.focusStepHeading();
      return;
    }

    this.messageService.add({
      severity: 'info',
      summary: 'Complete current step',
      detail: 'Please continue in order. Future steps unlock after valid progression.',
    });
  }

  currentStepInvalid(): boolean {
    const group = this.currentGroup();
    return Boolean(group?.invalid);
  }

  retryLoad(): void {
    if (!this.issuerId) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.issuerStore.loadIssuerDetail(this.issuerId, { force: true }).subscribe({
      error: () => {
        this.isLoading = false;
      },
    });
  }

  submit(): void {
    if (this.feedbackForm.invalid || !this.draftPayload) {
      this.feedbackForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.feedbackForm.disable();

    this.feedbackService.submitFeedback(this.draftPayload).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Feedback submitted',
          detail: response.message,
        });
        this.router.navigate(['/dashboard']);
      },
      error: (error: ApiError) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Submission failed',
          detail: error?.error?.message ?? 'Unable to submit feedback.',
        });
        this.isSubmitting = false;
        this.feedbackForm.enable();
      },
    });
  }

  private currentGroup(): FormGroup | null {
    if (this.activeStep === 0) {
      return this.userGroup;
    }
    if (this.activeStep === 1) {
      return this.ratingsGroup;
    }
    if (this.activeStep === 2) {
      return this.feedbackGroup;
    }
    return null;
  }

  private focusStepHeading(): void {
    setTimeout(() => this.stepHeading?.nativeElement.focus(), 0);
  }

  private updateStepItems(): void {
    this.stepItems = this.stepLabels.map((step, index) => ({
      ...step,
      disabled: index > this.maxReachedStep,
    }));
  }

  private createForm(): FormGroup {
    return this.fb.group({
      user: this.fb.group({
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        role: ['', Validators.required],
        organization: [''],
      }),
      ratings: this.fb.group({
        accuracy: [0, [Validators.required, Validators.min(1)]],
        driverRelevance: [0, [Validators.required, Validators.min(1)]],
        aiInsightQuality: [0, [Validators.required, Validators.min(1)]],
        timeliness: [0, [Validators.required, Validators.min(1)]],
      }),
      feedback: this.fb.group({
        agreedDrivers: this.fb.control<string[]>([]),
        disagreedDrivers: this.fb.control<string[]>([]),
        additionalFactors: ['', Validators.maxLength(500)],
        comments: ['', Validators.maxLength(1000)],
      }),
    });
  }
}
