// API 設定
let API_KEY = '';
let hasEscaped = false;

// 遊戲常數
const CONTAINER_WIDTH = 800;
const CONTAINER_HEIGHT = 600;
const BOSS_COUNT = 3;         // 減少主管數量
const OBSTACLE_COUNT = 6;      // 減少障礙物數量
const PLAYER_SPEED = 7;        // 增加玩家速度
const BOSS_SPEED = 2;         // 降低主管速度
const SAFE_SPAWN_DISTANCE = 250;  // 增加安全距離
const PLAYER_SIZE = 35;
const BOSS_SIZE = 25;

// 遊戲狀態
let gameActive = false;
let timeLeft = 15;
let timerId = null;
let bossEntities = [];
let obstacles = [];
let player = {
    x: 50,
    y: 50,
    speed: PLAYER_SPEED,
    size: PLAYER_SIZE
};

// 按鍵狀態
const keys = {
    "ArrowUp": false,
    "ArrowDown": false,
    "ArrowLeft": false,
    "ArrowRight": false
};

// 按鍵對應
const KEY_MAPPING = {
    "ArrowUp": "ArrowUp",
    "ArrowDown": "ArrowDown",
    "ArrowLeft": "ArrowLeft",
    "ArrowRight": "ArrowRight"
};

// API 金鑰管理
window.onload = function() {
    const savedApiKey = localStorage.getItem('apiKey');
    if (savedApiKey) {
        document.getElementById('apiKeyInput').value = savedApiKey;
        API_KEY = savedApiKey;
    }
};

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

// 初始化遊戲
function initGame() {
    hasEscaped = false;
    player.x = 50;
    player.y = 50;
    updatePlayerPosition();
    
    bossEntities.forEach(boss => boss.element.remove());
    bossEntities = [];
    
    createObstacles();
    
    for (let i = 0; i < BOSS_COUNT; i++) {
        createBoss();
    }
    
    timeLeft = 15;
    timerElement.textContent = timeLeft;
}

// 創建障礙物
function createObstacles() {
    obstacles = [];
    const existingObstacles = document.querySelectorAll('.obstacle');
    existingObstacles.forEach(obstacle => obstacle.remove());
    
    for (let i = 0; i < OBSTACLE_COUNT; i++) {
        const width = Math.random() * 100 + 50;
        const height = Math.random() * 100 + 50;
        let x, y;
        let validPosition = false;
        
        do {
            x = Math.random() * (CONTAINER_WIDTH - width);
            y = Math.random() * (CONTAINER_HEIGHT - height);
            
            // 檢查是否離玩家起點太近
            const distanceToStart = Math.sqrt(Math.pow(x - 50, 2) + Math.pow(y - 50, 2));
            // 檢查是否離終點太近
            const distanceToEnd = Math.sqrt(
                Math.pow(x - (CONTAINER_WIDTH - 80), 2) + 
                Math.pow(y - (CONTAINER_HEIGHT - 80), 2)
            );
            
            validPosition = distanceToStart > 100 && distanceToEnd > 100;
        } while (!validPosition);
        
        const obstacle = document.createElement('div');
        obstacle.className = 'obstacle';
        obstacle.style.width = width + 'px';
        obstacle.style.height = height + 'px';
        obstacle.style.left = x + 'px';
        obstacle.style.top = y + 'px';
        
        gameContainer.appendChild(obstacle);
        
        obstacles.push({
            x: x,
            y: y,
            width: width,
            height: height,
            element: obstacle
        });
    }
}

// 創建主管
function createBoss() {
    const boss = document.createElement('div');
    boss.className = 'boss';
    boss.innerHTML = '👀';
    
    let x, y;
    let validPosition = false;
    
    do {
        x = Math.random() * (CONTAINER_WIDTH - BOSS_SIZE);
        y = Math.random() * (CONTAINER_HEIGHT - BOSS_SIZE);
        
        // 檢查與玩家的距離
        const distanceToPlayer = Math.sqrt(
            Math.pow(x - player.x, 2) + Math.pow(y - player.y, 2)
        );
        
        validPosition = distanceToPlayer >= SAFE_SPAWN_DISTANCE;
    } while (!validPosition);
    
    gameContainer.appendChild(boss);
    
    const bossData = {
        element: boss,
        x: x,
        y: y,
        speed: BOSS_SPEED
    };
    
    bossEntities.push(bossData);
    updateBossPosition(bossData);
}

// 更新位置
function updatePlayerPosition() {
    playerElement.style.left = player.x + 'px';
    playerElement.style.top = player.y + 'px';
}

function updateBossPosition(boss) {
    boss.element.style.left = boss.x + 'px';
    boss.element.style.top = boss.y + 'px';
}

// 碰撞檢測
function checkCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 &&
           x1 + w1 > x2 &&
           y1 < y2 + h2 &&
           y1 + h1 > y2;
}

function checkObstacleCollision(x, y, width, height) {
    for (const obstacle of obstacles) {
        if (checkCollision(x, y, width, height,
                         obstacle.x, obstacle.y,
                         obstacle.width, obstacle.height)) {
            return true;
        }
    }
    return false;
}

