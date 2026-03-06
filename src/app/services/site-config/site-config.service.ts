import { Injectable, signal } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class SiteConfigService {

  private language = signal('en');

  setLanguage(lang:string){
    this.language.set(lang);
  }

  getLanguage(){
    return this.language();
  }

}
