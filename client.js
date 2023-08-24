document.addEventListener('DOMContentLoaded', () => {
  const socket = io(); // Connect to the Socket.IO server
  const messageContainer = document.querySelector('.message-container');
  const messageInput = document.querySelector('.message-input');
  const sendButton = document.querySelector('.send-button');

  socket.on('message', (data) => {
    const message = document.createElement('div');
    message.className = 'message' + (data.isSender ? ' sender' : '');
    message.textContent = data.message;
    messageContainer.appendChild(message);
  });

  sendButton.addEventListener('click', () => {
    const messageText = messageInput.value.trim();
    
    if (messageText) {
      socket.emit('message', { message: messageText, isSender: true });
      messageInput.value = '';
    }
  });
});