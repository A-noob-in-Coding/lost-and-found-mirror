export const extractRollNo = (email) => {
  let res = ""
  res += email.slice(1, 3)
  res += email[0].toUpperCase() + '-';
  res += email.slice(3, 7);
  return res
}

export const validateEmail = (email) => {
  const regex = /^[likfpm]\d{6}@(lhr\.|isb\.|khi\.|cfd\.|pwr\.|mtn\.)?nu\.edu\.pk$/i;
  return regex.test(email);
};

export const encryptRollno = (rollno) => {
  return btoa(rollno)
}

export const decryptRollno = (rollno) => {
  return atob(rollno)
}


