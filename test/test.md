# 🌋 v2_Terra Apocalypsis

An interactive 3D terrain simulation visualized via `p5.js` and controlled in real-time using Arduino input over the Web Serial API.

---

## 🧠 Features

- 🌊 **Tsunami Mode** – smooth wave-like undulations
- 🌍 **Earthquake Mode** – chaotic terrain shake
- 🔥 **Firestorm Mode** – central pulsing flicker
- 🎛️ Real-time control via Arduino (potentiometer + button)
- 📟 On-screen debug panel: shows FPS, mode, amplitude, and serial input
- 💖 Soft pink cyberpunk-style UI

---

## 🕹️ How to Use

1. Upload the Arduino sketch (`v2_terra_apocalypsis.ino`) to your Arduino UNO
2. Open `v2_terra_apocalypsis_complete.html` in a [Web Serial-supported browser](https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API) (Chrome recommended)
3. Click **🔌 Connect Arduino**
4. Adjust the **potentiometer** and press the **button** to control terrain in real time

---

## 🔌 Arduino Setup

- **Potentiometer** to `A0`
- **Button** to `D2` (configured as `INPUT_PULLUP`)

### Output Format:
```
A:<amplitude_value>,M:<mode_value>
```

### Example:
```
A:512,M:2
```

- `A`: Analog value from potentiometer (0–1023), mapped to amplitude
- `M`: Mode (0 = tsunami, 1 = earthquake, 2 = firestorm)

---

## 💾 Arduino Code (`v2_terra_apocalypsis.ino`)
```cpp
const int potPin = A0;
const int buttonPin = 2;

int mode = 0;
int lastButtonState = HIGH;
unsigned long lastDebounceTime = 0;
const unsigned long debounceDelay = 50;

void setup() {
  pinMode(buttonPin, INPUT_PULLUP);
  Serial.begin(9600);
}

void loop() {
  int amp = analogRead(potPin);

  int reading = digitalRead(buttonPin);
  if (reading == LOW && lastButtonState == HIGH && (millis() - lastDebounceTime) > debounceDelay) {
    mode = (mode + 1) % 3;
    lastDebounceTime = millis();
  }
  lastButtonState = reading;

  Serial.print("A:");
  Serial.print(amp);
  Serial.print(",M:");
  Serial.println(mode);

  delay(30);
}
```

---

## 🧪 Debug Tips

| Issue | Possible Cause | Solution |
|-------|----------------|----------|
| ❌ No connection | Browser doesn’t support Web Serial | Use Chrome |
| ❌ No response | Serial format mismatch | Ensure output is like `A:xxx,M:x` |
| ❌ No visual change | Data parsed incorrectly | Check `handleSerialInput()` in p5.js |
| ✅ Want to trace | Use `console.log()` in `draw()` | Log `rawAmp`, `rawMode` |

---

## 📁 Files

- `v2_terra_apocalypsis_complete.html` – Main visual + Web Serial
- `v2_terra_apocalypsis.ino` – Arduino sketch
