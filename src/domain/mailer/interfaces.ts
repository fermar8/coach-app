import { TemplateDelegate } from 'handlebars';

interface ITemplatedData {
  name: string;
  link: string;
}

interface ITemplates {
  confirmation: TemplateDelegate<ITemplatedData>;
  resetPassword: TemplateDelegate<ITemplatedData>;
}

export { ITemplatedData, ITemplates };
