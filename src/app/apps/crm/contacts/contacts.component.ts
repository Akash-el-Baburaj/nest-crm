import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// type
import { AdvancedTableComponent, Column } from '../../../shared/advanced-table/advanced-table.component';
import { SortEvent } from '../../../shared/advanced-table/sortable.directive';
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';
import { Contacts } from '../shared/models';

// data
import { contacts } from '../shared/data';
@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  loading: boolean = false;
  selectAll: boolean = false;
  contactList: Contacts[] = [];
  pageSizeOptions: number[] = [10, 20, 50];
  columns: Column[] = [];

  @ViewChild('advancedTable') advancedTable!: AdvancedTableComponent;

  constructor (private sanitizer: DomSanitizer) { }

  ngOnInit(): void {

    this.pageTitle = [{ label: 'CRM', path: '/' }, { label: 'Contacts', path: '/', active: true }];

    // get Contacts data
    this._fetchData();


    // initialize advance table 
    this.initAdvancedTableData();
  }

  /**
   * fetches Contacts data
   */
  _fetchData(): void {
    this.contactList = contacts;
  }

  /**
   * initialize advance table columns
   */
  initAdvancedTableData(): void {
    this.columns = [
      {
        name: 'name',
        label: 'Contactss',
        formatter: this.ContactsNameFormatter.bind(this)
      },
      {
        name: 'phone',
        label: 'Phone',
        formatter: (contacts: Contacts) => contacts.phone
      },
      {
        name: 'email',
        label: 'Email',
        formatter: (contacts: Contacts) => contacts.email
      },
      {
        name: 'location',
        label: 'Location',
        formatter: (contacts: Contacts) => contacts.location
      },
      {
        name: 'created_on',
        label: 'Created On',
        formatter: (contacts: Contacts) => contacts.created_on
      },
      {
        name: 'status',
        label: 'Status',
        formatter: this.ContactsStatusFormatter.bind(this)
      },
      {
        name: 'Action',
        label: 'Action',
        formatter: this.ContactsActionFormatter.bind(this),
        sort: false
      }]
  }

  // formats name cell
  ContactsNameFormatter(contacts: Contacts): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      `
      <div class="table-user">
      <img src="${contacts.avatar}" alt="table-user" class="me-2 rounded-circle">
       <a href="javascript:void(0);" class="text-body fw-semibold">${contacts.name}</a>
       </div>
      `
    );
  }

  // formats Contacts status
  ContactsStatusFormatter(contacts: Contacts): SafeHtml {
    if (contacts.status == "Active") {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<span class="badge badge-success-lighten">Active</span>`
      );
    }
    else {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<span class="badge badge-danger-lighten">Blocked</span>`
      );
    }

  }

  // action cell formatter
  ContactsActionFormatter(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      `<a href="javascript:void(0);" class="action-icon"> <i class="mdi mdi-eye"></i></a>
           <a href="javascript:void(0);" class="action-icon"> <i class="mdi mdi-square-edit-outline"></i></a>
           <a href="javascript:void(0);" class="action-icon"> <i class="mdi mdi-delete"></i></a>`
    );
  }

  /**
   * compares two cell value
   */
  compare(v1: string | number, v2: string | number): number {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  /**
   * Sort the table data
   * @param event column name,direction
   */
  sort(event: SortEvent): void {
    if (event.direction === '') {
      this.contactList = contacts;
    } else {
      this.contactList = [...this.contactList].sort((a, b) => {
        const res = this.compare(a[event.column], b[event.column]);
        return event.direction === 'asc' ? res : -res;
      });
    }
  }

  /**
 * Table Data Match with Search input
 * @param tableRow Table row
 * @param term Search the value
 */
  matches(tableRow: Contacts, term: string) {
    return tableRow.name?.toLowerCase().includes(term)
      || tableRow.email?.toLowerCase().includes(term)
      || tableRow.phone?.toLowerCase().includes(term)
      || tableRow.location?.toLowerCase().includes(term)
      || tableRow.created_on?.toLowerCase().includes(term)
      || tableRow.status?.toLocaleLowerCase().includes(term);
  }

  /**
   * Search Method
  */
  searchData(searchTerm: string): void {
    if (searchTerm === '') {
      this._fetchData();
    }
    else {
      let updatedData = contacts;
      //  filter
      updatedData = updatedData.filter(contacts => this.matches(contacts, searchTerm));
      this.contactList = updatedData;
    }

  }

}
