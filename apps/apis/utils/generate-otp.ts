export const generateOTP = () => {
  const otp = Math.random() * 10000;
  return parseInt(otp.toString());
};
