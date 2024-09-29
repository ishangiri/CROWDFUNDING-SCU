// Importing necessary modules and functions from Angular core and router
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'; // Importing ApplicationConfig and zone change detection provider
import { provideRouter } from '@angular/router'; // Importing provider for router functionalities
import { provideHttpClient } from '@angular/common/http'; // Importing provider for HTTP client services
import { routes } from './app.routes'; // Importing application routes
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // Importing async animations provider

// Configuring the application with necessary providers
export const appConfig: ApplicationConfig = {
  providers: [
    // Configuring zone change detection for improved performance
    provideZoneChangeDetection({ eventCoalescing: true }), // Enable event coalescing for efficient change detection

    // Setting up routing with the defined routes
    provideRouter(routes), // Provide the router configuration using the imported routes

    // Providing HTTP client for making API requests
    provideHttpClient(), // Enable HTTP services for making network requests

    // Providing async animations for smoother UI transitions
    provideAnimationsAsync(), // Enable asynchronous animations in the application
  ],
};
