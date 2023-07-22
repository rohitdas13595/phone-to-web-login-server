const crypto = require('crypto')
const generateQR = async () => {
  const token = crypto.randomBytes(64).toString("hex");
  let channel_data =
    new Date().getDate() +
    "-" +
    new Date().getMonth() +
    "-" +
    new Date().getMinutes();
  let channel_data_hash = crypto
    .createHash("md5")
    .update(channel_data + "||" + token)
    .digest("hex");
  return {
    success: true,
    msg: "QR DATA Created",
    data: {
      channel: channel_data_hash,
    },
  };
};

module.exports = generateQR;
