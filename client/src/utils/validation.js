export const isValidEmail = (email) => {
  return (
    String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ) !== null
  );
};

export const isNotValidEmail = (email) => !isValidEmail(email);

export const isValidPassword = (password) => {
  if (!password) return false;

  let strength = 0;
  if (password.match(/[a-z]+/)) {
    strength += 1;
  }
  if (password.match(/[A-Z]+/)) {
    strength += 1;
  }
  if (password.match(/[0-9]+/)) {
    strength += 1;
  }

  return password.length >= 8 && strength >= 3;
};

export const isNotValidPassword = (password) => !isValidPassword(password);
