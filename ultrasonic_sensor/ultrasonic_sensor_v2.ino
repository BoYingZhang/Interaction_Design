// led_music_control.ino
#include <Servo.h>

// --- 音符定義與對應 ---
const char* melody = "ECEC EGG0 FDD ECCE CEC";
const int melodyLength = 19;

// --- 腳位定義 ---
const int trigPin = 9;
const int echoPin = 10;
const int buzzerPin = 6;
const int buttonPin = 7;
const int mercuryPin = 8;
const int ledPins[] = {2, 4, 5, A0, A1};
const int potPin = A2;
const int servoPin = 3;

// --- 控制變數 ---
int selectedLed = 0;
bool lastButtonState = LOW;
bool isPlaying = false;
bool isLocked = false;
unsigned long lastDebounceTime = 0;
int melodyIndex = 0;
Servo servo;

void setup() {
  Serial.begin(9600);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(buzzerPin, OUTPUT);
  pinMode(buttonPin, INPUT);
  pinMode(mercuryPin, INPUT);
  for (int i = 0; i < 5; i++) pinMode(ledPins[i], OUTPUT);
  servo.attach(servoPin);
  servo.write(90);
}

void loop() {
  handleButton();
  updateLedBrightness();

  long distance = readDistanceCM();
  bool mercuryTilt = digitalRead(mercuryPin);

  if (mercuryTilt) {
    stopPlayback();
    isLocked = true;
    Serial.println("[LOCKED] Mercury switch triggered.");
  }

  if (distance < 4) {
    if (!isLocked) {
      isPlaying = !isPlaying;
      Serial.println(isPlaying ? "[PLAY] Start playing." : "[PAUSE] Paused.");
    } else {
      Serial.println("[INFO] Locked. Move sensor to unlock.");
      isLocked = false; // 假設移開物體即解除鎖定
    }
    delay(1000); // Debounce
  }

  if (isPlaying) playMelody();
  delay(100);
}

void handleButton() {
  bool currentButton = digitalRead(buttonPin);
  if (currentButton == HIGH && lastButtonState == LOW && millis() - lastDebounceTime > 200) {
    selectedLed = (selectedLed + 1) % 5;
    Serial.print("[LED] Selected LED: ");
    Serial.println(selectedLed + 1);
    lastDebounceTime = millis();
  }
  lastButtonState = currentButton;
}

void updateLedBrightness() {
  int brightness = analogRead(potPin) / 4;
  for (int i = 0; i < 5; i++) analogWrite(ledPins[i], i == selectedLed ? brightness : 0);
}

long readDistanceCM() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  long duration = pulseIn(echoPin, HIGH);
  return duration * 0.034 / 2;
}

void playMelody() {
  if (melodyIndex >= melodyLength) {
    melodyIndex = 0;
    isPlaying = false;
    return;
  }

  char note = melody[melodyIndex];
  if (note != ' ') {
    Serial.print("[NOTE] Playing: "); Serial.println(note);
    performServoAction(note);
    setLEDForNote(note, true);
    playTone(note);
    delay(1000);
    setLEDForNote(note, false);
    noTone(buzzerPin);
  }
  melodyIndex++;

  if (!isPlaying || isLocked) {
    isPlaying = false;
  }
}

void playTone(char note) {
  int freq = 0;
  switch (note) {
    case 'C': freq = 262; break;
    case 'D': freq = 294; break;
    case 'E': freq = 330; break;
    case 'F': freq = 349; break;
    case 'G': freq = 392; break;
    case '0': freq = 0; break;
  }
  if (freq > 0) tone(buzzerPin, freq);
}

void performServoAction(char note) {
  switch (note) {
    case 'C': servo.write(0); break;
    case 'D': servo.write(0); break;
    case 'E': servo.write(180); break;
    case 'F': servo.write(180); break;
    case 'G':
    case '0':
      servo.write(180);
      delay(250);
      servo.write(0);
      delay(250);
      break;
  }
}

void setLEDForNote(char note, bool on) {
  int idx = 0;
  switch (note) {
    case 'C': idx = 0; break;
    case 'D': idx = 1; break;
    case 'E': idx = 2; break;
    case 'F': idx = 3; break;
    case 'G': idx = 4; break;
    default: return;
  }
  digitalWrite(ledPins[idx], on ? HIGH : LOW);
}

void stopPlayback() {
  isPlaying = false;
  melodyIndex = 0;
  noTone(buzzerPin);
  servo.write(90);
  for (int i = 0; i < 5; i++) digitalWrite(ledPins[i], LOW);
  Serial.println("[STOP] Playback stopped.");
}
