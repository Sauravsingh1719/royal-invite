export function getOtpTemplate(otp: string): string {
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://royalinvitess.vercel.app")
  ).replace(/\/$/, "");

  const logoUrl = `${siteUrl}/logo.png`;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>RoyalInvites Verification Code</title>
    </head>

    <body style="
      margin: 0;
      padding: 20px;
      background-color: #FDFBF7;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    ">

      <table
        align="center"
        border="0"
        cellpadding="0"
        cellspacing="0"
        width="100%"
        style="
          max-width: 520px;
          background-color: #ffffff;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          margin: 20px auto;
          padding: 32px;
        "
      >

        <!-- Logo Header -->
        <tr>
          <td align="center" style="padding-bottom: 20px;">

            <img
              src="${logoUrl}"
              alt="RoyalInvites Logo"
              width="76"
              height="76"
              style="
                border-radius: 50%;
                border: 2px solid #D4AF37;
                object-fit: cover;
                display: inline-block;
                vertical-align: middle;
                background-color: #8B1E41;
              "
            />

            <h1 style="
              color: #8B1E41;
              font-size: 20px;
              font-weight: 700;
              margin: 12px 0 4px 0;
              letter-spacing: 0.5px;
            ">
              RoyalInvites
            </h1>

            <p style="
              color: #6B7280;
              font-size: 13px;
              margin: 0;
            ">
              Wedding Invitation Platform
            </p>

          </td>
        </tr>

        <!-- Email Content -->
        <tr>
          <td style="
            color: #374151;
            font-size: 14px;
            line-height: 1.5;
            padding: 12px 0;
          ">

            <p style="margin: 0 0 12px 0;">
              Hello,
            </p>

            <p style="margin: 0 0 20px 0;">
              Please use the verification code below to verify your email address and continue.
            </p>

            <!-- OTP Box -->
            <div style="
              background-color: #FDFBF7;
              border: 1.5px dashed #D4AF37;
              border-radius: 8px;
              padding: 16px;
              text-align: center;
              margin: 24px 0;
            ">
              <span style="
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                font-size: 32px;
                font-weight: 700;
                letter-spacing: 6px;
                color: #8B1E41;
              ">
                ${otp}
              </span>
            </div>

            <p style="
              color: #6B7280;
              font-size: 12px;
              line-height: 1.4;
              margin: 20px 0 0 0;
            ">
              This code will expire in <strong>5 minutes</strong>.
              If you did not request this verification, you can safely ignore this email.
            </p>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td
            align="center"
            style="
              border-top: 1px solid #F3F4F6;
              padding-top: 20px;
              margin-top: 20px;
            "
          >
            <p style="
              color: #9CA3AF;
              font-size: 11px;
              margin: 0;
            ">
              &copy; ${new Date().getFullYear()} RoyalInvites. All rights reserved.
            </p>
          </td>
        </tr>

      </table>

    </body>
    </html>
  `;
}