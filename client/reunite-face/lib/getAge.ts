const getAge = (dob:string) => {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const getMonthsMissing = (missingSince:string) => {
  const missingDate = new Date(missingSince);
  const now = new Date();
  const diff = now - missingDate; // milliseconds
  return diff / (1000 * 60 * 60 * 24 * 30); // tháng
};
