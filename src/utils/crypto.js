import CryptoJS from "crypto-js";

export const encryptCart = (cart) => {
  const SECRET_KEY = import.meta.env.VITE_SECRET_KEY_CHART;
  const json = JSON.stringify(cart);
  return CryptoJS.AES.encrypt(json, SECRET_KEY).toString();
};

export const decryptCart = (encrypted) => {
  try {
    const SECRET_KEY = import.meta.env.VITE_SECRET_KEY_CHART;
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (error) {
    return [];
  }
};
