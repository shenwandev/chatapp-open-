// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const messages = [];

io.on('connection', (socket) => {
  console.log('New connection:', socket.id);

  // 新しいメッセージを受信したときの処理
  socket.on('newMessage', (data) => {
    const message = {
      id: socket.id,
      content: data.content,
      timestamp: Date.now()
    };
    messages.push(message);
    io.emit('message', message); // すべてのクライアントにメッセージを送信
  });

  // クライアントが接続した際に過去のメッセージを送信
  socket.emit('history', messages);

  // クライアントが接続を閉じたときの処理
  socket.on('disconnect', () => {
    console.log('Disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;

// 静的ファイルの提供
app.use(express.static('public'));

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
