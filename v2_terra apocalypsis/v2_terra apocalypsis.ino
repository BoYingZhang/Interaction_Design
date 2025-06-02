const int potPin = A0;       // 可變電阻接 A0
const int buttonPin = 2;     // 按鈕接 D2

int mode = 0;
int lastButtonState = HIGH;
unsigned long lastDebounceTime = 0;
const unsigned long debounceDelay = 50;

void setup() {
  pinMode(buttonPin, INPUT_PULLUP);  // 使用內建上拉電阻
  Serial.begin(9600);                // 啟動序列傳輸
}

void loop() {
  // 讀取可變電阻
  int potValue = analogRead(potPin);  // 範圍 0~1023

  // 防彈跳邏輯處理按鈕
  int buttonState = digitalRead(buttonPin);
  if (buttonState == LOW && lastButtonState == HIGH && (millis() - lastDebounceTime) > debounceDelay) {
    mode = (mode + 1) % 3;  // 模式循環：0 → 1 → 2 → 0
    lastDebounceTime = millis();
  }
  lastButtonState = buttonState;

  // 輸出格式為 A:數值,M:數值，例如 A:512,M:1
  Serial.print("A:");
  Serial.print(potValue);
  Serial.print(",M:");
  Serial.println(mode);

  delay(150);  // 降低傳送頻率，避免瀏覽器負載過重
}
