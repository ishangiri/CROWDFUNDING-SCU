import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [FormsModule, CommonModule],
})
export class HomeComponent implements OnInit {
  fundraisers: any[] = []; // Array to store fundraisers
  newFundraiser = { title: '', category_id: '' }; // Object for new fundraiser input
  editingFundraiser: any; // Variable to hold the fundraiser being edited

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getFundraisers(); // Fetch the list of fundraisers on component initialization
  }

  // Fetch fundraisers from the API
  getFundraisers() {
    this.http.get<any[]>('http://localhost:3000/api/fundraisers/').subscribe(
      (data) => (this.fundraisers = data),
      (error) => console.error('Error fetching fundraisers', error)
    );
  }

  // Add a new fundraiser
  addFundraiser() {
    this.http.post('/api/fundraisers', this.newFundraiser).subscribe(
      () => {
        this.getFundraisers(); // Refresh the list
        this.newFundraiser = { title: '', category_id: '' }; // Reset the form
      },
      (error) => console.error('Error adding fundraiser', error)
    );
  }

  // Set the fundraiser to be edited
  editFundraiser(fundraiser: any) {
    this.editingFundraiser = { ...fundraiser }; // Create a copy of the fundraiser for editing
  }

  // Update the fundraiser
  updateFundraiser() {
    this.http
      .put(
        `/api/fundraisers/${this.editingFundraiser.id}`,
        this.editingFundraiser
      )
      .subscribe(
        () => {
          this.getFundraisers(); // Refresh the list
          this.editingFundraiser = null; // Clear editing form
        },
        (error) => console.error('Error updating fundraiser', error)
      );
  }

  // Delete a fundraiser
  deleteFundraiser(id: number) {
    this.http.delete(`/api/fundraisers/${id}`).subscribe(
      () => this.getFundraisers(), // Refresh the list
      (error) => console.error('Error deleting fundraiser', error)
    );
  }
}
