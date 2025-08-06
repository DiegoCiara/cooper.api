// sendMail.js
import handlebars from 'handlebars';
import fs from 'fs/promises';
import resend from '@src/modules/mailer';
import { CreateEmailResponse } from 'resend';

async function sendMail(
  templateName: string,
  from: string,
  subject: string,
  body: any,
): Promise<CreateEmailResponse>{
  try {
    // 1. Lê e compila o template Handlebars
    const templatePath = `./src/resources/mail/${templateName}.html`;
    const source = await fs.readFile(templatePath, 'utf8');
    const template = handlebars.compile(source);
    const htmlToSend = template(body);

    // 2. Envia o e-mail usando a API do Resend
    const resendmail = await resend.emails.send({
      from: `ClinicHUB <${from}@case.app.br>`,
      to: body.email,
      subject,
      html: htmlToSend,
    });
    return resendmail
  } catch (error) {
    console.error('Falha ao enviar e-mail:', error);
    throw error;
  }
}

export default sendMail;
