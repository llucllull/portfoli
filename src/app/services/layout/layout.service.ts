import { Injectable, signal } from '@angular/core';
import { BodyComponent } from '@lluc_llull/ui-lib';
import { BehaviorSubject } from 'rxjs';

export type HeaderComponentName = 'headerClear';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private readonly header = signal<BodyComponent<any> | undefined>(undefined);
  private readonly footer = signal<BodyComponent<any> | undefined>(undefined); // Preparado para el futuro
  private readonly layoutLoaded = signal<boolean>(false);

  // Subjects para exponer como observables
  private headerSubject = new BehaviorSubject<BodyComponent<any> | undefined>(undefined);
  private footerSubject = new BehaviorSubject<BodyComponent<any> | undefined>(undefined);
  header$ = this.headerSubject.asObservable();
  footer$ = this.footerSubject.asObservable();

  // Getters
  get headerComponent(): BodyComponent<any> | undefined {
    return this.header();
  }

  // Footer getter preparado para el futuro
  get footerComponent(): BodyComponent<any> | undefined {
    return this.footer();
  }

  get layoutReady(): boolean {
    return this.layoutLoaded();
  }

  // Setters
  setHeader(component: BodyComponent<any>) {
    this.header.set(component);
    this.headerSubject.next(component);
  }

  // Setter para el footer preparado para el futuro
  setFooter(component: BodyComponent<any>) {
    this.footer.set(component);
    this.footerSubject.next(component);
  }

  markLayoutAsLoaded() {
    this.layoutLoaded.set(true);
  }

  resetLayout() {
    this.header.set(undefined);
    this.footer.set(undefined);
    this.headerSubject.next(undefined);
    this.footerSubject.next(undefined);
    this.layoutLoaded.set(false);
  }
}
