import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy } from '@angular/core';
import { PAGE_IMPORTS } from '../../imports/page-imports';
import { BasePageComponent } from '../../shared/base-page/base-page.component';
import {
  ContactFormComponent,
  ContactFormSubmissionI,
} from '@lluc_llull/ui-lib/forms/contact-form';
import { Subscription, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: PAGE_IMPORTS,
  template: `
    @if (page(); as pageData) {
      @if (hasHeroAsFirstComponent && !heroRendered()) {
        <div
          class="hero-loading-placeholder col-span-full"
          aria-hidden="true"
        ></div>
      }

      <dynamic-renderer
        [components]="pageData.body"
        (firstComponentRendered)="markFirstComponentAsRendered()"
        (componentCreated)="onComponentCreated($event)"
      ></dynamic-renderer>
    }
  `,
  host: {
    style: 'display: contents;',
  },
})
export class ContactComponent extends BasePageComponent implements OnDestroy {
  private readonly http = inject(HttpClient);
  private formSubscription?: Subscription;

  onComponentCreated(event: { name: string; instance: unknown }): void {
    if (
      event.name !== 'contact-form' ||
      !(event.instance instanceof ContactFormComponent)
    ) {
      return;
    }

    const form = event.instance;
    this.formSubscription?.unsubscribe();
    this.formSubscription = form.messageSubmitted.subscribe((submission) =>
      this.sendMessage(submission, form),
    );
  }

  ngOnDestroy(): void {
    this.formSubscription?.unsubscribe();
  }

  private async sendMessage(
    submission: ContactFormSubmissionI,
    form: ContactFormComponent,
  ): Promise<void> {
    try {
      await firstValueFrom(this.http.post('/api/contact', submission));
      form.setSubmissionResult(true);
    } catch (error) {
      const message =
        error instanceof HttpErrorResponse && error.status === 503
          ? form.texts.deliveryNotConfigured
          : form.texts.error;
      form.setSubmissionResult(false, message);
    }
  }
}
