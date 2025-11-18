const { QueryTypes } = require("sequelize");
const runQuery = require("../helper/queryHelper");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const { dbface } = require("../lowdb/lowdb");
const {createEmbedding} = require("../helper/model_emb")
function calculateAge(birthdayStr) {
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
 


exports.Register = async (req, res) => {
  const { email, name, password, birthday, sex, phone, address, id_card } =
    req.body;

  try {
    const [user] = await runQuery(
      `SELECT * FROM users WHERE email = :email`,
      { email },
      QueryTypes.SELECT
    );

    if (user) {
      return res.status(401).json({
        message: "Email is already used",
      });
    }

    let base64 = null;
    let profileImageUrl = null;
    let face_emb = null;

    if (req.file) {
      const imageDir = path.join(process.cwd(), "img/profile");
      if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true });

      const fileName = `${Date.now()}.jpg`;
      const filePath = path.join(imageDir, fileName);

      fs.writeFileSync(filePath, req.file.buffer);
      base64 = req.file.buffer.toString("base64");
      profileImageUrl = `/img/profile/${fileName}`;
      face_emb = await createEmbedding(base64)
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into database
    const req_user = await runQuery(
      `
      INSERT INTO users 
      (email, name, password_hash, birthday, sex, phone, address, id_card, profile_image_url, profile_image_base64, created_at)
      VALUES 
      (:email, :name, :password_hash, :birthday, :sex, :phone, :address, :id_card, :image_url, :base64, NOW())
      `,
      {
        email,
        name,
        password_hash: hashedPassword,
        birthday,
        sex,
        phone,
        address,
        id_card,
        image_url: profileImageUrl,
        base64: base64,
      },
      QueryTypes.INSERT
    );
     
    await dbface.read();

    // Push new face record
    dbface.data.push({
      usernum: req_user[0].toString(), // you may want to generate this dynamically
      name,
      sex : sex.toString(),
      age: calculateAge(birthday).toString(), // replace with actual age if available
      address,
      remark: "",
      face_emb: face_emb,
    });

    dbface.write();

    return res.status(200).json({
      message: "Register success",
      email,
      profile_image: profileImageUrl,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Register failed",
      error: err.message,
    });
  }
};
