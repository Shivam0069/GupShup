import getPrismaInstance from "../utils/PrismaClient.js";
import { renameSync } from "fs";
import fs from "fs";

export const addMessage = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    const { message, from, to } = req.body;
    const getUser = onlineUsers.get(to);
    if (message && from && to) {
      const newMessage = await prisma.messages.create({
        data: {
          message,
          sender: { connect: { id: parseInt(from) } },
          receiver: { connect: { id: parseInt(to) } },
          messageStatus: getUser ? "delivered" : "sent",
        },
        include: {
          sender: true,
          receiver: true,
        },
      });

      return res.status(201).send({ message: newMessage });
    }
    return res.status(400).send("From , to and message is required");
  } catch (error) {
    next(error);
  }
};

export const getMessage = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    const { from, to } = req.params;
    const messages = await prisma.messages.findMany({
      where: {
        OR: [
          {
            senderId: parseInt(from),
            receiverId: parseInt(to),
          },
          {
            senderId: parseInt(to),
            receiverId: parseInt(from),
          },
        ],
      },
      orderBy: {
        id: "asc",
      },
    });
    const unreadMessages = [];
    messages.forEach((message, index) => {
      if (
        message.messageStatus !== "read" &&
        message.senderId === parseInt(to)
      ) {
        messages[index].messageStatus = "read";
        unreadMessages.push(message.id);
      }
    });

    await prisma.messages.updateMany({
      where: {
        id: { in: unreadMessages },
      },
      data: { messageStatus: "read" },
    });
    res.status(200).json({ messages });
  } catch (error) {
    next(error);
  }
};

export const addImageMessage = async (req, res, next) => {
  console.log("Image message route hit");
  try {
    if (req.file) {
      const date = Date.now();
      const uploadDir = "uploads/images";

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `${uploadDir}/${date}_${req.file.originalname}`;
      renameSync(req.file.path, fileName);

      const prisma = getPrismaInstance();
      const { from, to } = req.query;

      if (from && to) {
        const message = await prisma.messages.create({
          data: {
            message: fileName,
            type: "image",
            sender: { connect: { id: parseInt(from) } },
            receiver: { connect: { id: parseInt(to) } },
          },
        });
        return res.status(201).json({ message });
      }
      return res.status(400).send("From and to are required.");
    }
    return res.status(400).send("Image is required.");
  } catch (error) {
    next(error);
  }
};

export const addAudioMessage = async (req, res, next) => {
  try {
    if (req.file) {
      const date = Date.now();
      const uploadDir = "uploads/recordings";

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `${uploadDir}/${date}_${req.file.originalname}`;
      renameSync(req.file.path, fileName);

      const prisma = getPrismaInstance();
      const { from, to } = req.query;

      if (from && to) {
        const message = await prisma.messages.create({
          data: {
            message: fileName,
            type: "audio",
            sender: { connect: { id: parseInt(from) } },
            receiver: { connect: { id: parseInt(to) } },
          },
        });
        return res.status(201).json({ message });
      }
      return res.status(400).send("From and to are required.");
    }
    return res.status(400).send("Audio is required.");
  } catch (error) {
    next(error);
  }
};

export const getInitialContactsWithMessages = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    const userId = parseInt(req.params.from);
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        sentMessages: {
          include: {
            receiver: true,
            sender: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        receivedMessages: {
          include: {
            receiver: true,
            sender: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    const messages = [...user.sentMessages, ...user.receivedMessages].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    const users = new Map();
    const messageStatusChange = [];
    messages.forEach((msg) => {
      const isSender = msg.senderId === userId;
      const calculatedId = isSender ? msg.receiverId : msg.senderId;

      if (msg.messageStatus === "sent") {
        messageStatusChange.push(msg.id);
      }

      if (!users.has(calculatedId)) {
        const {
          id,
          type,
          message,
          messageStatus,
          createdAt,
          senderId,
          receiverId,
        } = msg;

        let user = {
          messageId: id,
          type,
          message,
          messageStatus,
          createdAt,
          senderId,
          receiverId,
        };

        if (isSender) {
          user = {
            ...user,
            ...msg.receiver,
            totalUnreadMessages: 0,
          };
        } else {
          user = {
            ...user,
            ...msg.sender,
            totalUnreadMessages: msg.messageStatus === "read" ? 0 : 1,
          };
        }

        users.set(calculatedId, { ...user });
      } else if (msg.messageStatus !== "read" && msg.senderId !== userId) {
        const user = users.get(calculatedId);
        users.set(calculatedId, {
          ...user,
          totalUnreadMessages: user.totalUnreadMessages + 1,
        });
      }
    });

    if (messageStatusChange.length > 0) {
      await prisma.messages.updateMany({
        where: {
          id: { in: messageStatusChange },
        },
        data: { messageStatus: "delivered" },
      });
    }
    return res.status(200).json({
      users: Array.from(users.values()),
      onlineUsers: Array.from(onlineUsers.keys()),
    });
  } catch (error) {
    next(error);
  }
};
