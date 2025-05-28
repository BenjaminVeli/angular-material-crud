import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';

// Interceptors para seguridad (ejemplos)
// import { authInterceptor } from './app/interceptors/auth.interceptor';
// import { errorInterceptor } from './app/interceptors/error.interceptor';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(
      withFetch()
    )
  ]
}).catch((err) => console.error(err));
