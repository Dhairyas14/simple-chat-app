const socket = io(); // Connect to the socket.io server

// DOM elements
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const chatBox = document.querySelector('.chat-box');
const addUserModal = document.getElementById('addUserModal'); // Get the modal element
const usernameInput = document.getElementById('usernameInput'); // Get the username input element
const submitUsernameButton = document.getElementById('submitUsernameButton'); // Get the submit button element
const contactList = document.querySelector('.contact-list'); // Get the contact list element

let username = ''; // Store the entered username

// Show the username input modal on page load
window.onload = () => {
    showUsernameInputPopup(); // Automatically show the modal
};

// Show the username input modal
function showUsernameInputPopup() {
    addUserModal.style.display = 'flex';
}

// Hide the username input modal and emit a new user event
submitUsernameButton.addEventListener('click', () => {
    username = usernameInput.value.trim();
    if (username !== '') {
        // Emit a new user event to notify other clients
        socket.emit('newUser', username);

        // ...

        addUserModal.style.display = 'none';
        usernameInput.value = '';
    }
});

// Handle new user event from server
socket.on('newUser', (username) => {
    // Add the new user to the contact list
    const newUser = document.createElement('li');
    newUser.textContent = username;
    newUser.classList.add('contact');
    contactList.appendChild(newUser);
});

// Rest of your existing code for sending and receiving messages


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
        // Check if the message is the /help command
        if (message === '/help') {
            // Show the help pop-up
            showHelpPopup();
        } else {
            socket.emit('message', message);
        }
        messageInput.value = '';
    }
});


// Show the help pop-up
function showHelpPopup() {
    const helpPopup = document.getElementById('helpPopup');
    helpPopup.style.display = 'flex';
}

// Close the help pop-up
document.getElementById('closeHelpButton').addEventListener('click', () => {
    const helpPopup = document.getElementById('helpPopup');
    helpPopup.style.display = 'none';
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