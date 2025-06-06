import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { RegisterService } from '../register.service'; // ✅ Import service

@Component({
  standalone: true,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [CommonModule, RouterModule]
})
export class SidebarComponent {
  activeItem = 'डॅशबोर्ड';

  menuItems = [
    { icon: 'fa-home', label: 'डॅशबोर्ड', route: '/dashboard' },
    // { icon: 'fa-building-columns', label: 'शाळा भेट फॉर्म', route: '/school-visit-form' },
    // { icon: 'fa-house', label: 'आंगणवाडी भेट फॉर्म', route: '/anganwadi-form' },
        { icon: 'fa-right-from-bracket', label: 'शाळेचे उद्दिष्ट नोंदवा.', route: '/school-report' },
     { icon: 'fa-gear', label: ' आंगणवाडी उद्दिष्टांची नोंद करा', route: '/aganwadi-report' },
    // { icon: 'fa-users', label: 'वापरकर्ता व्यवस्थापन', route: '/arogya-form' },
    { icon: 'fa-gear', label: 'शालेय उद्दिष्टांचा अहवाल ', route: '/school-objective' },
    { icon: 'fa-file-invoice', label: 'अहवाल', route: '/inspection-report' },
    {icon: 'fa-file-invoice', label: 'आंगणवाडी अहवाल', route: '/arogya-checklist-form' },
    { icon: 'fa-file-invoice', label: 'आरोग्य केंद्र अहवाल', route: '/arogya-report' },
    { icon: 'fa-user', label: 'प्रोफाइल', route: '/profile' },
    { icon: 'fa-right-from-bracket', label: 'बाहेर पडा', action: () => this.logout() }
  ];

  constructor(private registerService: RegisterService, private router: Router) {}

  setActive(label: string) {
    this.activeItem = label;
  }

  handleItemClick(item: any) {
    this.setActive(item.label);
    if (item.route) {
      this.router.navigate([item.route]);
    } else if (item.action) {
      item.action(); // like logout
    }
  }

  logout(): void {
    this.registerService.logout(); // clear session/localStorage
    this.router.navigate(['/login']); // redirect to login
  }
}
