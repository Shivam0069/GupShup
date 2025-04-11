import getPrismaInstance from "../utils/PrismaClient.js";

export const checkUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.json({ message: "Email is required", success: false });
    }
    const prisma = getPrismaInstance();
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.json({
        message: "User not found",
        success: false,
      });
    } else {
      return res.json({
        message: "User found",
        success: true,
        data: user,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const onBoardUser = async (req, res, next) => {
  try {
    const { email, name, about, image: profilePicture } = req.body;

    if (!email || !name || !profilePicture) {
      return res.status(400).json({
        success: false,
        message: "Email, Name, and Profile Picture are required",
      });
    }

    const prisma = getPrismaInstance();

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        about,
        profilePicture,
      },
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};
