// src/app/arogya.service.ts
// *** THIS IS THE COMPLETE AND CORRECTED SERVICE FILE ***

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Interface for the Report Component
export interface Hospital {
  id?: number;
  phcName: string;
  subcenterName: string;
  villagePhcId: string;
  monthName: string;
  [key: string]: any;
}

// FIX #1: Add the missing ChecklistData interface
export interface ChecklistData {
    taluka: string;
    prathmik_arogya_kendra: string;
    bheticha_dinank: string;
}

@Injectable({
  providedIn: 'root'
})
export class ArogyaService {
  private apiUrl = 'http://localhost:8080/api/hospitals';

  constructor(private http: HttpClient) { }

  getAllHospitals(): Observable<Hospital[]> {
    return this.http.get<Hospital[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  getTalukas(): Observable<string[]> {
    return of(['सर्व तालुके', 'Kalmeshwar', 'Hingna', 'Bhiwapur', 'Ramtek', 'Nagpur']);
  }

  // FIX #2: Add the missing getArogyaKendras method
  getArogyaKendras(taluka: string): Observable<string[]> {
    const allKendras: { [key: string]: string[] } = {
      'Kalmeshwar': ['Dhapewada', 'Mohpa'],
      'Hingna': ['Adegaon', 'Kanholibara'],
      'Bhiwapur': ['Jawli', 'Nand', 'Temburdoha'],
    };
    return of(allKendras[taluka] || []);
  }

  // FIX #3: Add the missing submitChecklist method
  submitChecklist(data: ChecklistData): Observable<any> {
    console.log('DEMO SUBMIT:', data);
    return of({ success: true });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server returned code ${error.status}, error message is: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}