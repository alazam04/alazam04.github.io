export default async function handler(req, res) {
  const API_KEY = "cd2dc704Be3cdd39f872fB5e567ec38e";

  try {
    let ID = null;
    let number = "-";

    // 🔹 Coba ambil list order (beberapa kemungkinan endpoint)
    const endpoints = [
      "https://hero-sms.com/api/v1/order/list",
      "https://hero-sms.com/api/v1/user/orders",
      "https://hero-sms.com/api/getOrders"
    ];

    for (let url of endpoints) {
      try {
        const r = await fetch(`${url}?api_key=${API_KEY}`);
        const d = await r.json();

        let list = d.data || d.orders || d;

        if (Array.isArray(list) && list.length > 0) {
          let last = list[0]; // ambil terbaru
          ID = last.id || last.ID || last.order_id;
          number = last.number || last.phone || last.msisdn || "-";
          break;
        }
      } catch (e) {}
    }

    if (!ID) {
      return res.status(200).json({
        otp: "Belum ada order",
        number: "-",
        id: "-"
      });
    }

    // 🔹 Ambil OTP
    const smsRes = await fetch(
      `https://hero-sms.com/api/v1/sms/check?api_key=${API_KEY}&id=${ID}`
    );

    const smsData = await smsRes.json();

    let raw = smsData.sms || smsData.message || JSON.stringify(smsData);

    // 🔥 ambil angka saja
    let otpMatch = raw.match(/\d{4,8}/);
    let otp = otpMatch ? otpMatch[0] : "Menunggu OTP";

    res.status(200).json({
      id: ID,
      number: number,
      otp: otp
    });

  } catch (error) {
    res.status(500).json({
      otp: "Error",
      number: "-",
      id: "-"
    });
  }
                             }
