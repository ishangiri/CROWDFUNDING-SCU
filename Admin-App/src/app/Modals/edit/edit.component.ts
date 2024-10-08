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
  @Input() fundraiserId!: number;
  @Output() close = new EventEmitter<void>();

  fundraiser: any = {};
  categories: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['fundraiserId'] && this.fundraiserId) {
      console.log('Fundraiser ID changed:', this.fundraiserId);
      this.getFundraiserDetails(this.fundraiserId);
    }
  }

  ngOnInit() {
    this.getCategories();
  }

  getFundraiserDetails(id: number) {
    this.isLoading = true;
    this.http
      .get<any>(`http://23975071.it.scu.edu.au/DataServ/api/fundraisers/${id}`)
      .subscribe(
        (data) => {
          console.log('Fundraiser details:', data);
          this.fundraiser = data;
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching fundraiser details', error);
          this.errorMessage = 'Failed to load fundraiser details';
          this.isLoading = false;
        }
      );
  }

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

  updateFundraiser() {
    console.log(this.fundraiser.FUNDRAISER_ID);

    if (!this.fundraiser.FUNDRAISER_ID) {
      this.errorMessage = 'Invalid fundraiser ID';
      return;
    }

    // Validar campos requeridos
    if (
      !this.fundraiser.ORGANIZER ||
      !this.fundraiser.CAPTION ||
      !this.fundraiser.TARGET_FUNDING ||
      !this.fundraiser.CITY ||
      this.fundraiser.ACTIVE === undefined || // Asegúrate de validar correctamente ACTIVE
      !this.fundraiser.CATEGORY_ID
    ) {
      this.errorMessage = 'Please fill out all required fields!';
      return;
    }

    // Convertir ACTIVE a true/false (boolean)
    this.fundraiser.ACTIVE = this.fundraiser.ACTIVE ? true : false;

    // Crear el objeto con la misma estructura que en Postman
    const updatedFundraiser = {
      organizer: this.fundraiser.ORGANIZER,
      caption: this.fundraiser.CAPTION,
      target_funding: this.fundraiser.TARGET_FUNDING,
      city: this.fundraiser.CITY,
      category_id: this.fundraiser.CATEGORY_ID,
      active: this.fundraiser.ACTIVE,
    };

    this.isLoading = true;

    console.log('Updating fundraiser with:', updatedFundraiser);

    this.http
      .patch(
        `http://23975071.it.scu.edu.au/DataServ/api/fundraisers/${this.fundraiser.FUNDRAISER_ID}`,
        updatedFundraiser
      )
      .subscribe(
        (response) => {
          console.log('Server response:', response);
          this.successMessage = 'Fundraiser updated successfully!';
          this.errorMessage = '';
          this.isLoading = false;
          this.getFundraiser(this.fundraiser.FUNDRAISER_ID); // Refresca los datos después de la actualización
        },
        (error) => {
          console.error('Error updating fundraiser', error);
          this.errorMessage = `Failed to update fundraiser: ${
            error.message || 'Unknown error'
          }`;
          this.isLoading = false;
        }
      );
  }

  getFundraiser(id: number) {
    this.isLoading = true;
    this.http
      .get<any>(`http://23975071.it.scu.edu.au/DataServ/api/fundraisers/${id}`)
      .subscribe(
        (data) => {
          this.fundraiser = data;
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching fundraiser details', error);
          this.errorMessage = 'Failed to load fundraiser details';
          this.isLoading = false;
        }
      );
  }

  closeModal() {
    this.close.emit();
  }
}
