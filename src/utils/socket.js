const socket = require("socket.io");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: [
        "https://gittogetherbuddies.onrender.com",
        "http://localhost:5173",
      ],
    },
  });

  io.on("connection", (socket) => {
    //   Handle events
    socket.on("joinChat", ({ userId, targetUserId }) => {
      const roomId = [userId, targetUserId].sort().join("_");
    //   console.log("Joining Roon: ", roomId);
      socket.join(roomId);
    });
    socket.on("sendMessage", ({ firstName, userId, targetUserId, text }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      io.to(roomId).emit("messageReceived", { firstName, text });
    //   console.log(firstName + " " + text);
    });
    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
