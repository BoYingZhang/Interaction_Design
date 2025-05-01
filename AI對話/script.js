// 請在這裡填入您的 Google AI API 金鑰
let API_KEY = '';

// 當頁面載入時，檢查是否有已儲存的 API 金鑰
window.onload = function() {
    const savedApiKey = localStorage.getItem('apiKey');
    if (savedApiKey) {
        document.getElementById('apiKeyInput').value = savedApiKey;
        API_KEY = savedApiKey;
    }
}

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

let chatContainer = document.getElementById('chatContainer');
let userInput = document.getElementById('userInput');

// 監聽 Enter 鍵
userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function addMessage(message, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    messageDiv.textContent = message;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // 顯示使用者訊息
    addMessage(message, true);
    userInput.value = '';

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: message }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error('API 請求失敗');
        }

        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;
        
        // 顯示 AI 回應
        addMessage(aiResponse, false);
    } catch (error) {
        console.error('錯誤:', error);
        addMessage('抱歉，發生錯誤。請稍後再試。', false);
    }
}
