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
  @Input() fundraiserId!: number; // Para pasar el ID del fundraiser seleccionado al modal
  @Output() close = new EventEmitter<void>();
  fundraiser: any = {}; // Para almacenar los datos del fundraiser
  categories: any[] = []; // Array para almacenar categorías
  isLoading: boolean = false; // Para rastrear el estado de carga
  errorMessage: string = ''; // Mensaje de error para mostrar
  successMessage: string = ''; // Mensaje de éxito para mostrar

  constructor(private http: HttpClient) {}

  // Detectar cambios en el `fundraiserId`
  ngOnChanges(changes: SimpleChanges) {
    if (changes['fundraiserId'] && this.fundraiserId) {
      console.log('Fundraiser ID changed:', this.fundraiserId); // Logging del ID
      this.getFundraiserDetails(this.fundraiserId); // Obtener detalles del fundraiser si se proporciona el ID
    }
  }

  ngOnInit() {
    this.getCategories(); // Obtener la lista de categorías al inicializar
  }

  // Obtener detalles del fundraiser de la API
  getFundraiserDetails(id: number) {
    this.isLoading = true;
    this.http
      .get<any>(`http://23975071.it.scu.edu.au/DataServ/api/fundraisers/${id}`)
      .subscribe(
        (data) => {
          console.log('Fundraiser details:', data); // Log de los detalles del fundraiser recibidos
          this.fundraiser = data; // Asignar los detalles del fundraiser a la variable local
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching fundraiser details', error);
          this.errorMessage = 'Failed to load fundraiser details'; // Mensaje de error si la API falla
          this.isLoading = false;
        }
      );
  }

  // Obtener categorías de la API
  getCategories() {
    this.http
      .get<any[]>('http://23975071.it.scu.edu.au/DataServ/api/categories')
      .subscribe(
        (data) => {
          this.categories = data; // Asignar las categorías al array local
        },
        (error) => {
          console.error('Error fetching categories', error);
          this.errorMessage = 'Failed to load categories'; // Mensaje de error si la API falla
        }
      );
  }

  // Actualizar el fundraiser
  updateFundraiser() {
    this.isLoading = true;
    // Verifica que el ID del fundraiser sea el correcto
    this.http
      .put(
        `http://23975071.it.scu.edu.au/DataServ/api/fundraisers/${this.fundraiser.FUNDRAISER_ID}`,
        this.fundraiser
      )
      .subscribe(
        () => {
          this.successMessage = 'Fundraiser updated successfully!'; // Mensaje de éxito
          this.errorMessage = ''; // Limpiar mensaje de error
          this.isLoading = false;
        },
        (error) => {
          console.error('Error updating fundraiser', error);
          this.errorMessage = 'Failed to update fundraiser'; // Mensaje de error si la API falla
          this.isLoading = false;
        }
      );
  }

  // Método para emitir el evento de cerrar modal al componente padre
  closeModal() {
    this.close.emit(); // Emitir el evento de cierre
  }
}
