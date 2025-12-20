const MODEL_URL = "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct";

// Tokenni brauzer xotirasidan olamiz yoki so'raymiz
let API_TOKEN = localStorage.getItem("hf_token");

if (!API_TOKEN) {
    API_TOKEN = prompt("Hugging Face Tokeningizni kiriting (u faqat brauzeringizda saqlanadi):");
    if (API_TOKEN) {
        localStorage.setItem("hf_token", API_TOKEN);
    }
}

async function sendMessage() {
    const inputField = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");
    const userText = inputField.value.trim();

    if (!userText || !API_TOKEN) return;

    chatBox.innerHTML += `<div class="user-msg"><b>Siz:</b> ${userText}</div>`;
    inputField.value = "";

    try {
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
                chatBox.innerHTML += `<div class="ai-msg"><i>AI yuklanmoqda... Qayta yuboring.</i></div>`;
            } else {
                chatBox.innerHTML += `<div class="ai-msg" style="color:red">Xato: ${data.error}</div>`;
                // Agar token xato bo'lsa, uni o'chirib tashlaymiz
                localStorage.removeItem("hf_token");
            }
        } else if (data[0] && data[0].generated_text) {
            chatBox.innerHTML += `<div class="ai-msg"><b>AI:</b> ${data[0].generated_text}</div>`;
        }

    } catch (error) {
        chatBox.innerHTML += `<div class="ai-msg" style="color:red">Tarmoq xatosi!</div>`;
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}
