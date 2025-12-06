import { bootstrapApplication } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localeTr from '@angular/common/locales/tr';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Türkçe locale'i kaydet
registerLocaleData(localeTr);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
