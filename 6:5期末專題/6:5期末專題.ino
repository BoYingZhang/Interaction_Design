// v2_terra_apocalypsis.ino
const int potPin = A0;      // 可變電阻接 A0
const int buttonPin = 2;    // 按鈕接 D2（需接地，使用 INPUT_PULLUP）

int mode = 0;               // M值（0=海嘯, 1=地震, 2=火災）
int lastButtonState = HIGH;
unsigned long lastDebounceTime = 0;
const unsigned long debounceDelay = 50;

void setup() {
  pinMode(buttonPin, INPUT_PULLUP);
  Serial.begin(9600);
}

void loop() {
  // 讀取 A 值
  int amp = analogRead(potPin);  // 0 ~ 1023

  // 讀取 M 值（透過按鈕切換）
  int reading = digitalRead(buttonPin);

  if (reading == LOW && lastButtonState == HIGH && (millis() - lastDebounceTime) > debounceDelay) {
    mode = (mode + 1) % 3;  // 模式循環：0→1→2→0
    lastDebounceTime = millis();
  }
  lastButtonState = reading;

  // 傳送序列資料（格式: A:xxx,M:x）
  Serial.print("A:");
  Serial.print(amp);
  Serial.print(" M:");
  Serial.println(mode);

  delay(30);  // 傳輸節奏建議延遲
}
