import { TemplateDelegate } from 'handlebars';

interface ITemplatedData {
  name?: string;
  welcomeText?: string;
  clickText?: string;
  hereText?: string;
  activateAccountText?: string;
  linkExpirationText?: string;
  luckText?: string;
  link?: string;
}

interface ITemplates {
  confirmation: TemplateDelegate<ITemplatedData>;
  resetPassword: TemplateDelegate<ITemplatedData>;
}

export { ITemplatedData, ITemplates };
