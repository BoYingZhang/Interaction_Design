//Arduino 控制程式
const int TRIG_PIN = 9;     // 超音波感測器
const int ECHO_PIN = 10;
const int BUTTON_PIN = 2;   // 按鈕
const int POT_PIN = A0;     // 可調式電阻

// 追蹤按鈕狀態
int lastButtonState = HIGH;
int buttonPresses = 0;

void setup() {
  Serial.begin(9600);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(POT_PIN, INPUT);
}

void loop() {
  // 讀取超音波距離
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  long duration = pulseIn(ECHO_PIN, HIGH);
  int distance = duration * 0.034 / 2;
  
  // 讀取按鈕狀態
  int buttonState = digitalRead(BUTTON_PIN);
  if (buttonState == LOW && lastButtonState == HIGH) {
    buttonPresses = (buttonPresses + 1) % 3;  // 循環切換 0,1,2
    delay(50);  // 消除彈跳
  }
  lastButtonState = buttonState;
  
  // 讀取電阻值
  int potValue = analogRead(POT_PIN);
  
  // 發送數據到序列埠
  String data = String(distance) + "," + 
                String(buttonPresses) + "," + 
                String(potValue);
  Serial.println(data);
  
  delay(50);
}
