export const emailVerificationTemplate = (name, email, otp) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify Your Email</title>
      </head>

      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #f4f4f5;
          font-family: Arial, Helvetica, sans-serif;
        "
      >
        <div style="padding: 40px 20px;">
          <div
            style="
              max-width: 500px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 12px;
              padding: 40px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
            "
          >
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="margin: 0; font-size: 28px; color: #111827;">
                bCodes bloq
              </h1>
            </div>

            <h2 style="margin: 0 0 15px; color: #111827; font-size: 24px;">
              Verify your email
            </h2>

            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Hi ${name},
            </p>

            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Thank you for creating an account with us. Please use the
              verification code below to verify your email address which is ${email}.
            </p>

            <div
              style="
                margin: 30px 0;
                padding: 20px;
                background-color: #f3f4f6;
                border-radius: 10px;
                text-align: center;
              "
            >
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                Your verification code
              </p>

              <div
                style="
                  font-size: 32px;
                  font-weight: bold;
                  letter-spacing: 8px;
                  color: #111827;
                "
              >
                ${otp}
              </div>
            </div>

            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
              This verification code will expire in
              <strong>24 hours</strong>.
            </p>

            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
              If you did not create an account with us, you can safely ignore
              this email.
            </p>

            <div
              style="
                margin-top: 35px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                text-align: center;
              "
            >
              <p style="margin: 0; color: #9ca3af; font-size: 13px;">
                © ${new Date().getFullYear()} bCodes bloq. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};

// ======================================================
// PASSWORD RESET TEMPLATE
// ======================================================

export const passwordResetTemplate = (name, email, otp) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>Password Reset</title>
      </head>

      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #f4f4f5;
          font-family: Arial, Helvetica, sans-serif;
        "
      >
        <div style="padding: 40px 20px;">
          <div
            style="
              max-width: 500px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 12px;
              padding: 40px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
            "
          >
            <!-- Brand -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h1
                style="
                  margin: 0;
                  font-size: 28px;
                  color: #111827;
                "
              >
                bCodes bloq
              </h1>
            </div>

            <!-- Heading -->
            <h2
              style="
                margin: 0 0 15px;
                color: #111827;
                font-size: 24px;
              "
            >
              Reset your password
            </h2>

            <!-- Greeting -->
            <p
              style="
                color: #4b5563;
                font-size: 16px;
                line-height: 1.6;
              "
            >
              Hi ${name},
            </p>

            <!-- Message -->
            <p
              style="
                color: #4b5563;
                font-size: 16px;
                line-height: 1.6;
              "
            >
              We received a request to reset the password for your account, which is ${email}.
              Use the OTP below to continue resetting your password.
            </p>

            <!-- OTP -->
            <div
              style="
                margin: 30px 0;
                padding: 20px;
                background-color: #f3f4f6;
                border-radius: 10px;
                text-align: center;
              "
            >
              <p
                style="
                  margin: 0 0 10px;
                  color: #6b7280;
                  font-size: 14px;
                "
              >
                Your password reset code
              </p>

              <div
                style="
                  font-size: 32px;
                  font-weight: bold;
                  letter-spacing: 8px;
                  color: #111827;
                "
              >
                ${otp}
              </div>
            </div>

            <!-- Expiry -->
            <p
              style="
                color: #6b7280;
                font-size: 14px;
                line-height: 1.6;
              "
            >
              This OTP will expire in
              <strong>15 minutes</strong>.
            </p>

            <!-- Security Notice -->
            <div
              style="
                margin-top: 20px;
                padding: 15px;
                background-color: #fff7ed;
                border-radius: 8px;
              "
            >
              <p
                style="
                  margin: 0;
                  color: #9a3412;
                  font-size: 14px;
                  line-height: 1.5;
                "
              >
                <strong>Security notice:</strong>
                If you did not request a password reset, please ignore this
                email. Your password will remain unchanged.
              </p>
            </div>

            <!-- Footer -->
            <div
              style="
                margin-top: 35px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                text-align: center;
              "
            >
              <p
                style="
                  margin: 0;
                  color: #9ca3af;
                  font-size: 13px;
                "
              >
                © ${new Date().getFullYear()} bCodes bloq. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};
