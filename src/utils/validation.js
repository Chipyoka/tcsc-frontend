// utils/validation.js

// UK Phone: accepts +44 or 07 prefixes
export const validateUKPhone = (phone) => {
  const pattern = /^(?:\+44|0)7\d{9}$/;
  return pattern.test(phone.trim());
};

// UK Postcode: matches official UK postcode formats
export const validateUKPostcode = (postcode) => {
  const pattern = /^([A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2})$/i;
  return pattern.test(postcode.trim());
};

// Luhn Algorithm for card number validation
export const validateCardNumber = (number) => {
  const sanitized = number.replace(/\s+/g, "");
  let sum = 0;
  let shouldDouble = false;
  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized[i]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0 && sanitized.length >= 13 && sanitized.length <= 19;
};

export const validateExpiry = (expiry) => {
  if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
  const [mm, yy] = expiry.split("/").map((v) => parseInt(v));
  if (mm < 1 || mm > 12) return false;
  const now = new Date();
  const year = 2000 + yy;
  const expiryDate = new Date(year, mm);
  return expiryDate > now;
};

export const validateCVV = (cvv) => /^[0-9]{3,4}$/.test(cvv);
