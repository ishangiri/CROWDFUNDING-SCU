import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EditComponent } from '../../Modals/edit/edit.component';

@Component({
  selector: 'app-add',
  standalone: true,
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
  imports: [FormsModule, CommonModule, EditComponent],
})
export class AddComponent implements OnInit {
  fundraisers: any[] = [];
  categories: any[] = [];
  donations: any[] = [];
  newFundraiser = {
    organizer: '',
    caption: '',
    target_funding: null,
    city: '',
    category_id: null,
    active: false,
  };
  selectedFundraiserId: number | null = null;
  editingFundraiser: any; // Variable to hold the fundraiser being edited
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getFundraisers(); // Fetch the list of fundraisers on component initialization
    this.getCategories(); // Fetch the list of categories
  }

  // Fetch fundraisers from the API
  getFundraisers() {
    this.isLoading = true;
    this.http
      .get<any[]>('http://23975071.it.scu.edu.au/DataServ/api/all/fundraisers')
      .subscribe(
        (data) => {
          this.fundraisers = data;
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching fundraisers', error);
          this.errorMessage = 'Failed to load fundraisers';
          this.isLoading = false;
        }
      );
  }

  // Fetch categories from the API
  getCategories() {
    this.http
      .get<any[]>('http://23975071.it.scu.edu.au/DataServ/api/categories')
      .subscribe(
        (data) => {
          this.categories = data;
        },
        (error) => {
          console.error('Error fetching categories', error);
          this.errorMessage = 'Failed to load categories';
        }
      );
  }

  // Open the edit modal
  openEditModal(fundraiserId: number) {
    console.log('Opening modal for fundraiser ID:', fundraiserId); // Added for debugging
    this.selectedFundraiserId = fundraiserId; // Set the selected fundraiser ID
  }

  // Close the modal
  closeEditModal() {
    console.log('Closing modal');
    this.selectedFundraiserId = null; // Reset the selected ID when closing the modal
  }

  // Add a new fundraiser
  addFundraiser() {
    if (
      !this.newFundraiser.organizer ||
      !this.newFundraiser.category_id ||
      !this.newFundraiser.caption ||
      !this.newFundraiser.city ||
      !this.newFundraiser.target_funding
    ) {
      this.errorMessage = 'Please fill out all required fields!';
      return;
    }

    this.isLoading = true;
    this.http
      .post(
        'http://23975071.it.scu.edu.au/DataServ/api/fundraisers',
        this.newFundraiser
      )
      .subscribe(
        () => {
          this.getFundraisers();
          this.newFundraiser = {
            organizer: '',
            caption: '',
            target_funding: null,
            city: '',
            category_id: null,
            active: false,
          }; // Reset the form
          this.successMessage = 'Fundraiser added successfully!';
          this.errorMessage = '';
          this.isLoading = false;
        },
        (error) => {
          console.error('Error adding fundraiser', error);
          this.errorMessage = 'Failed to add fundraiser';
          this.isLoading = false;
        }
      );
  }

  // Delete a fundraiser
  deleteFundraiser(id: number) {
    if (confirm('Are you sure you want to delete this fundraiser?')) {
      this.isLoading = true;
      this.http
        .delete(`http://23975071.it.scu.edu.au/DataServ/api/fundraisers/${id}`)
        .subscribe(
          () => {
            this.getFundraisers();
            this.successMessage = 'Fundraiser deleted successfully!';
            this.errorMessage = '';
            this.isLoading = false;
          },
          (error) => {
            console.error('Error deleting fundraiser', error);
            this.errorMessage = 'Failed to delete fundraiser';
            this.isLoading = false;
          }
        );
    }
  }
}
