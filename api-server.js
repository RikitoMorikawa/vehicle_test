// api-server.js - ESモジュール構文バージョン
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

// 環境変数の読み込み
dotenv.config();

// Expressアプリの作成
const app = express();
const PORT = process.env.PORT || 3001;

// 環境変数を取得する関数 (開発環境と本番環境の両方をサポート)
const getEnv = (key) => {
  const devKey = `VITE_${key}`;
  return process.env[key] || process.env[devKey];
};

// CORS設定
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:3000"],
  methods: ["POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// SMTPトランスポーターの設定
const getTransporter = () => {
  return nodemailer.createTransport({
    host: getEnv("SMTP_HOST"),
    port: parseInt(getEnv("SMTP_PORT") || "587"),
    secure: getEnv("SMTP_PORT") === "465",
    auth: {
      user: getEnv("SMTP_USER"),
      pass: getEnv("SMTP_PASS"),
    },
  });
};

// メールテンプレートの取得
const getEmailTemplate = (type, data) => {
  if (type === "user_confirmation") {
    return {
      subject: "【重要】アカウント登録申請を受け付けました",
      html: `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2>アカウント登録申請を受け付けました</h2>
          <p>${data.user_name} 様</p>
          <p>この度はアカウント登録申請をいただき、誠にありがとうございます。</p>
          <p>現在、管理者による承認作業を行っております。承認が完了次第、改めてご連絡いたします。</p>
          <p>※このメールは自動送信されています。返信はできませんのでご了承ください。</p>
        </div>
      `,
    };
  } else if (type === "admin_notification") {
    return {
      subject: "【通知】新規ユーザー登録申請がありました",
      html: `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2>新規ユーザー登録申請</h2>
          <p>以下のユーザーから登録申請がありました。管理画面から承認作業を行ってください。</p>
          <table style="border-collapse: collapse; width: 100%;">
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">項目</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">内容</th>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">企業名</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${data.company_name || "-"}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">氏名</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${data.user_name || "-"}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">メールアドレス</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${data.email || "-"}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">電話番号</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${data.phone || "-"}</td>
            </tr>
          </table>
          <p style="margin-top: 20px;">
            <a href="${getEnv(
              "APP_URL"
            )}/admin/users" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px;">
              管理画面へ
            </a>
          </p>
        </div>
      `,
    };
  } else {
    return {
      subject: "【通知】システムからのお知らせ",
      html: `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2>システムからのお知らせ</h2>
          <p>このメールはシステムから自動送信されています。</p>
        </div>
      `,
    };
  }
};

// メール送信エンドポイント
app.post("/api/send-email", async (req, res) => {
  try {
    const { email, type, userData } = req.body;

    console.log("リクエスト受信:", { email, type });

    if (!email || !type) {
      return res.status(400).json({ error: "Email and type are required" });
    }

    // トランスポーターの取得
    const transporter = getTransporter();

    // メールテンプレートの取得
    const template = getEmailTemplate(type, userData);

    // 送信先の決定
    const to = type === "user_confirmation" ? email : getEnv("ADMIN_EMAIL") || "";

    console.log("メール送信準備:", { to, subject: template.subject });

    // メール送信
    const info = await transporter.sendMail({
      from: getEnv("SMTP_FROM") || "",
      to,
      subject: template.subject,
      html: template.html,
    });

    console.log("Message sent: %s", info.messageId);

    return res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("Error sending email:", error);

    return res.status(500).json({ error: error.message });
  }
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});

// Vercel用のエクスポート
export default app;
