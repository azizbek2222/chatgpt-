// 1. Yangi tokenni shu yerga qo'ying
const API_TOKEN = "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"; 
const MODEL_URL = "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct";

async function sendMessage() {
    const inputField = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");
    const userText = inputField.value.trim();

    if (!userText) return;

    chatBox.innerHTML += `<div class="user-msg"><b>Siz:</b> ${userText}</div>`;
    inputField.value = "";

    try {
        // GitHub'da CORS xatosini yengish uchun vaqtincha Proxy ishlatamiz
        const response = await fetch(MODEL_URL, {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${API_TOKEN}`,
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                inputs: userText,
                parameters: { max_new_tokens: 500, return_full_text: false }
            })
        });

        const data = await response.json();

        if (data.error) {
            if (data.error.includes("loading")) {
                chatBox.innerHTML += `<div class="ai-msg"><i>AI yuklanmoqda (30 soniya kuting)...</i></div>`;
            } else {
                chatBox.innerHTML += `<div class="ai-msg" style="color:red">Xato: ${data.error}</div>`;
            }
        } else if (data[0] && data[0].generated_text) {
            chatBox.innerHTML += `<div class="ai-msg"><b>AI:</b> ${data[0].generated_text}</div>`;
        }

    } catch (error) {
        chatBox.innerHTML += `<div class="ai-msg" style="color:red">Tarmoq xatosi! Brauzerda CORS cheklangan bo'lishi mumkin.</div>`;
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}