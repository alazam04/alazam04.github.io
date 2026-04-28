export default async function handler(req, res) {
  const API_KEY = "cd2dc704Be3cdd39f872fB5e567ec38e";
  const ID = req.query.id;

  if (!ID) {
    return res.status(200).json({ otp: "Masukkan ID dulu" });
  }

  try {
    const response = await fetch(
      `https://hero-sms.com/api/v1/sms/check?api_key=${API_KEY}&id=${ID}`
    );

    const data = await response.json();

    let otp = "";

    if (data.sms) {
      otp = data.sms;
    } else if (data.code) {
      otp = data.code;
    } else if (data.message) {
      otp = data.message;
    } else {
      otp = JSON.stringify(data);
    }

    res.status(200).json({ otp });

  } catch (error) {
    res.status(500).json({ otp: "Error ambil OTP" });
  }
}
