// Importing necessary modules and components
import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { routes } from './app.routes'; // Importing application routes
import { FormsModule } from '@angular/forms';

// Importing global and page components
import { TopbarComponent } from './global/topbar/topbar.component';
import { HomeComponent } from './pages/home/home.component';
import { AddComponent } from './pages/add/add.component';
import { EditComponent } from './pages/edit/edit.component';
import { FooterComponent } from './global/footer/footer.component';
import { RouterModule } from '@angular/router'; // Importing RouterModule for navigation

// Defining the root component of the application
@Component({
  selector: 'app-root', // The selector used to reference this component in HTML
  templateUrl: './app.component.html', // The HTML template for the component
  styleUrls: ['./app.component.css'], // The CSS styles for the component
  standalone: true, // Indicates that this component can operate independently
  imports: [
    TopbarComponent, // Importing the top bar component
    HomeComponent, // Importing the home page component
    AddComponent, // Importing the add page component
    EditComponent, // Importing the edit page component
    FooterComponent, // Importing the footer component
    RouterModule, // Importing RouterModule for routing functionalities
    FormsModule,
  ],
})
export class AppComponent {
  // Title of the application displayed in the UI
  title = 'admin-dashboard';
}
