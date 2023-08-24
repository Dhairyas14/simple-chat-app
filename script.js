const socket = io(); // Connect to the socket.io server

// DOM elements
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const chatBox = document.querySelector('.chat-box');

let replacements = []; // Array to store replacements

// Fetch the replacements from the JSON file
fetch('replacements.json')
    .then(response => response.json())
    .then(data => {
        replacements = data.replacements;
    })
    .catch(error => console.error('Error fetching replacements:', error));

// Replace function with dynamic replacements
function replaceWordsWithReplacements(message) {
    for (const replacement of replacements) {
        const regex = new RegExp(replacement.from, 'gi');
        message = message.replace(regex, replacement.to);
    }
    return message;
}

// Send message
sendButton.addEventListener('click', () => {
    let message = messageInput.value.trim();
    
    // Apply dynamic replacements
    message = replaceWordsWithReplacements(message);
    
    if (message !== '') {
        socket.emit('message', message);
        messageInput.value = '';
    }
});

// Receive message
socket.on('message', (data) => {
    const { message } = data;
    appendMessage(message);
});

// Append a new message to the chat box
function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
}