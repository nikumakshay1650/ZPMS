// src/app/arogya-checklist-form/arogya-checklist-form.component.ts
// *** THIS IS THE CORRECTED COMPONENT FILE ***

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

// FIX: Add ChecklistData to the import list
import { ArogyaService, ChecklistData, } from '../arogya.service';

@Component({
  selector: 'app-arogya-checklist-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './arogya-checklist-form.component.html',
  styleUrls: ['./arogya-checklist-form.component.scss']
})
export class ArogyaChecklistFormComponent implements OnInit {
  checklistForm: FormGroup;
  talukas$: Observable<string[]>;
  kendras$: Observable<string[]>;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private arogyaService: ArogyaService
  ) {
    this.checklistForm = this.fb.group({
      taluka: ['', Validators.required],
      prathmik_arogya_kendra: ['', Validators.required],
      bheticha_dinank: ['', Validators.required]
    });

    this.talukas$ = this.arogyaService.getTalukas();
    this.kendras$ = new Observable<string[]>();
  }

  ngOnInit(): void {
    this.checklistForm.get('taluka')?.valueChanges.subscribe(talukaValue => {
      if (talukaValue) {
        // This will now work because the method exists in the service
        this.kendras$ = this.arogyaService.getArogyaKendras(talukaValue);
        this.checklistForm.get('prathmik_arogya_kendra')?.reset('');
      }
    });
  }

  get f() { return this.checklistForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.checklistForm.invalid) { return; }

    // This will now work because ChecklistData is imported
    const formData: ChecklistData = this.checklistForm.value;
    // This will now work because the method exists in the service
    this.arogyaService.submitChecklist(formData).subscribe({
      next: (response: any) => {
        alert('डेमो सबमिट यशस्वी झाले! कृपया कन्सोल तपासा.');
        this.onReset();
      }
    });
  }

  onReset(): void {
    this.submitted = false;
    this.checklistForm.reset({
        taluka: '',
        prathmik_arogya_kendra: '',
        bheticha_dinank: ''
    });
  }
}