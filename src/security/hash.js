import bcrypt from "bcrypt";
export const Hash = (plainText) => {
  return bcrypt.hashSync(plainText, 6);
};

export const Compare = (plainText, hashedText) => {
  return bcrypt.compareSync(plainText, hashedText);
};
