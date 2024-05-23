import referralCodes from "referral-codes";
interface ReferralCodeOptions {
  length?: number;
}
export const generateReferral = (
  options: ReferralCodeOptions = { length: 8 }
) => {
  return referralCodes.generate(options);
};
