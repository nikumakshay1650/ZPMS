import { Component, OnInit } from '@angular/core';
import { School, SchoolService } from '../school.service'; // Ensure this path is correct
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms'; // FormsModule for ngModel
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-school-objective',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,    // Needed for [(ngModel)]
    RouterModule  // Needed for routerLink (though navigation is programmatic here)
  ],
  providers: [DatePipe, SchoolService], // SchoolService provided here if not globally
  templateUrl: './school-objective.component.html',
  styleUrls: ['./school-objective.component.scss']
})
export class SchoolObjectiveComponent implements OnInit {

  allSchools: School[] = [];
  filteredSchools: School[] = [];

  selectedTaluka: string = 'सर्व तालुके';
  selectedSchoolName: string = 'सर्व शाळा';
  fromDate: string = '';
  toDate: string = '';
  searchTerm: string = '';
  entriesToShow: number = 10; // Default to 10

  availableTalukas: string[] = [];
  availableSchoolNames: string[] = [];

  isLoading: boolean = false; // To show loading indicators

  constructor(
    private schoolService: SchoolService,
    private datePipe: DatePipe, // Injected but not explicitly used in this TS, used in template via pipe
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadSchools();
  }

  loadSchools(): void {
    this.isLoading = true;
    this.schoolService.getAllSchools().subscribe({
      next: (data) => {
        this.allSchools = data.map(school => ({
          ...school,
          // Ensure id is a number for strict comparisons later if needed
          id: Number(school.id),
          // Backend should ideally send boolean. If it might be string "true"/"false", convert.
          isReportSubmitted: school.isReportSubmitted === true || String(school.isReportSubmitted).toLowerCase() === 'true'
        }));
        this.populateDropdowns();
        this.applyFilters(); // Apply filters after data is loaded
        this.isLoading = false;
        console.log('Schools loaded:', this.allSchools);
      },
      error: (error) => {
        console.error('Error fetching schools:', error);
        this.isLoading = false;
        // Display error to user
      }
    });
  }

  populateDropdowns(): void {
    this.availableTalukas = ['सर्व तालुके', ...Array.from(new Set(this.allSchools.map(s => s.taluka).filter(Boolean)))].sort();
    this.updateSchoolNameDropdown(); // Call to populate school names based on initial taluka
  }

  onTalukaChange(): void {
    this.selectedSchoolName = 'सर्व शाळा'; // Reset school name when taluka changes
    this.updateSchoolNameDropdown();
    this.applyFilters();
  }

  updateSchoolNameDropdown(): void {
    let schoolsForDropdown = this.allSchools;
    if (this.selectedTaluka && this.selectedTaluka !== 'सर्व तालुके') {
      schoolsForDropdown = this.allSchools.filter(s => s.taluka === this.selectedTaluka);
    }
    this.availableSchoolNames = ['सर्व शाळा', ...Array.from(new Set(schoolsForDropdown.map(s => s.schoolName).filter(Boolean)))].sort();
  }

  applyFilters(): void {
    let schools = [...this.allSchools];

    if (this.selectedTaluka && this.selectedTaluka !== 'सर्व तालुके') {
      schools = schools.filter(s => s.taluka === this.selectedTaluka);
    }

    if (this.selectedSchoolName && this.selectedSchoolName !== 'सर्व शाळा') {
      schools = schools.filter(s => s.schoolName === this.selectedSchoolName);
    }

    if (this.fromDate) {
      const from = new Date(this.fromDate);
      from.setHours(0, 0, 0, 0);
      schools = schools.filter(s => {
        if (!s.date) return false;
        const schoolDate = new Date(s.date); // Assuming s.date is a string like 'YYYY-MM-DD'
        return schoolDate >= from;
      });
    }
    if (this.toDate) {
      const to = new Date(this.toDate);
      to.setHours(23, 59, 59, 999); // Consider end of day
      schools = schools.filter(s => {
        if (!s.date) return false;
        const schoolDate = new Date(s.date);
        return schoolDate <= to;
      });
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      schools = schools.filter(s =>
        s.schoolName?.toLowerCase().includes(term) ||
        s.headmastersName?.toLowerCase().includes(term) ||
        s.udiseNumber?.toLowerCase().includes(term) ||
        s.taluka?.toLowerCase().includes(term) ||
        s.headmastersMobileNumber?.includes(term) // Mobile number search might not need toLowerCase
      );
    }
    this.filteredSchools = schools;
  }

  onShowClick(): void {
    this.applyFilters();
  }

  onRemoveFiltersClick(): void {
    this.selectedTaluka = 'सर्व तालुके';
    this.selectedSchoolName = 'सर्व शाळा';
    this.fromDate = '';
    this.toDate = '';
    this.searchTerm = '';
    this.updateSchoolNameDropdown(); // Reset school dropdown based on taluka
    this.applyFilters();
  }

  exportToExcel(): void {
    // Basic implementation idea: Convert filteredSchools to CSV or use a library like 'xlsx'
    console.log('Exporting to Excel...', this.filteredSchools);
    if (this.filteredSchools.length === 0) {
      alert('No data to export.');
      return;
    }
    alert('Excel export functionality needs a dedicated library (e.g., xlsx). See console for data.');
  }

  navigateToFillVisitForm(schoolId?: number): void {
    if (typeof schoolId !== 'number') {
      console.error('School ID is undefined or not a number. Cannot navigate. ID was:', schoolId);
      alert('त्रुटी: शाळेचा आयडी उपलब्ध नाही.');
      return;
    }
    console.log('Navigating to fill form for school ID:', schoolId);
    this.router.navigate(['/school-visit-form', schoolId]);
  }

  navigateToViewVisitReport(schoolId?: number): void {
    if (typeof schoolId !== 'number') {
      console.error('School ID is undefined or not a number. Cannot navigate. ID was:', schoolId);
      alert('त्रुटी: शाळेचा आयडी उपलब्ध नाही.');
      return;
    }
    console.log('Navigating to view report for school ID:', schoolId);
    this.router.navigate(['/view-school-visit-report', schoolId]);
  }

  getSchoolType(category?: string): string {
    return category || 'N/A';
  }
}