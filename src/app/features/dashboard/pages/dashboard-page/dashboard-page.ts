import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { ButtonDirective } from 'primeng/button';
import { IssuerTable } from '../../components/issuer-table/issuer-table';
import { LoadingState } from '../../../../shared/components/loading-state/loading-state';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { ErrorState } from '../../../../shared/components/error-state/error-state';
import { IssuerService } from '../../../../core/services/issuer';
import { Issuer } from '../../../../core/models/issuer.model';
import { ApiError } from '../../../../core/models/api.model';

@Component({
  selector: 'app-dashboard-page',
  imports: [FormsModule, InputText, ButtonDirective, IssuerTable, LoadingState, EmptyState, ErrorState],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage implements OnInit {
  issuers: Issuer[] = [];
  filteredIssuers: Issuer[] = [];
  searchTerm = '';
  loading = true;
  errorMessage = '';

  constructor(
    private readonly issuerService: IssuerService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadIssuers();
  }

  loadIssuers(): void {
    this.loading = true;
    this.errorMessage = '';

    this.issuerService.getIssuers().subscribe({
      next: (issuers) => {
        this.issuers = issuers;
        this.applyFilter();
        this.loading = false;
      },
      error: (error: ApiError) => {
        this.errorMessage = error?.error?.message ?? 'Unable to fetch issuer list.';
        this.loading = false;
      },
    });
  }

  applyFilter(): void {
    const query = this.searchTerm.trim().toLowerCase();
    if (!query) {
      this.filteredIssuers = [...this.issuers];
      return;
    }

    this.filteredIssuers = this.issuers.filter((issuer) =>
      [issuer.name, issuer.industry].some((field) => field.toLowerCase().includes(query))
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilter();
  }

  openIssuer(issuerId: string): void {
    this.router.navigate(['/issuer', issuerId]);
  }
}
