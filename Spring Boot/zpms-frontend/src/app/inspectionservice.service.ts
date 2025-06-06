import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'; // Added HttpErrorResponse
import { Observable, throwError } from 'rxjs'; // Added throwError
import { catchError } from 'rxjs/operators'; // Added catchError

export interface AnganwadiInspectionPayload {
  taluka: string;
  villageName: string;
  anganwadiNumber: string;
  workerName: string;
  anganwadiHelperName: string;
  workerHelperPresent: string;
  centerSurroundingsClean: string;
  centerCategory: string;
  buildingType: string;
  toiletAvailable: string;
  toiletUsage: string;
  drinkingWaterSupply: string;
  inspectionDate: string; // Expect yyyy-MM-dd from form
  electricitySupply: string;
  childrenWeightMeasured: number | null;
  normalWeightChildren: number | null;
  shera: string;
  totalEnrollment: number | null;
  childrenPresent: number | null;
  suwChildren: number | null;
  muwChildren: number | null;
  samChildren: number | null;
  mamChildren: number | null;
  breakfastMeal: string;
  tasteQuality: string;
  campaignsDetails: string;
  anganwadiFeedbackSuggestions: string;
  status?: string;
  latitude1?: number | null;
  longitude1?: number | null;
  latitude2?: number | null;
  longitude2?: number | null;
  latitude3?: number | null;
  longitude3?: number | null;
  latitude4?: number | null;
  longitude4?: number | null;
}

// Interface for AnganwadiInspection entity returned by the backend
export interface AnganwadiInspection extends AnganwadiInspectionPayload {
    id: number; // Assuming backend returns ID
    // Any other fields backend might add, e.g., image filenames if processed server-side
    imageFilename1?: string;
    imageFilename2?: string;
    imageFilename3?: string;
    imageFilename4?: string;
}


@Injectable({
  providedIn: 'root'
})
export class InspectionserviceService {
  private apiUrl = 'http://localhost:8080/api/inspections';

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    console.error('Inspection API Error:', error);
    let errorMessage = 'An unknown error occurred with inspection service!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.status === 400 && error.error) {
        const validationErrors = error.error;
        if (typeof validationErrors === 'object' && !Array.isArray(validationErrors) && validationErrors !== null) {
            errorMessage = 'Validation failed:\n';
            for (const key in validationErrors) {
              if (validationErrors.hasOwnProperty(key)) {
                errorMessage += `${key}: ${validationErrors[key]}\n`;
              }
            }
        } else if (typeof validationErrors === 'string') {
             errorMessage = `Server error: ${validationErrors}`;
        } else if (Array.isArray(validationErrors)) { // For @RequestPart validation errors
            errorMessage = 'Validation failed:\n' + validationErrors.map(err => `${err.field}: ${err.defaultMessage}`).join('\n');
        }
         else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message || 'Server error'}`;
        }
      } else if (error.error && typeof error.error === 'string') {
        errorMessage = error.error; // Use the string error message from backend if available
      }
      else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message || 'Server error'}`;
      }
    }
    return throwError(() => new Error(errorMessage.trim()));
  }

  submitInspection(formData: FormData): Observable<AnganwadiInspection> { // Expect AnganwadiInspection back
    return this.http.post<AnganwadiInspection>(this.apiUrl, formData).pipe(
      catchError(this.handleError)
    );
  }

  // Add other methods if needed (getAll, getById, etc.)
  getAllInspections(): Observable<AnganwadiInspection[]> {
    return this.http.get<AnganwadiInspection[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  getInspectionById(id: number): Observable<AnganwadiInspection> {
    return this.http.get<AnganwadiInspection>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  // Update and Delete would also be similar
}