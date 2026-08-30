export function getOtpTemplate(otp: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com";

  return `
    <div style="font-family: 'Cinzel', serif, Georgia; max-width: 600px; margin: 0 auto; background-color: #FDFBF7; padding: 40px; border: 1px solid #D4AF37; border-radius: 16px;">
      
      <!-- Logo Header -->
      <div style="text-align: center; margin-bottom: 16px;">
        <img 
          src="${siteUrl}/logo.jpg" 
          alt="RoyalInvites Logo" 
          width="68" 
          height="68" 
          style="border-radius: 50%; border: 2px solid #D4AF37; object-fit: cover; display: inline-block; vertical-align: middle;" 
        />
      </div>

      <h1 style="color: #8B1E41; text-align: center; margin-top: 0; margin-bottom: 6px; font-size: 26px; letter-spacing: 1px;">RoyalInvites</h1>
      <p style="text-align: center; color: #D4AF37; letter-spacing: 3px; text-transform: uppercase; font-size: 11px; margin-top: 0; font-weight: bold;">Secured Portal Authentication</p>
      
      <hr style="border: none; border-top: 1px solid rgba(212,175,55,0.3); margin: 24px 0;" />
      
      <p style="color: #4A1023; font-size: 16px; margin-bottom: 8px;">Hello,</p>
      <p style="color: #555555; font-size: 14px; line-height: 1.6; margin-top: 0;">Use the following One-Time Password (OTP) to securely authenticate your RoyalInvites session. This passcode expires in <b>5 minutes</b>.</p>
      
      <!-- OTP Box -->
      <div style="background-color: #8B1E41; color: #FDFBF7; font-size: 32px; letter-spacing: 8px; font-weight: bold; text-align: center; padding: 18px; border-radius: 8px; margin: 30px 0; border: 1px solid #D4AF37;">
        ${otp}
      </div>
      
      <p style="color: #888888; font-size: 12px; text-align: center; line-height: 1.4;">If you did not request this OTP, you can safely ignore this email.</p>
      
      <div style="text-align: center; margin-top: 24px;">
        <span style="font-size: 11px; color: #D4AF37; text-transform: uppercase; letter-spacing: 2px;">Royal Digital Experiences</span>
      </div>
    </div>
  `;
}