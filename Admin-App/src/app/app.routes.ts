// Importing necessary modules for routing
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; // Importing RouterModule and Routes for defining application routes
import { HomeComponent } from './pages/home/home.component'; // Importing HomeComponent for the home page
import { AddComponent } from './pages/add/add.component'; // Importing AddComponent for adding new items
import { EditComponent } from './Modals/edit/edit.component'; // Importing EditComponent for editing existing items

// Defining the application routes
export const routes: Routes = [
  { path: '', component: HomeComponent }, // Default route: navigates to HomeComponent when the app loads
  { path: 'add', component: AddComponent }, // Route to AddComponent for adding new entries
  { path: 'edit/:id', component: EditComponent }, // Route to EditComponent for editing entries based on the provided ID parameter
];

// Note: The ':id' in the route signifies a dynamic parameter, which allows for editing specific fundraisers.
