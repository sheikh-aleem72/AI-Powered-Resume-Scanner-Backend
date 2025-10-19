# AI-Powered Resume Screener - Backend

## Introduction

Welcome to the backend of **AI-Powered Resume Screener**, a robust web application designed to streamline the recruitment process by intelligently analyzing resumes.
This backend repo provides all the necessary APIs for user management, authentication, authorization, and OTP-based email verification.

This project focuses on building a **secure, scalable, and maintainable backend** using **Node.js, Express, TypeScript, and MongoDB**. It is designed to integrate seamlessly with a frontend application and provides a strong foundation for implementing advanced AI features in later stages.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose ORM
- **Authentication:** JWT (Access Token & Refresh Token)
- **Email Service:** Nodemailer (OTP Verification)
- **Password Security:** bcryptjs

---

## Features (Completed Up To Stage 2)

1. **User Signup & Login**
   - Signup with email, password, role, and organization.
   - Login with email and password.
   - Passwords are securely hashed before storing in the database.
2. **Authentication & Authorization**
   - JWT-based access tokens (15 min expiry) and refresh tokens (7 days expiry).
   - Protected routes using middleware to verify tokens.
   - Token refresh endpoint to issue new access tokens when expired.
3. **Email-Based OTP Verification**
   - OTP sent to user’s email during signup and password reset.
   - Pending verification stored in database until OTP is verified.
   - Secure password reset flow using OTP.
4. **Refresh Token Management**
   - Refresh tokens securely stored in user records.
   - Token rotation implemented for added security.

---

## API Documentation (Progress Up To Stage 2)

### Auth Routes

| Method | Endpoint              | Description                                 | Request Body                                                 | Response Body                                           |
| ------ | --------------------- | ------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------- |
| POST   | `/auth/signup`        | Create pending user & send OTP              | `{ name, email, password, role?, organization? }`            | `{ success: true, message: "OTP sent to email" }`       |
| POST   | `/auth/verify-otp`    | Verify OTP and create user / reset password | `{ email, otp, purpose: "signup" \| "reset", newPassword? }` | `{ success: true, accessToken?, refreshToken?, user? }` |
| POST   | `/auth/signin`        | User login                                  | `{ email, password }`                                        | `{ success: true, accessToken, refreshToken, user }`    |
| POST   | `/auth/refresh-token` | Refresh expired access token                | `{ refreshToken }`                                           | `{ success: true, accessToken, refreshToken }`          |

**Note:** All protected routes require `Authorization: Bearer <accessToken>` header.

---

## Environment Variables

The following environment variables must be set:

- PORT=5000
- MONGODB_URI=<Your MongoDB Connection String>
- JWT_ACCESS_SECRET=<Your JWT Access Secret>
- JWT_REFRESH_SECRET=<Your JWT Refresh Secret>
- SMTP_HOST=<SMTP Host>
- SMTP_PORT=<SMTP Port>
- SMTP_SECURE=<true/false>
- SMTP_USER=<SMTP Email>
- SMTP_PASS=<SMTP Password or App Password>
- EMAIL_FROM=<Sender Email>
- OTP_EXPIRES_MINUTES=5

---

---

## Next Steps

- Implement advanced AI resume screening features.
- Add role-based access control.
- Extend API documentation for future endpoints (Resumes, Job Descriptions, etc.).
- Implement detailed logging and monitoring.

---

## Contribution

Feel free to contribute by creating pull requests, reporting issues, or suggesting improvements. Make sure to follow the **existing code structure and TypeScript practices**.

---

## Developed by **Shekh Aalim**
