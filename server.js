const express = require("express");
const env = require("dotenv");
env.config();
const webpush = require("web-push");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

// Điền cặp key bạn vừa tạo ở Bước 1 vào đây
const publicVapidKey = process.env.PUBLIC_KEY;
const privateVapidKey = process.env.PRIVATE_KEY;
console.log(publicVapidKey);
webpush.setVapidDetails(
  "mailto:test@test.com",
  publicVapidKey,
  privateVapidKey,
);

// Biến tạm để lưu token thiết bị (Thay vì dùng Database MongoDB)
let savedSubscription = null;

// API để Frontend gửi token lên lưu
app.post("/api/save-subscription", (req, res) => {
  savedSubscription = req.body;
  res.status(201).json({ message: "Lưu token thành công!" });
});

// API giả lập: Khi gọi API này, Server sẽ tự động bắn Push về máy bạn
app.post("/api/trigger-push", async (req, res) => {
  if (!savedSubscription) {
    return res
      .status(400)
      .json({ error: "Chưa có thiết bị nào đăng ký nhận thông báo!" });
  }

  const payload = JSON.stringify({
    title: "Tin nhắn Demo Localhost",
    body: "Nội dung tin nhắn giả lập từ chat-app!",
    url: "http://localhost:3000",
  });

  try {
    await webpush.sendNotification(savedSubscription, payload);

    res.json({
      success: true,
      message: "Đã bắn thông báo thành công!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
});

app.listen(3000, () => console.log("Server chạy tại http://localhost:3000"));
