import bcrypt from 'bcryptjs';

const hashBcrypt = async (password) => {
  const result = await bcrypt.hash(password, 10);
  return result;
};

const compareBcrypt = async (passPassword, dbPassword) => {
  const result = await bcrypt.compare(passPassword, dbPassword);
  return result;
};

export { hashBcrypt, compareBcrypt };
