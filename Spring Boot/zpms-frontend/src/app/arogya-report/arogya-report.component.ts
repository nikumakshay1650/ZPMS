import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

// THIS IS THE CORRECTED IMPORT STATEMENT
import { Router } from '@angular/router';

import { ArogyaService, Hospital } from '../arogya.service';

@Component({
  selector: 'app-arogya-report',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './arogya-report.component.html',
  styleUrls: ['./arogya-report.component.scss']
})
export class ArogyaReportComponent implements OnInit {
  allData: Hospital[] = [];
  filteredData: Hospital[] = [];
  talukas$: Observable<string[]>;
  filterForm: FormGroup;
  searchTerm: string = '';

  constructor(
    private arogyaService: ArogyaService,
    private fb: FormBuilder,
    private router: Router // This will now inject the correct Angular Router
  ) {
    this.filterForm = this.fb.group({
      taluka: ['सर्व तालुके'],
      fromDate: [''],
      toDate: ['']
    });
    this.talukas$ = this.arogyaService.getTalukas();
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.arogyaService.getAllHospitals().subscribe({
      next: (data: Hospital[]) => {
        this.allData = data;
        this.filteredData = data;
        console.log('Successfully fetched data from database:', data);
      },
      error: (err: any) => {
        console.error('Failed to fetch data from database:', err);
        alert('Could not load data from the server. Please check the console for errors.');
      }
    });
  }

  // No changes needed in the filter/search methods below
  applyFilters(): void {
    const filters = this.filterForm.value;
    let data = [...this.allData];
    if (filters.taluka && filters.taluka !== 'सर्व तालुके') {
      data = data.filter(item => item.phcName === filters.taluka);
    }
    this.filteredData = data;
    this.applySearch();
  }
  
  applySearch(): void {
    const term = this.searchTerm.toLowerCase();
    if (!term) {
      this.applyFilters();
      return;
    }
    
    this.filteredData = this.filteredData.filter(item => 
      item.phcName.toLowerCase().includes(term) ||
      item.subcenterName.toLowerCase().includes(term) ||
      (item.monthName && item.monthName.toLowerCase().includes(term))
    );
  }

  resetFilters(): void {
    this.filterForm.reset({ taluka: 'सर्व तालुके', fromDate: '', toDate: '' });
    this.searchTerm = '';
    this.filteredData = [...this.allData];
  }

  exportToExcel(): void {
    alert('Excel export functionality to be implemented.');
  }

  // This function will now work correctly because `this.router` is the Angular Router
  fillRemainingInfo(item: Hospital): void {
    if (item.id) {
      this.router.navigate(['/arogya-form', item.id]);
    } else {
      alert('Error: This record does not have a valid ID.');
    }
  }
}