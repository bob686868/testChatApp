// In development (localhost), connects to the same origin.
// In production on AWS Amplify, set your EC2 backend URL (e.g. 'https://api.yourdomain.com' or 'http://<ec2-ip>:3000')
const BACKEND_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? undefined
  : (window.BACKEND_URL || 'https://18.227.21.147/');

const socket = io(BACKEND_URL);

let username = prompt('Enter your name:') || 'Anonymous';
let currentRoom = 'general';

const messagesContainer = document.getElementById('messagesContainer');
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const roomInput = document.getElementById('roomInput');
const joinRoomBtn = document.getElementById('joinRoomBtn');
const roomNameDisplay = document.getElementById('roomName');

// 1. Join / Switch Room Function
function joinRoom(newRoom) {
  if (!newRoom) return;

  // Leave old room and join new room
  socket.emit('join_room', { room: newRoom, oldRoom: currentRoom, username });

  currentRoom = newRoom;
  roomNameDisplay.textContent = `Room: ${currentRoom}`;
  messagesContainer.innerHTML = ''; // Clear for newly joined room
}

// Initial join to default room
joinRoom(currentRoom);

// Button click to join a custom room
joinRoomBtn.addEventListener('click', () => {
  const newRoom = roomInput.value.trim().toLowerCase();
  if (newRoom && newRoom !== currentRoom) {
    joinRoom(newRoom);
  }
});

// 2. Load DB History for current room
socket.on('load_history', (messages) => {
  messagesContainer.innerHTML = '';
  messages.forEach(renderMessage);
});

// 3. Receive real-time message for current room
socket.on('receive_message', (msg) => {
  if (msg.room === currentRoom) {
    renderMessage(msg);
  }
});

// 4. Send message to current room
messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const content = messageInput.value.trim();
  if (!content) return;

  // Emitting to the current room
  socket.emit('send_message', { room: currentRoom, sender: username, content });
  messageInput.value = '';
});

// Helper: Append message
function renderMessage(msg) {
  const div = document.createElement('div');
  div.className = `msg ${msg.sender === username ? 'self' : ''}`;
  div.innerHTML = `
    <div class="msg-sender">${msg.sender}</div>
    <div class="msg-content">${msg.content}</div>
  `;
  messagesContainer.appendChild(div);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
