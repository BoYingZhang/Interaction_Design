# 波浪動畫與 Arduino 互動專案

這是一個結合 WebGL 波浪動畫與 Arduino 感測器互動的專案。使用者可以通過實體感測器控制波浪的動態效果、顏色和形狀。

## 功能特色

- 3D 波浪動畫效果
- 即時互動控制
- 三種預設顏色主題
- 動態/靜態切換
- 即時除錯資訊顯示

## 硬體需求

- Arduino UNO 或相容板
- HC-SR04 超音波感測器
- 按鈕開關 x1
- 10K 可調電阻 x1
- 麵包板與連接線

## 硬體接線說明

1. **超音波感測器 (HC-SR04)**
   - VCC → Arduino 5V
   - GND → Arduino GND
   - TRIG → Arduino D9
   - ECHO → Arduino D10

2. **按鈕開關**
   - 一端 → Arduino D2
   - 另一端 → Arduino GND

3. **可調電阻**
   - 左端 → Arduino 5V
   - 中端 → Arduino A0
   - 右端 → Arduino GND

## 軟體需求

- Arduino IDE
- Google Chrome 瀏覽器（支援 Web Serial API）
- 網路連接（用於載入 p5.js 函式庫）

## 安裝步驟

1. **Arduino 程式設置**
   ```
   1. 開啟 Arduino IDE
   2. 打開 wave_controller/wave_controller.ino
   3. 選擇正確的開發板（Tools > Board > Arduino UNO）
   4. 選擇正確的連接埠（Tools > Port）
   5. 點擊上傳按鈕
   ```

2. **網頁程式執行**
   ```
   1. 使用 Chrome 瀏覽器開啟 wave_animation.html
   2. 當瀏覽器詢問時，選擇 Arduino 的序列埠
   3. 等待連接成功（左上角狀態會顯示「已連接」）
   ```

## 使用說明

### 感測器控制

1. **超音波感測器**
   - 功能：切換波浪動態/靜態狀態
   - 使用方式：在感測器前 20cm 內揮手
   - 效果：波浪會在動態和靜態之間切換

2. **按鈕**
   - 功能：切換顏色主題
   - 使用方式：按下按鈕
   - 效果：循環切換三種顏色主題（海洋藍 → 夕陽紅 → 森林綠）

3. **可調電阻**
   - 功能：控制波浪高度
   - 使用方式：轉動電阻
   - 效果：即時調整波浪振幅大小

### 備用鍵盤控制

- 按 'C' 鍵：手動切換顏色主題（當 Arduino 未連接時可用）

## 除錯資訊

畫面左上角會顯示即時資訊：
- FPS（幀率）
- 視窗大小
- 地形大小
- 動態/靜態狀態
- 當前振幅
- 移動速度
- 顏色主題
- Arduino 連接狀態

## 常見問題解決

1. **無法連接 Arduino**
   - 確認 Arduino 驅動程式是否正確安裝
   - 確認使用的是 Chrome 瀏覽器
   - 檢查 Arduino 序列埠是否被其他程式占用

2. **感測器無反應**
   - 檢查接線是否正確且穩固
   - 確認 Arduino 程式是否成功上傳
   - 檢查 Serial Monitor 中的數據輸出

3. **動畫效果異常**
   - 檢查網路連接（p5.js 需要網路載入）
   - 清除瀏覽器快取後重試
   - 確認電腦支援 WebGL

## 技術說明

- 前端：HTML5, WebGL, p5.js
- 硬體通訊：Web Serial API
- 控制器：Arduino

## 授權聲明

本專案採用 MIT 授權條款。您可以自由使用、修改和分享此專案，但請保留原作者署名。
