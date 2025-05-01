// API 設定
let API_KEY = '';

// 載入已儲存的 API 金鑰
window.onload = function() {
    const savedApiKey = localStorage.getItem('apiKey');
    if (savedApiKey) {
        document.getElementById('apiKeyInput').value = savedApiKey;
        API_KEY = savedApiKey;
    }
};

// 儲存 API 金鑰
function saveApiKey() {
    const apiKeyInput = document.getElementById('apiKeyInput');
    const newApiKey = apiKeyInput.value.trim();
    if (newApiKey) {
        API_KEY = newApiKey;
        localStorage.setItem('apiKey', newApiKey);
        alert('API 金鑰已儲存！');
    } else {
        alert('請輸入有效的 API 金鑰！');
    }
}

// 遊戲狀態
let gameActive = false;
let timeLeft = 30;
let timerId = null;
let bossEntities = [];
let player = {
    x: 50,
    y: 50,
    speed: 5
};

// 取得遊戲元素
const gameContainer = document.getElementById('gameContainer');
const playerElement = document.getElementById('player');
const timerElement = document.getElementById('timer');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOver');
const gameOverText = document.getElementById('gameOverText');
const exit = document.getElementById('exit');

// 按鍵狀態
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

// 遊戲設定
const CONTAINER_WIDTH = 1280;  // 16:9 的標準寬度
const CONTAINER_HEIGHT = 720;   // 16:9 的標準高度
const BOSS_COUNT = 7;  // 增加主管數量
const OBSTACLE_COUNT = 12;  // 增加障礙物數量

// 初始化遊戲
function initGame() {
    // 初始化玩家位置
    player.x = 50;
    player.y = 50;
    updatePlayerPosition();
    
    // 清除現有的主管
    bossEntities.forEach(boss => boss.element.remove());
    bossEntities = [];
    
    // 生成主管
    for (let i = 0; i < BOSS_COUNT; i++) {
        createBoss();
    }
    
    // 生成障礙物
    createObstacles();
    
    // 重置計時器
    timeLeft = 30;
    timerElement.textContent = timeLeft;
}

// 創建主管
function createBoss() {
    const boss = document.createElement('div');
    boss.className = 'boss';
    boss.innerHTML = '👀';
    gameContainer.appendChild(boss);
    
    const bossData = {
        element: boss,
        x: Math.random() * (CONTAINER_WIDTH - 30),
        y: Math.random() * (CONTAINER_HEIGHT - 30),
        speedX: (Math.random() - 0.5) * 4,
        speedY: (Math.random() - 0.5) * 4
    };
    
    bossEntities.push(bossData);
    updateBossPosition(bossData);
}

// 創建障礙物
function createObstacles() {
    const existingObstacles = document.querySelectorAll('.obstacle');
    existingObstacles.forEach(obstacle => obstacle.remove());
    
    for (let i = 0; i < OBSTACLE_COUNT; i++) {
        const obstacle = document.createElement('div');
        obstacle.className = 'obstacle';
        
        const width = Math.random() * 100 + 50;
        const height = Math.random() * 100 + 50;
        const x = Math.random() * (CONTAINER_WIDTH - width);
        const y = Math.random() * (CONTAINER_HEIGHT - height);
        
        obstacle.style.width = width + 'px';
        obstacle.style.height = height + 'px';
        obstacle.style.left = x + 'px';
        obstacle.style.top = y + 'px';
        
        gameContainer.appendChild(obstacle);
    }
}

// 更新玩家位置
function updatePlayerPosition() {
    playerElement.style.left = player.x + 'px';
    playerElement.style.top = player.y + 'px';
}

// 更新主管位置
function updateBossPosition(boss) {
    boss.element.style.left = boss.x + 'px';
    boss.element.style.top = boss.y + 'px';
}

// 更新主管移動
async function updateBosses() {
    for (const boss of bossEntities) {
        try {
            const prompt = `
你是遊戲中的主管AI，需要抓住逃跑的員工。
主管位置：(${boss.x}, ${boss.y})
玩家位置：(${player.x}, ${player.y})
遊戲區域：寬${CONTAINER_WIDTH}px, 高${CONTAINER_HEIGHT}px
請只回答一個移動方向："up", "down", "left", "right" 或 "stay"
`;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            });

            const data = await response.json();
            const direction = data.candidates[0].content.parts[0].text.trim().toLowerCase();

            // 根據 AI 決策移動
            const speed = 4;
            switch (direction) {
                case 'up':
                    boss.y = Math.max(0, boss.y - speed);
                    break;
                case 'down':
                    boss.y = Math.min(CONTAINER_HEIGHT - 30, boss.y + speed);
                    break;
                case 'left':
                    boss.x = Math.max(0, boss.x - speed);
                    break;
                case 'right':
                    boss.x = Math.min(CONTAINER_WIDTH - 30, boss.x + speed);
                    break;
            }
        } catch (error) {
            console.error('AI 移動錯誤：', error);
            // 發生錯誤時使用簡單的追蹤邏輯
            if (player.x > boss.x) boss.x += 2;
            if (player.x < boss.x) boss.x -= 2;
            if (player.y > boss.y) boss.y += 2;
            if (player.y < boss.y) boss.y -= 2;
        }
        
        updateBossPosition(boss);
        
        // 檢查是否撞到玩家
        if (checkCollision(player.x, player.y, 40, 40, boss.x, boss.y, 30, 30)) {
            endGame('被抓到了！要上台報告了...');
            return;
        }
    }
}

// 碰撞檢測
function checkCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 &&
           x1 + w1 > x2 &&
           y1 < y2 + h2 &&
           y1 + h1 > y2;
}

// 開始遊戲
function startGame() {
    gameActive = true;
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    
    initGame();
    
    // 開始計時
    timerId = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endGame('時間到！被困在會議室了...');
        }
    }, 1000);
    
    // 開始遊戲循環
    gameLoop();
}

// 結束遊戲
function endGame(message) {
    gameActive = false;
    clearInterval(timerId);
    gameOverText.textContent = message;
    gameOverScreen.style.display = 'flex';
}

// 遊戲主循環
function gameLoop() {
    if (!gameActive) return;
    
    // 更新玩家位置
    if (keys.ArrowUp) player.y = Math.max(0, player.y - player.speed);
    if (keys.ArrowDown) player.y = Math.min(CONTAINER_HEIGHT - 40, player.y + player.speed);
    if (keys.ArrowLeft) player.x = Math.max(0, player.x - player.speed);
    if (keys.ArrowRight) player.x = Math.min(CONTAINER_WIDTH - 40, player.x + player.speed);
    
    updatePlayerPosition();
    
    // 更新主管位置
    updateBosses();
    
    // 檢查是否到達出口
    if (checkCollision(player.x, player.y, 40, 40, 
                      CONTAINER_WIDTH - 80, CONTAINER_HEIGHT - 80, 60, 60)) {
        endGame('成功逃出！');
        return;
    }
    
    requestAnimationFrame(gameLoop);
}

// 事件監聽
document.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.code)) {
        keys[e.code] = true;
        e.preventDefault();
    }
});

document.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.code)) {
        keys[e.code] = false;
    }
});

// 點擊開始按鈕
document.getElementById('startButton').addEventListener('click', startGame);

// 點擊重新開始
gameOverScreen.addEventListener('click', startGame);
