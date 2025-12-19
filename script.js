// 1. Token va URL ni eng tepaga qo'yamiz
const API_TOKEN = "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"; 
const API_URL = "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct";

// 2. Keyin funksiyani yozamiz
async function sendMessage() {
    const inputField = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");
    const userText = inputField.value;

    if (!userText) return;

    // Foydalanuvchi xabarini ko'rsatish
    chatBox.innerHTML += `<div class="user-msg"><b>Siz:</b> ${userText}</div>`;
    inputField.value = "";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${API_TOKEN}`,
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                inputs: userText,
                parameters: { 
                    max_new_tokens: 500,
                    return_full_text: false 
                }
            })
        });

        const data = await response.json();

        if (data.error && data.error.includes("loading")) {
            chatBox.innerHTML += `<p style="color:orange"><i>AI uyg'onmoqda... (${Math.round(data.estimated_time)} soniya kuting)</i></p>`;
        } else if (data[0] && data[0].generated_text) {
            let aiText = data[0].generated_text;
            chatBox.innerHTML += `<div class="ai-msg"><b>AI:</b> ${aiText}</div>`;
        } else {
            chatBox.innerHTML += `<p style="color:red">Xatolik: ${data.error || "Noma'lum xato"}</p>`;
        }

        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
        console.error("Xatolik:", error);
        chatBox.innerHTML += `<p style="color:red">Tarmoq xatosi yuz berdi!</p>`;
    }
}
