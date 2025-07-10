import * as app from './app/app';

import { appConfig } from './app/app.config';
import { bootstrapApplication } from '@angular/platform-browser';

bootstrapApplication(app.App, appConfig)
  .catch((err) => console.error(err));
