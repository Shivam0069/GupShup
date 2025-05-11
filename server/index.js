import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import dotenv from "dotenv";
import AuthRoutes from "./routes/AuthRoutes.js";
import MessageRoutes from "./routes/MessageRoutes.js";
import Actions from "./utils/Actions.js";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads/images", express.static("uploads/images"));
app.use("/uploads/recordings", express.static("uploads/recordings"));

app.use("/api/auth", AuthRoutes);
app.use("/api/messages", MessageRoutes);

const server = app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;

  socket.on(Actions.ADD_USER, (userId) => {
    console.log("User connected:", userId, socket.id);
    onlineUsers.set(userId, socket.id);
    io.emit(Actions.ONLINE_USERS, {
      onlineUsers: Array.from(onlineUsers.keys()),
    });
  });

  socket.on(Actions.SEND_MSG, (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit(Actions.MSG_RECEIVE, {
        from: data.from,
        message: data.message,
      });
    }
  });

  socket.on(Actions.OUTGOING_VOICE_CALL, (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit(Actions.INCOMING_VOICE_CALL, {
        from: data.from,
        callType: data.callType,
        roomId: data.roomId,
      });
    }
  });

  socket.on(Actions.OUTGOING_VIDEO_CALL, (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit(Actions.INCOMING_VIDEO_CALL, {
        from: data.from,
        callType: data.callType,
        roomId: data.roomId,
      });
    }
  });

  socket.on(Actions.REJECT_CALL, (data) => {
    const sendUserSocket = onlineUsers.get(data.from);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit(Actions.CALL_REJECTED);
    }
  });

  socket.on(Actions.ACCEPT_INCOMING_CALL, ({ id }) => {
    const sendUserSocket = onlineUsers.get(id);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit(Actions.CALL_ACCEPTED);
    }
  });

  socket.on(Actions.DISCONNECT, () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log("User disconnected:", userId, socket.id);
        break;
      }
    }
    io.emit(Actions.ONLINE_USERS, {
      onlineUsers: Array.from(onlineUsers.keys()),
    });
  });
});
