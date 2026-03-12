import {
    BootstrapContext,
    bootstrapApplication,
} from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
import { preloadComponents } from './app/shared/dynamic-renderer/component-registry.service';

const bootstrap = async (context: BootstrapContext) => {
  await preloadComponents();

  return bootstrapApplication(AppComponent, config, context);
};

export default bootstrap;
