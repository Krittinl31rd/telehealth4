const { dbface } = require("../lowdb/lowdb");

const updateUser = async (usernum, newData) => {
  await dbface.read();
  const users = dbface.data;

  const index = users.findIndex((u) => u.usernum == usernum);
   
  if (index === -1) {
    return { message: "User not found" };
  }
 
  dbface.data[index] = {
    ...dbface.data[index],
    ...newData,
  };

  await dbface.write();

  return { message: "Updated", data: dbface.data[index] };
};


const  calculateAge = (birthdayStr) => {
  // Expecting birthdayStr like "12-31-1990"
  const [year, month, day] = birthdayStr.split("-").map(Number);
  const birthDate = new Date(year, month - 1, day); // month is 0-indexed
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  // Adjust if birthday hasn't occurred yet this year
  const m = today.getMonth() - birthDate.getMonth();
  const d = today.getDate() - birthDate.getDate();
  if (m < 0 || (m === 0 && d < 0)) {
    age--;
  }

  return age;
}


module.exports = {updateUser, calculateAge}