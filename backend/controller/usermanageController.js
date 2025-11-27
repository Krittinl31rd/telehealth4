const runQuery = require("../helper/queryHelper");
const { QueryTypes } = require("sequelize");

exports.GetAllUsers = async (req, res) => {
  try {
    const userId = req.authUser.id;

    const users = await runQuery(
      `SELECT id, id_card, name, sex, email, role, profile_image_url, birthday, auth_image_url 
       FROM users`,{},
      QueryTypes.SELECT
    );

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

 
 