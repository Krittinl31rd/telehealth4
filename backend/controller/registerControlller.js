const { QueryTypes } = require("sequelize");
const runQuery = require("../helper/queryHelper");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const { dbface } = require("../lowdb/lowdb");
const { createEmbedding } = require("../helper/model_emb");
const jwt = require("jsonwebtoken");
const { updateUser, calculateAge } = require("../helper/update_user");

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
      face_emb = await createEmbedding(base64);
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
      sex: sex.toString(),
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

exports.Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const [user] = await runQuery(
      `SELECT id, id_card, name, sex, email, password_hash, role, profile_image_url,birthday, auth_image_url FROM users WHERE email = :email`,
      {
        email,
      },
      QueryTypes.SELECT
    );

    if (!user)
      return res.status(401).json({ message: "User not found or inactive" });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res.status(401).json({ message: "Invalid email or password" });

    const payload = {
      id: user.id,
      id_card: user.id_card,
      name: user.name,
      sex: user.sex,
      email: user.email,
      password_hash: user.password_hash,
      role: user.role,
      profile_image_url: user.profile_image_url,
      auth_image_url: user.auth_image_url,
      birthday: user.birthday,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return res.status(200).json({
      token,
      user,
      message: `Welcom back, ${user?.name}`,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.AuthMe = async (req, res) => {
  try {
    const userId = req.authUser.id;

    const [user] = await runQuery(
      `SELECT id, id_card, name, sex, email, password_hash, role, profile_image_url,birthday, auth_image_url FROM users WHERE id = :userId`,
      {
        userId,
      },
      QueryTypes.SELECT
    );

    if (!user) return res.status(403).json({ message: "User not found" });

    res.status(200).json({
      id: user.id,
      id_card: user.id_card,
      name: user.name,
      sex: user.sex,
      email: user.email,
      password_hash: user.password_hash,
      role: user.role,
      profile_image_url: user.profile_image_url,
      auth_image_url: user.auth_image_url,
      birthday: user.birthday,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.UpdateProfile = async (req, res) => {
  try {
    const userId = req.authUser.id;

    console.log(req.body);

    const { email, gender, address, name, dateOfBirth } = req.body;
    let profileImageUrl = null;
    let profileBase64 = null;
    let authenImageUrl = null;
    let authenBase64 = null;
    let authenFace_emb = null;

    const profileImageDir = path.join(process.cwd(), "img/profile");
    const authenImageDir = path.join(process.cwd(), "img/auth");

    const updates = [];
    const replacements = {
      email,
      gender,
      address,
      name,
      birthday: dateOfBirth,
      userId,
    };

    if (!fs.existsSync(profileImageDir)) {
      fs.mkdirSync(profileImageDir, { recursive: true });
    }

    if (!fs.existsSync(authenImageDir)) {
      fs.mkdirSync(authenImageDir, { recursive: true });
    }

    if (req.files && req.files.image1) {
      const file1 = req.files.image1[0]; // multer gives array

      const fileName1 = `profile-${Date.now()}${path.extname(
        file1.originalname
      )}`;
      const filePath1 = path.join(profileImageDir, fileName1);

      fs.writeFileSync(filePath1, file1.buffer);
      profileBase64 = file1.buffer.toString("base64");
      profileImageUrl = `/img/profile/${fileName1}`;
      updates.push("profile_image_url = :profile_image_url");
      replacements.profile_image_url = profileImageUrl;
    }

    if (req.files && req.files.image2) {
      const file2 = req.files.image2[0];

      const fileName2 = `authen-${Date.now()}${path.extname(
        file2.originalname
      )}`;
      const filePath2 = path.join(authenImageDir, fileName2);

      fs.writeFileSync(filePath2, file2.buffer);
      authenBase64 = file2.buffer.toString("base64");
      authenImageUrl = `/img/auth/${fileName2}`;
      authenFace_emb = await createEmbedding(authenBase64);
      updates.push("auth_image_url = :auth_image_url");
      replacements.auth_image_url = authenImageUrl;
    }

    await runQuery(
      `UPDATE users
       SET email = :email, sex = :gender, address = :address, name = :name, birthday =:birthday
       ${updates.length == 0 ? "" : "," + updates.join(", ")}
       WHERE id = :userId;`,
      replacements,
      QueryTypes.UPDATE
    );

    if (req.files && req.files.image2) {
      await updateUser(userId, {
        name: name,
        sex: gender,
        age: calculateAge(dateOfBirth).toString(),
        address: address,
        remark: "",
        face_emb: authenFace_emb,
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      image1: profileImageUrl,
      image2: authenImageUrl,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