// 主管 AI 移動
async function updateBosses() {
    if (!gameActive || hasEscaped) return;

    for (const boss of bossEntities) {
        try {
            const prompt = `
你是遊戲中的主管AI，需要抓住逃跑的員工。
主管位置：(${boss.x}, ${boss.y})
玩家位置：(${player.x}, ${player.y})
遊戲區域：寬${CONTAINER_WIDTH}px, 高${CONTAINER_HEIGHT}px
請只回答一個移動方向："up", "down", "left", "right" 或 "stay"
`;

            if (!API_KEY) {
                throw new Error('需要設定 API 金鑰');
            }

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{ text: prompt }]
                        }]
                    })
                }
            );

            if (!response.ok) {
                throw new Error('API 請求失敗');
            }

            const data = await response.json();
            const direction = data.candidates[0].content.parts[0].text.trim().toLowerCase();

            let newX = boss.x;
            let newY = boss.y;

            // 根據 AI 決策移動
            switch (direction) {
                case 'up':
                    newY = Math.max(0, boss.y - boss.speed);
                    break;
                case 'down':
                    newY = Math.min(CONTAINER_HEIGHT - BOSS_SIZE, boss.y + boss.speed);
                    break;
                case 'left':
                    newX = Math.max(0, boss.x - boss.speed);
                    break;
                case 'right':
                    newX = Math.min(CONTAINER_WIDTH - BOSS_SIZE, boss.x + boss.speed);
                    break;
            }

            // 檢查新位置是否會碰到障礙物
            if (!checkObstacleCollision(newX, newY, BOSS_SIZE, BOSS_SIZE)) {
                boss.x = newX;
                boss.y = newY;
            } else {
                // 碰到障礙物後暫停移動 1 秒
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

        } catch (error) {
            console.error('AI 移動錯誤：', error);
            // 使用更笨拙的追蹤邏輯
            const dx = player.x - boss.x;
            const dy = player.y - boss.y;
            const angle = Math.atan2(dy, dx);
            
            // 有 30% 機率走錯方向
            const randomOffset = Math.random() < 0.3 ? Math.PI / 2 : 0;
            const finalAngle = angle + randomOffset;
            
            const newX = boss.x + Math.cos(finalAngle) * boss.speed;
            const newY = boss.y + Math.sin(finalAngle) * boss.speed;
            
            if (!checkObstacleCollision(newX, newY, BOSS_SIZE, BOSS_SIZE)) {
                boss.x = Math.max(0, Math.min(CONTAINER_WIDTH - BOSS_SIZE, newX));
                boss.y = Math.max(0, Math.min(CONTAINER_HEIGHT - BOSS_SIZE, newY));
            }
        }
        
        updateBossPosition(boss);
        
        // 使用更寬鬆的碰撞檢測（縮小判定範圍）
        const hitboxSize = BOSS_SIZE - 5;
        if (checkCollision(player.x + 5, player.y + 5, PLAYER_SIZE - 10, PLAYER_SIZE - 10,
                          boss.x + 5, boss.y + 5, hitboxSize, hitboxSize)) {
            endGame('被抓到了！要上台報告了...😱');
            return;
        }
    }
}

// 遊戲循環
function gameLoop() {
    if (!gameActive) return;
    
    // 計算新位置
    let newX = player.x;
    let newY = player.y;
    
    if (keys.ArrowUp) newY = Math.max(0, player.y - player.speed);
    if (keys.ArrowDown) newY = Math.min(CONTAINER_HEIGHT - player.size, player.y + player.speed);
    if (keys.ArrowLeft) newX = Math.max(0, player.x - player.speed);
    if (keys.ArrowRight) newX = Math.min(CONTAINER_WIDTH - player.size, player.x + player.speed);
    
    // 檢查新位置是否會碰到障礙物
    if (!checkObstacleCollision(newX, newY, player.size, player.size)) {
        player.x = newX;
        player.y = newY;
        updatePlayerPosition();
    }
    
    // 檢查是否到達出口
    if (checkCollision(player.x, player.y, player.size, player.size,
                      CONTAINER_WIDTH - 80, CONTAINER_HEIGHT - 80, 60, 60)) {
        hasEscaped = true;
        endGame('成功逃出！🎉');
        return;
    }
    
    updateBosses();
    requestAnimationFrame(gameLoop);
}

// 遊戲流程控制
function startGame() {
    if (!API_KEY) {
        alert('請先設定 API 金鑰！');
        return;
    }
    
    gameActive = true;
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    
    initGame();
    
    timerId = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endGame('時間到！被困在會議室了...😅');
        }
    }, 1000);
    
    gameLoop();
}

function endGame(message) {
    gameActive = false;
    clearInterval(timerId);
    gameOverText.textContent = message;
    gameOverScreen.style.display = 'flex';
}

// DOM 元素
const gameContainer = document.getElementById('gameContainer');
const playerElement = document.getElementById('player');
const timerElement = document.getElementById('timer');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOver');
const gameOverText = document.getElementById('gameOverText');

// 事件監聽
document.addEventListener('keydown', (e) => {
    const key = KEY_MAPPING[e.key];
    if (key && keys.hasOwnProperty(key)) {
        keys[key] = true;
        e.preventDefault();
    }
});

document.addEventListener('keyup', (e) => {
    const key = KEY_MAPPING[e.key];
    if (key && keys.hasOwnProperty(key)) {
        keys[key] = false;
    }
});

document.getElementById('startButton').addEventListener('click', startGame);
gameOverScreen.addEventListener('click', startGame);
