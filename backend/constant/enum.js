const measurement_types = {
  BMI: 1,
  BP: 2,
  BF: 3,
  temp: 4,
  bo: 5,
  bs: 6,
  whr: 7,
  ncg: 8,
  zytz: 9,
  ecg: 10,
  xzsx: 11,
  eye: 12,
  sds: 13,
  thxhdb: 14,
  fei: 15,
  jiu: 16,
  gmd: 17,
  com: 18,
};

const sectionList = [
  "BMI",
  "BP",
  "BF",
  "temp",
  "bo",
  "bs",
  "whr",
  "ncg",
  "zytz",
  "ecg",
  "xzsx",
  "eye",
  "sds",
  "thxhdb",
  "fei",
  "jiu",
  "gmd",
  "com",
];

const user_role = { p: "patient", d: "doctor", a: "admin" };

const ws_cmd = {
  login: 1,

  measurement_result: 10,

  doctor_status: 100,
};

module.exports = { measurement_types, sectionList, user_role, ws_cmd };
