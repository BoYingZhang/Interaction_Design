# AI 對話系統 (Chat with Gemini)

這是一個使用 Google Gemini API 建立的網頁 AI 對話系統，讓使用者可以在網頁介面上與 AI 模型互動。

## 🔧 功能特色

- 使用者輸入訊息並即時獲得 AI 回應
- 支援儲存 API 金鑰於瀏覽器 LocalStorage
- 支援按下 Enter 鍵直接送出訊息
- 訊息分為使用者與 AI 兩種樣式顯示

## 📁 專案結構

```
.
├── index.html      # 主網頁檔案，包含 UI 結構與樣式
├── script.js       # JavaScript 主邏輯，包含 API 呼叫與訊息處理
```

## 🚀 使用方式

1. 將專案下載或上傳至伺服器環境中
2. 開啟 `index.html`
3. 輸入您的 Google Gemini API 金鑰（`Generative Language API`），點選「儲存金鑰」
4. 在輸入框中輸入訊息並點擊「發送」或按 Enter 鍵，即可開始對話

## 🔐 注意事項

- 您的 API 金鑰會儲存在瀏覽器的 LocalStorage 中，僅供個人使用。
- 請勿將金鑰硬寫在 `script.js` 檔案內上傳或分享，以免洩漏。

## 📜 範例畫面

```
使用者：你好！
AI：你好！有什麼我可以幫助你的嗎？
```

## 📦 相依套件

本專案不依賴任何第三方框架或函式庫，純使用 HTML + CSS + 原生 JavaScript。

## 🧠 使用的模型

本系統呼叫的是 Google Gemini 2.0 Flash 模型：
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
```

## 📄 授權

本專案僅供學習與個人用途，請勿用於商業用途。