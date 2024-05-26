import voucherCodes from "voucher-code-generator";
class ReferralCode {
  static generateCode(length = 6) {
    return voucherCodes.generate({ length });
  }
}

export default ReferralCode;
