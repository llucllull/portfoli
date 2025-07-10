import { TEMPLATES } from './templates';

export const getComponent = (template: string): Promise<any> => {
  switch (template.toLowerCase()) {
    case TEMPLATES.GENERAL.toLowerCase():
      return import('../../pages/general/general.component').then(
        (m) => m.GeneralComponent
      );

    case TEMPLATES.CONTACT.toLowerCase():
      return import('../../pages/contact/contact.component').then(
        (m) => m.ContactComponent
      );

    // Añade aquí más templates

    default:
      return import('../../pages/404/404.component').then(
        (m) => m.ErrorComponent
      );
  }
};
