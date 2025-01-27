const socket = io();
const username = localStorage.getItem("username");

if (!username) {
    window.location.href = "/login";
}

document.getElementById("message").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

function sendMessage() {
    const messageInput = document.getElementById("message");
    const messageText = messageInput.value.trim();

    if (messageText !== "") {
        const message = { username, text: messageText };
        socket.emit("newMessage", message);
        messageInput.value = "";
    }
}

// Load messages from server
socket.on("loadMessages", (messages) => {
    messages.forEach(displayMessage);
});

// Display new messages
socket.on("message", displayMessage);

function displayMessage(msg) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    messageDiv.innerHTML = `<strong>${msg.username}:</strong> ${msg.text}`;
    document.getElementById("messages").appendChild(messageDiv);
}
