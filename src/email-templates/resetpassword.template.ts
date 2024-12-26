import { EMAIL_KEYS } from '@/constants/email.constant';

const resetPasswordTemplate = () => {
  return `
    <!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset Password</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: 'Helvetica Neue', Arial, sans-serif;
        background-color: #f9f9f9;
      }
      table {
        border-collapse: collapse;
        margin: 0 auto;
      }
      img {
        border: 0;
        outline: none;
        text-decoration: none;
      }
      p {
        margin: 13px 0;
      }
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background: #fff;
        border: 1px solid #dddddd;
      }
      .header {
        text-align: center;
        padding: 20px;
        border-bottom: 5px solid #333957;
      }
      .header img {
        width: 64px;
      }
      .content {
        padding: 20px;
      }
      .content h1 {
        font-size: 24px;
        color: #555;
        text-align: center;
      }
      .content p {
        font-size: 16px;
        color: #555;
        text-align: left;
        line-height: 1.5;
      }
      .button {
        text-align: center;
        margin: 30px 0;
      }
      .button a {
        background: #2f67f6;
        color: #fff;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 4px;
        font-size: 16px;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #575757;
        padding: 20px;
      }
      .footer a {
        color: #575757;
        text-decoration: underline;
      }
      @media only screen and (max-width: 480px) {
        .content h1 {
          font-size: 20px;
        }
        .content p {
          font-size: 14px;
        }
        .button a {
          font-size: 14px;
          padding: 10px 20px;
        }
      }
    </style>

    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="h-screen w-screen flex items-center justify-center">
    <table class="email-container">
      <tr>
        <td class="content">
          <h1>Reset Password</h1>
          <p>
            Hello ${EMAIL_KEYS.EMAIL}!<br />
            Thank you for using DevBlog. We're really happy to have you! Click
            the link below to reset your password:
          </p>
          <div class="button">
            <p>
              New Password : ${EMAIL_KEYS.PASSWORD}
            </p>
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>

  `;
};

export default resetPasswordTemplate;
