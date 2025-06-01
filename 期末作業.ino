const int potPin = A0;       // 可變電阻接 A0
const int buttonPin = 2;     // 按鈕接 D2

int mode = 0;
int lastButtonState = HIGH;
unsigned long lastDebounceTime = 0;
const unsigned long debounceDelay = 50;

void setup() {
  pinMode(buttonPin, INPUT_PULLUP); // 啟用內建上拉電阻
  Serial.begin(9600);
}

void loop() {
  // 讀取可變電阻值（0~1023）
  int potValue = analogRead(potPin);

  // 按鈕防彈跳 + 切換模式
  int buttonState = digitalRead(buttonPin);
  if (buttonState == LOW && lastButtonState == HIGH && (millis() - lastDebounceTime) > debounceDelay) {
    mode = (mode + 1) % 3; // 0 → 1 → 2 → 0
    lastDebounceTime = millis();
  }
  lastButtonState = buttonState;

  // 統一輸出格式給 p5.js： A:512,M:1
  Serial.print("A:");
  Serial.print(potValue);
  Serial.print(",M:");
  Serial.println(mode);

  delay(150); // 降低頻率以穩定傳輸
}
