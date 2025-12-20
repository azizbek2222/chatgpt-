const MODEL_URL = "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct";

// Tokenni olish
let API_TOKEN = localStorage.getItem("hf_token");

if (!API_TOKEN) {
    API_TOKEN = prompt("Hugging Face Tokeningizni kiriting:");
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

        // Agar javob kelsa-yu, lekin xato bo'lsa (masalan 401 yoki 403)
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Server xatosi: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data) && data[0].generated_text) {
            chatBox.innerHTML += `<div class="ai-msg"><b>AI:</b> ${data[0].generated_text}</div>`;
        } else if (data.error && data.error.includes("loading")) {
            chatBox.innerHTML += `<div class="ai-msg"><i>AI yuklanmoqda... 20 soniya kutib qayta yuboring.</i></div>`;
        } else {
            chatBox.innerHTML += `<div class="ai-msg">Kutilmagan javob formati.</div>`;
        }

    } catch (error) {
        console.error("Xatolik:", error);
        chatBox.innerHTML += `<div class="ai-msg" style="color:red">Xatolik: ${error.message}</div>`;
        
        // Agar token noto'g'ri bo'lsa, xotirani tozalash
        if (error.message.includes("401") || error.message.includes("token")) {
            localStorage.removeItem("hf_token");
        }
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}
