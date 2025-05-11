# 互動波浪曲線動畫 (Interactive Wave Curves Animation)

這是一個使用 p5.js 製作的互動式 3D 波浪曲線動畫專案，支援鍵盤控制和 Arduino 感測器互動。

## 功能特點

- 3D 波浪地形視覺效果
- 10 種豐富的顏色主題
- 即時互動控制
- Arduino 感測器整合
- 效能監控和除錯資訊

## 控制方式

### 鍵盤控制
- `C` 鍵：切換顏色主題
- `↑` / `↓` 方向鍵：調整波浪高度
- `←` / `→` 方向鍵：調整動畫速度

### Arduino 感測器控制
- 超音波感測器：控制波浪振幅（距離範圍：0-400 cm）
- 可變電阻：控制顏色主題（範圍：0-1023）

## 硬體連接

### Arduino 設定
1. 需要的元件：
   - Arduino 板（支援 WiFi）
   - 超音波感測器（HC-SR04）
   - 可變電阻（10K）

2. 接線方式：
   - 超音波感測器：
     - Trig: 數位腳位
     - Echo: 數位腳位
   - 可變電阻：
     - 訊號腳：類比腳位 A0
     - VCC: 5V
     - GND: GND

## WebSocket 連接

- WebSocket 預設端口：81
- 數據格式：JSON
  ```json
  {
    "distance": 0-400,    // 超音波感測器距離（公分）
    "potValue": 0-1023    // 可變電阻數值
  }
  ```

## 系統需求

- 現代網頁瀏覽器（支援 WebGL）
- Arduino IDE（用於上傳程式碼到 Arduino）
- 網路連接（用於 WebSocket 通訊）

## 技術堆疊

- p5.js 繪圖庫
- WebSocket 即時通訊
- Arduino 微控制器
- HTML5/JavaScript

## 開始使用

1. 將 Arduino 程式碼上傳到您的開發板
2. 確保 Arduino 已連接到與電腦相同的網路
3. 修改 index.html 中的 WebSocket 連接地址
4. 在瀏覽器中開啟 index.html

## 效能監控

左上角的除錯資訊面板顯示：
- FPS（畫面更新率）
- WebSocket 連接狀態
- 感測器數據
- 畫面參數
- 控制說明

## 注意事項

- 感測器模式下，鍵盤控制會被感測器數據覆蓋
- 建議使用支援硬體加速的現代瀏覽器以獲得最佳效果
- 確保 Arduino 和電腦在同一個區域網路內