import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add',
  standalone: true,
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
  imports: [FormsModule, CommonModule],
})
export class AddComponent implements OnInit {
  fundraisers: any[] = []; // Array to store fundraisers
  categories: any[] = []; // Array to store categories
  donations: any[] = []; // Array to store donations
  newFundraiser = {
    organizer : "",
     caption : "",
    target_funding : null,
     city : "",
     category_id : null,
     active : false 

  }; // Object for new fundraiser input
  editingFundraiser: any; // Variable to hold the fundraiser being edited
  isLoading: boolean = false; // To track the loading state
  errorMessage: string = ''; // Error message to display
  successMessage: string = ''; // Success message to display

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getFundraisers(); // Fetch the list of fundraisers on component initialization
    this.getCategories(); // Fetch the list of categories
  }

  // Fetch fundraisers from the API
  getFundraisers() {
    this.isLoading = true;
    this.http.get<any[]>('http://23975071.it.scu.edu.au/DataServ/api/all/fundraisers').subscribe(
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
    this.http.get<any[]>('http://23975071.it.scu.edu.au/DataServ/api/categories').subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        console.error('Error fetching categories', error);
        this.errorMessage = 'Failed to load categories';
      }
    );
  }

  // Add a new fundraiser
  addFundraiser() {
    if (!this.newFundraiser.organizer || !this.newFundraiser.category_id || !this.newFundraiser.caption || !this.newFundraiser.city || !this.newFundraiser.target_funding ) {
      this.errorMessage = 'Please fill out all required fields!';
      return;
    }

    this.isLoading = true;
    this.http.post('http://23975071.it.scu.edu.au/DataServ/api/fundraisers', this.newFundraiser).subscribe(
      () => {
        this.getFundraisers();
        this.newFundraiser = {
          organizer : "",
          caption : "",
         target_funding : null,
          city : "",
          category_id : null,
          active : false 
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

  // Set the fundraiser to be edited
  editFundraiser(fundraiser: any) {
    this.editingFundraiser = { ...fundraiser };
    this.getDonations(fundraiser.id); // Fetch donations for the selected fundraiser
    this.successMessage = '';
    this.errorMessage = '';
  }

  // Update the fundraiser
  updateFundraiser() {
    if (!this.editingFundraiser.title || !this.editingFundraiser.category_id) {
      this.errorMessage = 'Please fill out all required fields!';
      return;
    }

    this.isLoading = true;
    this.http
      .put(
        `http://23975071.it.scu.edu.au/DataServ/api/fundraisers/${this.editingFundraiser.id}`,
        this.editingFundraiser
      )
      .subscribe(
        () => {
          this.getFundraisers();
          this.editingFundraiser = null;
          this.successMessage = 'Fundraiser updated successfully!';
          this.errorMessage = '';
          this.isLoading = false;
        },
        (error) => {
          console.error('Error updating fundraiser', error);
          this.errorMessage = 'Failed to update fundraiser';
          this.isLoading = false;
        }
      );
  }

  // Delete a fundraiser
  deleteFundraiser(id: number) {
    if (confirm('Are you sure you want to delete this fundraiser?')) {
      this.isLoading = true;
      this.http.delete(`http://23975071.it.scu.edu.au/DataServ/api/fundraisers/${id}`).subscribe(
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

  // Fetch donations for the selected fundraiser
  getDonations(fundraiserId: number) {
    this.http.get<any[]>(`http://23975071.it.scu.edu.au/DataServ/api/donations/${fundraiserId}`).subscribe(
      (data) => {
        this.donations = data;
      },
      (error) => {
        console.error('Error fetching donations', error);
        this.errorMessage = 'Failed to load donations';
      }
    );
  }
}
