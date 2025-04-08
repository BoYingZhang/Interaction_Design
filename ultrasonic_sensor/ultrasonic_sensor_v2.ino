// 互動歡迎機器人
#include <Servo.h>

// 感測器腳位
const int trigPin = 9;
const int echoPin = 10;
const int buzzerPin = 7;
const int buttonPin = 8;
const int mercuryPin = 12;

// LED 腳位
const int ledPins[5] = {2, 3, 4, 5, 6};

// 伺服馬達
Servo myServo;
const int servoPin = 11;

// 狀態變數
bool welcomeMode = true;

// 新增變數
const unsigned long DEBOUNCE_DELAY = 50;    // 防彈跳延遲時間（毫秒）
unsigned long lastButtonPress = 0;           // 上次按鈕按下的時間
unsigned long lastDetectionTime = 0;         // 上次偵測觸發的時間
const unsigned long DETECTION_COOLDOWN = 3000; // 偵測冷卻時間（毫秒）

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(buzzerPin, OUTPUT);
  pinMode(buttonPin, INPUT_PULLUP);
  pinMode(mercuryPin, INPUT);

  for (int i = 0; i < 5; i++) {
    pinMode(ledPins[i], OUTPUT);
    digitalWrite(ledPins[i], LOW);
  }

  myServo.attach(servoPin);
  myServo.write(90);  // 初始位置

  Serial.begin(9600);
}

void loop() {
  unsigned long currentMillis = millis();
  
  // 改進按鈕防彈跳處理
  if (digitalRead(buttonPin) == LOW) {
    if (currentMillis - lastButtonPress > DEBOUNCE_DELAY) {
      welcomeMode = !welcomeMode;
      Serial.println(welcomeMode ? "進入歡迎模式" : "離開歡迎模式");
      lastButtonPress = currentMillis;
    }
  }

  // 水銀開關偵測裝置是否傾斜
  if (digitalRead(mercuryPin) == HIGH) {
    Serial.println("裝置傾斜，進入待命模式");
    return;
  }

  if (welcomeMode) {
    long duration, distance;
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);

    duration = pulseIn(echoPin, HIGH);
    
    // 加入超時檢查
    if (duration == 0) {
        Serial.println("超音波感測器讀取超時");
        return;
    }
    
    distance = duration * 0.034 / 2;
    
    // 加入合理範圍檢查
    if (distance > 400 || distance < 2) {
        Serial.println("距離超出有效範圍");
        return;
    }

    // 加入冷卻時間檢查，避免重複觸發
    if (distance < 40 && (currentMillis - lastDetectionTime > DETECTION_COOLDOWN)) {
        Serial.print("偵測到距離: ");
        Serial.print(distance);
        Serial.println(" cm");
        lastDetectionTime = currentMillis;

        // LED 燈效優化
        welcomeEffect();
    }
  }
}

// 新增 LED 控制函式
void welcomeEffect() {
  // 流水燈效果
  for (int i = 0; i < 5; i++) {
    digitalWrite(ledPins[i], HIGH);
    delay(50);  // 縮短延遲時間
    digitalWrite(ledPins[i], LOW);
  }

  // 閃爍效果
  for (int i = 0; i < 2; i++) {  // 減少重複次數
    for (int j = 0; j < 5; j++) {
      digitalWrite(ledPins[j], HIGH);
    }
    tone(buzzerPin, 1000, 100);  // 縮短蜂鳴器音效
    delay(100);
    
    for (int j = 0; j < 5; j++) {
      digitalWrite(ledPins[j], LOW);
    }
    delay(100);
  }

  // 平滑的伺服馬達動作
  for (int pos = 90; pos >= 45; pos--) {
    myServo.write(pos);
    delay(5);
  }
  tone(buzzerPin, 1500, 100);
  
  for (int pos = 45; pos <= 135; pos++) {
    myServo.write(pos);
    delay(5);
  }
  tone(buzzerPin, 1800, 100);
  
  for (int pos = 135; pos >= 90; pos--) {
    myServo.write(pos);
    delay(5);
  }
}
