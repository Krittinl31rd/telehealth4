const { createEmbedding, cosineSimilarity } = require("../helper/model_emb");
const faceDB = require("../facedb.json");
const { QueryTypes } = require("sequelize");
const runQuery = require("../helper/queryHelper");

exports.ConvertImg = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const base64 = req.file.buffer.toString("base64");

    const embedding = await createEmbedding(base64);

    if (!embedding) {
      return res.status(400).json({ message: "Face not found" });
    }

    // success
    return res.json({
      message: "success",
      //   base64Length: base64.length,
      //   base64: base64,
      //   embeddingLength: embedding.length,
      embedding: embedding, // float32 array 128 ค่า
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Error" });
  }
};

exports.AuthFace = async (req, res) => {
  const { action, deviceID, content } = req.body;

  try {
    let base64 = content.replace(/^data:image\/[a-zA-Z]+;?/, "");

    // convert base64 to embedding
    const embedding = await createEmbedding(base64);
    if (!embedding) {
      return res
        .status(400)
        .json({ recode: "4001", remsg: "Face not detected" });
    }

    let bestMatch = null;
    let bestSim = 0;

    faceDB.forEach((item) => {
      const sim = cosineSimilarity(embedding, item.face_emb);
      if (sim > bestSim) {
        bestSim = sim;
        bestMatch = item;
      }
    });

    const THRESHOLD = 0.6;
    if (bestSim >= THRESHOLD) {
      console.log("Same person:", bestMatch.name);
      return res.status(200).json({
        recode: "2000",
        remsg: "success",
        userinfo: {
          name: bestMatch.name,
          sex: bestMatch.sex,
          age: bestMatch.age,
          usernum: bestMatch.usernum,
          address: bestMatch.address,
          remark: bestMatch.remark,
        },
      });
    } else {
      return res.status(200).json({
        recode: "1000",
        remsg: "failed",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.Auth = async (req, res) => {
  const { action, deviceID, type, xid } = req.body;

  try {
    return res.status(200).json({
      retCode: 1,
      uinfo: {
        title: "test",
        cardID: "xxxxxxxxxxxxxx",
        userNum: match.usernum,
        name: match.name,
        sex: match.sex,
        age: match.age,
        headimgurl: "",
        imgBaseData: "",
        remark: match.remark,
      },
      dbinfo: {
        loc: "",
        dbUrl: "",
      },
      msg: "success",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
