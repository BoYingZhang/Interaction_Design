// 定義超音波感測器的腳位
const int TRIG_PIN = 9;    // 觸發腳位
const int ECHO_PIN = 10;   // 接收腳位
const int LED_PIN = 3;     // LED 腳位
const int BUZZER_PIN = 11; // 蜂鳴器腳位

// 定義常數
const int DISTANCE_THRESHOLD = 20;  // LED 觸發距離閾值（公分）
const int MEASURE_INTERVAL = 200;   // 測量間隔（毫秒）
const int MAX_DISTANCE = 400;       // 最大測量距離（公分）
const int SAMPLES = 5;              // 平均值計算的樣本數

// 定義蜂鳴器相關常數
const int MIN_DISTANCE = 5;         // 最小警告距離（公分）
const int WARNING_DISTANCE = 30;    // 警告距離（公分）
const int MIN_FREQ = 200;          // 最低頻率（Hz）
const int MAX_FREQ = 2000;         // 最高頻率（Hz）

// 用於計算平均值的陣列
int distances[SAMPLES];
int sampleIndex = 0;

void setup() {
  // 初始化序列通訊
  Serial.begin(9600);
  
  // 設定腳位模式
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  
  // 初始化距離陣列
  for (int i = 0; i < SAMPLES; i++) {
    distances[i] = 0;
  }
}

// 測量距離的函數
int measureDistance() {
  // 發送觸發信號
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  // 讀取回傳時間
  long duration = pulseIn(ECHO_PIN, HIGH, 23529);  // 設定超時時間為最大距離
  
  // 檢查是否超時
  if (duration == 0) {
    return MAX_DISTANCE;
  }
  
  // 計算距離（聲速為343.2m/s，來回距離要除以2）
  int distance = duration * 0.0343 / 2;
  
  // 確保距離在有效範圍內
  return constrain(distance, 0, MAX_DISTANCE);
}

// 計算平均距離
int getAverageDistance() {
  // 更新距離陣列
  distances[sampleIndex] = measureDistance();
  sampleIndex = (sampleIndex + 1) % SAMPLES;
  
  // 計算平均值
  long sum = 0;
  for (int i = 0; i < SAMPLES; i++) {
    sum += distances[i];
  }
  return sum / SAMPLES;
}

// 根據距離計算蜂鳴器頻率
int calculateBuzzerFrequency(int distance) {
  if (distance >= WARNING_DISTANCE) {
    return 0; // 距離大於警告距離時不發聲
  }
  
  // 將距離映射到頻率範圍
  // 距離越近，頻率越高
  if (distance < MIN_DISTANCE) {
    return MAX_FREQ;
  }
  
  return map(distance, MIN_DISTANCE, WARNING_DISTANCE, MAX_FREQ, MIN_FREQ);
}

// 控制蜂鳴器發聲
void controlBuzzer(int distance) {
  int frequency = calculateBuzzerFrequency(distance);
  
  if (frequency > 0) {
    tone(BUZZER_PIN, frequency);
  } else {
    noTone(BUZZER_PIN);
  }
}

void loop() {
  // 取得平均距離
  int distance = getAverageDistance();
  
  // 輸出距離
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");
  
  // 根據距離控制 LED
  digitalWrite(LED_PIN, distance < DISTANCE_THRESHOLD ? HIGH : LOW);
  
  // 控制蜂鳴器
  controlBuzzer(distance);
  
  delay(MEASURE_INTERVAL);
}