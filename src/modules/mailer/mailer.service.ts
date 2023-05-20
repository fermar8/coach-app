import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import Handlebars from 'handlebars';
import * as sgMail from '@sendgrid/mail';
import { join } from 'path';
import { ITemplates, ITemplatedData } from '../../domain/mailer/interfaces';
import { UserEntity } from '../../domain/users/entities';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class MailerService {
  private readonly templates: ITemplates;
  constructor() {
    this.templates = {
      confirmation: MailerService.parseTemplate('confirmation.hbs'),
      resetPassword: MailerService.parseTemplate('reset-password.hbs'),
    };
  }

  private static parseTemplate(
    templateName: string,
  ): Handlebars.TemplateDelegate<ITemplatedData> {
    console.log('templatePath', join(__dirname, 'templates', templateName));
    const templateText = readFileSync(
      join(__dirname, 'templates', templateName),
      'utf-8',
    );
    return Handlebars.compile<ITemplatedData>(templateText, { strict: true });
  }

  private static buildEmail = async (
    userEmail: string,
    subject: string,
    html: string,
  ) => {
    const senderEmail = process.env.SENDGRID_EMAIL as string;
    const msg = {
      to: userEmail,
      from: senderEmail,
      subject,
      html,
    };
    return msg;
  };

  public async sendConfirmationEmail(
    user: UserEntity,
    token: string,
    i18n: I18nContext,
  ): Promise<void> {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
    const { email, name } = user;
    const subject = i18n.t('email.confirmation_email_subject');
    const html = this.templates.confirmation({
      name,
      welcomeText: i18n.t('email.confirmation_welcome_text'),
      clickText: i18n.t('email.confirmation_click_text'),
      hereText: i18n.t('email.confirmation_here_text'),
      activateAccountText: i18n.t('email.confirmation_activate_account_text'),
      linkExpirationText: i18n.t('email.confirmation_link_expiration_text'),
      luckText: i18n.t('email.confirmation_luck_text'),
      link: `https://${process.env.DOMAIN}/auth/confirm/${token}`,
    });
    const emailToSend = await MailerService.buildEmail(email, subject, html);
    await sgMail.send(emailToSend);
  }
}
