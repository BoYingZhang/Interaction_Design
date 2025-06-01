
# 🌋 Wave Terrain - Apocalypse Modes

以末日災難為主題的互動式 3D 地形動畫，結合 p5.js 與 Arduino，讓觀眾透過實體控制元件（如可變電阻、按鈕）實時操控動畫振幅與模式切換，感受海嘯、地震與火焰風暴的震撼。

## 🎮 專案特色

- 🌊 模式一：**Tsunami 海嘯**  
  流動感強的波浪紋理，搭配水藍色調，模擬巨浪來襲。

- 🌍 模式二：**Earthquake 地震**  
  噪聲與脈衝結合，呈現地殼不穩定震動感。

- 🔥 模式三：**Firestorm 火焰風暴**  
  中心向外脈動式燃燒效果，火紅配色，具毀滅氛圍。

## 🧰 技術架構

- **前端繪圖**：p5.js (WEBGL 模式)
- **串接硬體**：Web Serial API（@serialport/web-serial）
- **硬體裝置**：Arduino 傳送資料格式 A:數值,M:數值
  - `A`: 模擬輸入（如可變電阻）控制振幅
  - `M`: 按鈕或數位輸入控制模式（0~2）

## 📦 專案結構

```
index.html           // 主入口點，包含 p5.js 與 Serial 腳本
style + script       // 全部嵌入於 HTML 中
```

## 🖥️ 操作說明

1. **連接 Arduino 裝置**
   - 點擊畫面右上角「🔌 連接 Arduino」按鈕
   - 授權序列埠權限

2. **串口輸入格式（Arduino 端）**
   - 每筆資料格式為：`A:512,M:1`
   - 可透過 `analogRead()`、`digitalRead()` 組合產生

3. **鍵盤快速切換模式（模擬用）**
   - `1`: 海嘯模式
   - `2`: 地震模式
   - `3`: 火焰風暴模式

## 📈 Debug 資訊

畫面左上角 `#debug` 顯示：
- 畫面 FPS
- 當前模式
- 振幅值
- 資料格式提示

## 🧪 測試建議

- 若無 Arduino，可手動按鍵切換模式、程式內調整 `amplitude` 初始值測試視覺效果。
- 瀏覽器需支援 Web Serial API（建議使用 Chrome）。

## 🧵 未來可擴充方向

- 支援更多災難視覺模式
- 加入音效、震動回饋
- 設計 GUI 控制面板
- 串接多感測器或影像辨識

## 🛠️ 開發者環境

- Chrome 113+（啟用 Web Serial）
- p5.js v1.6.0
- Node.js 非必要（純前端專案）
- 適配 Arduino Uno/Nano 等
