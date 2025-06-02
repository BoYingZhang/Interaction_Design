# 🌋 v2_Terra Apocalypsis

An interactive 3D terrain simulation visualized via `p5.js` and controlled in real-time using Arduino input over the Web Serial API. The terrain reacts to sensor data—specifically a potentiometer (for amplitude) and a button (for mode switching)—to render one of three apocalyptic scenes.

---

## 🧠 Features

- 🌊 **Tsunami Mode** – smooth wave-like undulations
- 🌍 **Earthquake Mode** – chaotic terrain shake
- 🔥 **Firestorm Mode** – central pulsing flicker
- 🎛️ Real-time control via Arduino input
- 📟 On-screen debug panel showing FPS, mode, amplitude, and incoming serial data
- 💖 Styled with a soft pink cyberpunk aesthetic

---

## 🕹️ How to Use

1. Upload the Arduino sketch from `v2_terra apocalypsis.ino`
2. Open `v2_terra apocalypsis.html` in a [Web Serial-supported browser](https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API) (Chrome recommended)
3. Click **🔌 Connect Arduino**
4. Adjust the potentiometer and press the button to see the terrain respond in real time

---

## 🔌 Arduino Setup

- **Potentiometer** connected to `A0`
- **Button** connected to `D2` (using `INPUT_PULLUP`)

### Output Format:
```
A:<amplitude_value>,M:<mode_value>
```

### Example:
```
A:512,M:2
```

- `A` = potentiometer value (0–1023)
- `M` = mode (0 = tsunami, 1 = earthquake, 2 = firestorm)

---

## 🧪 Debug Tips

| Issue | Possible Cause | Solution |
|-------|----------------|----------|
| ❌ No connection | Browser doesn’t support Web Serial | Use Chrome |
| ❌ No response | Serial format mismatch | Ensure output is like `A:xxx,M:x` |
| ❌ No visual change | Data parsed incorrectly | Check `handleSerialInput()` logic |
| ✅ Want to trace | Add `console.log()` in draw loop | For `latestSerialLine`, `amp`, `mod` |

---

## 📁 Files

- `v2_terra apocalypsis.html` – Main p5.js sketch with Web Serial logic
- `v2_terra apocalypsis.ino` – Arduino sketch for sensor input