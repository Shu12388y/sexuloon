# API Backend

1. User Register -> send OTP and create entry

2. User Verifying -> Verifing User using the OTP

3. Signin Register -> Sending OTP and checking the user

4. Signin Verifying -> Verifying the User OTP and send JWT Token

5. Resend OTP -> Check it for method it is for sigin/register ->
   Check user exists or not

- If not don't send tell user to register first
- If user exists check it user is verified or not if not
  send the OTP else tell to signin

If it is signin
Check user exists or not

- If not tell user to register first
- If user exists, but number is not verified tell first to verified
- If user is verified, then send the OTP

6. Verify the user phone number
