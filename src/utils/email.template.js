
export const emailTemplate = (otp) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sarah App - Your Verification Code</title>
</head>
<body style="margin:0; padding:0; background-color:#f0f0f0; font-family: Arial, Helvetica, sans-serif;">

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0f0f0; padding:30px 0;">
    <tr>
      <td align="center">

        <!-- Email container -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td align="center" style="background-color:#5b5bd6; padding:35px 20px; border-radius:12px 12px 0 0;">
              <h1 style="margin:0; color:#ffffff; font-size:26px; font-weight:bold;">
                👋 Sarah App
              </h1>
              <p style="margin:10px 0 0 0; color:#e0e0ff; font-size:14px;">
                Your verification code is here!
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 20px 40px;">
              <h2 style="margin:0 0 15px 0; color:#333333; font-size:18px;">
                Hello <span style="font-size:18px;">👋</span>
              </h2>
              <p style="margin:0 0 25px 0; color:#555555; font-size:15px; line-height:1.6;">
                Use the verification code below to complete your login to <strong>Sarah App</strong>:
              </p>

              <!-- OTP Code Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:#f5f5f5; border-left:4px solid #5b5bd6; padding:25px 20px; border-radius:4px;">
                    <span style="font-size:28px; font-weight:bold; color:#333333; letter-spacing:4px;">code:${otp}</span>
                  </td>
                </tr>
              </table>

              <p style="margin:25px 0 10px 0; color:#777777; font-size:13px; line-height:1.6;">
                This code will expire in <strong>10 minutes</strong>. ⏰<br>
                If you didn't request this code, you can safely ignore this email. 😊
              </p>
            </td>
          </tr>

          <!-- Button -->
          <tr>
            <td align="center" style="padding:10px 40px 40px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="background-color:#5b5bd6; border-radius:8px;">
                    <a href="{{ACTION_URL}}" target="_blank"
                       style="display:inline-block; padding:14px 32px; color:#ffffff; text-decoration:none; font-size:15px; font-weight:bold;">
                      Verify My Account
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none; border-top:1px solid #eeeeee; margin:0;">
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:25px 40px 35px 40px;">
              <p style="margin:0 0 8px 0; color:#999999; font-size:12px;">
                You received this email because someone tried to log in to Sarah App with your email.
              </p>
              <p style="margin:0; color:#999999; font-size:12px;">
                Please don't reply to this email.
              </p>
            </td>
          </tr>

        </table>
        <!-- /Email container -->

      </td>
    </tr>
  </table>

</body>
</html>`;
}