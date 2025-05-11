let waves = [];
const numberOfWaves = 5;

function setup() {
    createCanvas(windowWidth, windowHeight);
    for (let i = 0; i < numberOfWaves; i++) {
        waves.push({
            amplitude: random(20, 50),
            period: random(100, 200),
            phase: random(TWO_PI),
            color: color(random(100, 255), random(100, 255), random(100, 255), 50)
        });
    }
}

function draw() {
    background(0, 10);
    noFill();
    
    translate(0, height / 2);
    
    waves.forEach((wave, index) => {
        stroke(wave.color);
        strokeWeight(2);
        
        beginShape();
        for (let x = 0; x < width; x += 10) {
            let y = wave.amplitude * sin(x / wave.period + wave.phase + frameCount * 0.02);
            vertex(x, y);
        }
        endShape();
        
        wave.phase += 0.01;
    });
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}