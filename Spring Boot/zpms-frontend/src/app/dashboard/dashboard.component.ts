import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { NgxChartsModule, LegendPosition } from '@swimlane/ngx-charts';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgChartsModule, NgxChartsModule, FormsModule,],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isBrowser: boolean = false;

  // Date filters
  fromDate: string = '';
  toDate: string = '';

  // Target data
  totalTarget: number = 37;
  todayTarget: number = 0;
  completedTarget: number = 13;

  totalData = { anganwadi: 3, school: 26, health: 8 };
  todayData = { anganwadi: 0, school: 0, health: 0 };
  completedData = { anganwadi: 2, school: 9, health: 2 };

  // Taluka selection
  selectedTaluka: string = 'तालुका १';
  selectedTalukaLeft: string = 'तालुका १';
  selectedTalukaRight: string = 'तालुका १';
  talukaOptions: string[] = ['तालुका १', 'तालुका २', 'तालुका ३'];

  // Month selection
  selectedMonth: string = 'जानेवारी, २०२३';

  // Chart Types
  // public barChartType: ChartType = 'bar';
  public barChartType: 'bar' = 'bar';

  // public buildingTypePieChartType: ChartType = 'pie';
  // public facilityBarChartType: ChartType = 'bar';
// dashboard.component.ts
buildingTypePieChartType: 'pie' = 'pie';
facilityBarChartType: 'bar' = 'bar';

  // Chart Plugins
  public buildingTypePieChartPlugins = [ChartDataLabels];

  // Chart data (ng2-charts)
  public talukaVisitsChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['तालुका १', 'तालुका २', 'तालुका ३'],
    datasets: [{ data: [65, 59, 80], label: 'भेटी' }]
  };

  public monthlyVisitsChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['जानेवारी', 'फेब्रुवारी', 'मार्च'],
    datasets: [{ data: [28, 48, 40], label: 'भेटी' }]
  };

  public buildingTypePieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['पक्की इमारत', 'कच्ची इमारत', 'भाड्याची इमारत', 'इतर'],
    datasets: [{
      data: [40, 20, 15, 25],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
    }]
  };

  public facilityBarChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['स्वच्छतागृह', 'पिण्याचे पाणी', 'स्वयंपाक घर'],
    datasets: [{ data: [80, 60, 40], label: 'सुविधा' }]
  };

  // Chart options
  public talukaVisitsChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'तालुकानुसार भेटी' }
    }
  };

  public monthlyVisitsChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'महिन्यानुसार भेटी' }
    }
  };

  public buildingTypePieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'इमारत प्रकार' },
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels?.[ctx.dataIndex] || '';
          return `${label}: ${value}%`;
        },
      }
    }
  };

  public facilityBarChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'सोई सुविधा' }
    }
  };

  // ngx-charts data
  pieChartData = [
    { name: 'पक्की इमारत', value: 40 },
    { name: 'कच्ची इमारत', value: 20 },
    { name: 'भाड्याची इमारत', value: 15 },
    { name: 'इतर', value: 25 }
  ];

  barChartData = [
    { name: 'स्वच्छतागृह', value: 80 },
    { name: 'पिण्याचे पाणी', value: 60 },
    { name: 'स्वयंपाक घर', value: 40 }
  ];

  legendPosition = LegendPosition.Below;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      console.log('DashboardComponent initialized in browser');
    }
  }

  // Handlers
  applyDateRange(): void {
    console.log('Apply Date Range:', this.fromDate, this.toDate);
    // Add fetch/filter logic
  }

  resetFilters(): void {
    this.fromDate = '';
    this.toDate = '';
    console.log('Filters reset');
  }

  onTalukaChange(): void {
    console.log('Taluka changed to:', this.selectedTaluka);
    // Add taluka-based data fetch
  }

  onMonthChange(): void {
    console.log('Month changed to:', this.selectedMonth);
    // Add month-based data fetch
  }
}
