export enum EMAIL_KEYS {
  EMAIL = '{{email}}',
  PASSWORD = '{{password}}',
  TOKEN = `{{token}}`,
}

export const EMAIL_HOST = `smtp.gmail.com`;

export const emailConfigs = {
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
    user: process.env.EMAIL_SERVICE_AUTH_USER!,
    pass: process.env.EMAIL_SERVICE_AUTH_PASS!,
  },
};
