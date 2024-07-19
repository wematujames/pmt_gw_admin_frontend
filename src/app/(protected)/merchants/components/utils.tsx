export const transformMerchant: any = (merchant: any) => ({
  Name: merchant.name,
  "Merchant ID": merchant.merchantId,
  Email: merchant.email,
  "Email Verified": merchant.emailVerified ? "Yes" : "No",
  Phone: merchant.phone,
  "Phone Verified": merchant.phoneVerified ? "Yes" : "No",
  "Collection Txns": merchant.config?.collectionc2b?.allowed
    ? "Enabled"
    : "Disabled",
  "Collection Txn Limit": parseFloat(
    merchant.config?.collectionc2b?.limit
  ).toFixed(2),

  "Disbursement Txns": merchant.config?.disbursement?.allowed
    ? "Enabled"
    : "Disabled",
  "Disbursement Txn Limit": parseFloat(
    merchant.config?.disbursement?.limit
  ).toFixed(2),

  "DirectDebit Txns": merchant.config?.directDebit?.allowed
    ? "Enabled"
    : "Disabled",
  "DirectDebit Txn Limit": parseFloat(
    merchant.config?.directDebit?.limit
  ).toFixed(2),

  Reversals: merchant.config?.reversal?.allowed ? "Enabled" : "Disabled",

  "Update DirectDebit Amt": merchant.config?.updateDDAmount?.allowed
    ? "Enabled"
    : "Disabled",
  "Cancel DirectDebit": merchant.config?.cancelDirectDebit?.allowed
    ? "Enabled"
    : "Disabled",

  "MTN Txns": merchant.config?.channels?.mtn?.allowed ? "Enabled" : "Disabled",
  "Telecel Txns": merchant.config?.channels?.telecel?.allowed
    ? "Enabled"
    : "Disabled",
  "AirtelTigo Txns": merchant.config?.channels?.airteltigo?.allowed
    ? "Enabled"
    : "Disabled",

  CreatedAt: merchant.createdAt,
  CreatedBy: merchant.createdBy?.email,
});

export const transformMerchantAccount: any = (account: any = {}) => ({
  "Balance ₵": account.balance,
  "Collected ₵": account.collected,
  "Disbursed ₵": account.disbursed,
  "Reversed ₵": account.reversed,
});
