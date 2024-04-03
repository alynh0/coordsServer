const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Array com os jogadores e suas posições
const players = {};

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
  console.log("Novo usuário conectado");

  // Log do ID do socket
  console.log(socket.id);
  // Log dos jogadores conectados e suas posições
  console.log(players);

  // Evento de movimento
  socket.on("move", (data) => {
    const { x, y } = data;

    // Atualiza a posição do jogador
    players[socket.id] = { x, y };

    // Envia as novas posições para todos os clientes
    io.emit("update", players);
    console.log(players);
  });

  // Evento de desconexão
  socket.on("disconnect", () => {
    console.log("Usuário desconectado");
    // Remove o jogador desconectado
    delete players[socket.id];
    // Envia as novas posições para todos os clientes
    io.emit("update", players);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
