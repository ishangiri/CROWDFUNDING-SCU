import {
  Component,
  Input,
  Output,
  OnInit,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit',
  standalone: true,
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  imports: [FormsModule, CommonModule],
})
export class EditComponent implements OnInit, OnChanges {
  // Input to receive the fundraiser ID from the parent component
  @Input() fundraiserId!: number;

  // Output to emit an event to the parent when the modal is closed
  @Output() close = new EventEmitter<void>();

  // Variable to store fundraiser data fetched from the API
  fundraiser: any = {};

  // Array to store categories retrieved from the API
  categories: any[] = [];

  // Boolean to track the loading state of the component
  isLoading: boolean = false;

  // String to hold error messages, if any
  errorMessage: string = '';

  // String to hold success messages after an update
  successMessage: string = '';

  // Inject HttpClient to handle HTTP requests
  constructor(private http: HttpClient) {}

  // Lifecycle hook that watches for changes in the fundraiserId input
  ngOnChanges(changes: SimpleChanges) {
    // If fundraiserId changes and a new value is provided, fetch the fundraiser details
    if (changes['fundraiserId'] && this.fundraiserId) {
      console.log('Fundraiser ID changed:', this.fundraiserId); // Log the change for debugging
      this.getFundraiserDetails(this.fundraiserId); // Fetch fundraiser details using the updated ID
    }
  }

  // Lifecycle hook that runs when the component is initialized
  ngOnInit() {
    this.getCategories(); // Fetch the list of categories when the component is initialized
  }

  // Method to fetch fundraiser details based on the provided ID
  getFundraiserDetails(id: number) {
    this.isLoading = true; // Set loading to true while the data is being fetched
    this.http
      .get<any>(`http://23975071.it.scu.edu.au/DataServ/api/fundraisers/${id}`)
      .subscribe(
        (data) => {
          console.log('Fundraiser details:', data); // Log the fetched fundraiser details for debugging
          this.fundraiser = data; // Store the fetched data in the local fundraiser variable
          this.isLoading = false; // Set loading to false once the data is received
        },
        (error) => {
          console.error('Error fetching fundraiser details', error); // Log the error if fetching fails
          this.errorMessage = 'Failed to load fundraiser details'; // Set error message for the UI
          this.isLoading = false; // Stop loading on error
        }
      );
  }

  // Method to fetch the list of available categories from the API
  getCategories() {
    this.http
      .get<any[]>('http://23975071.it.scu.edu.au/DataServ/api/categories')
      .subscribe(
        (data) => {
          this.categories = data; // Store the fetched categories in the local categories array
        },
        (error) => {
          console.error('Error fetching categories', error); // Log the error if fetching categories fails
          this.errorMessage = 'Failed to load categories'; // Set error message for the UI
        }
      );
  }

  // Method to update the fundraiser data via the API
  // Method to update the fundraiser
  updateFundraiser() {
    // Log the fundraiser ID to ensure it exists
    console.log(this.fundraiser.FUNDRAISER_ID); // Ensure ID is correct
    if (!this.fundraiser.FUNDRAISER_ID) {
      this.errorMessage = 'Invalid fundraiser ID';
      return;
    }

    // Optional: Add validation for required fields before updating
    if (
      !this.fundraiser.ORGANIZER ||
      !this.fundraiser.CAPTION ||
      !this.fundraiser.TARGET_FUNDING ||
      !this.fundraiser.CITY
    ) {
      this.errorMessage = 'Please fill out all required fields!';
      return;
    }

    this.isLoading = true; // Set loading to true while the update request is in progress

    // Log the fundraiser object to check all fields are present
    console.log('Updating fundraiser:', this.fundraiser);
    console.log('Updating fundraiser with:', this.fundraiser);

    // Send PUT request to update the fundraiser
    this.http
      .put(
        `http://23975071.it.scu.edu.au/DataServ/api/fundraisers/${this.fundraiser.FUNDRAISER_ID}`, // The API endpoint with fundraiser ID
        this.fundraiser // The fundraiser object containing the updated data
      )
      .subscribe(
        () => {
          // Success: Update completed
          this.successMessage = 'Fundraiser updated successfully!'; // Show success message after update
          this.errorMessage = ''; // Clear any previous error messages
          this.isLoading = false; // Stop loading after the update is completed
          this.getFundraiser(this.fundraiser.FUNDRAISER_ID);
        },
        (error) => {
          // Log the full error object for detailed debugging
          console.error('Error updating fundraiser', error);

          // Check if error contains a specific message, otherwise default
          this.errorMessage = `Failed to update fundraiser: ${
            error.message || 'Unknown error'
          }`;
          this.isLoading = false; // Stop loading on error
        }
      );
  }

  // Method to fetch the latest details of a specific fundraiser
  getFundraiser(id: number) {
    this.isLoading = true;
    this.http
      .get<any>(`http://23975071.it.scu.edu.au/DataServ/api/fundraisers/${id}`)
      .subscribe(
        (data) => {
          this.fundraiser = data; // Update the fundraiser data with the fetched details
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching fundraiser details', error);
          this.errorMessage = 'Failed to load fundraiser details';
          this.isLoading = false;
        }
      );
  }

  // Method to close the modal by emitting the 'close' event to the parent component
  closeModal() {
    this.close.emit(); // Emit the close event to inform the parent component to close the modal
  }
}
