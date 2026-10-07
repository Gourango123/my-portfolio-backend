const Message = require("../models/message.model");
const messageSchema = require("../validators/message.validator");

// 
exports.createMessage = async (req, res) => {
  try {
    const { error, value } = messageSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((err) => err.message),
      });
    }

    const newMessage = await Message.create(value);

    res.status(201).json({
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Create message error:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// get message
exports.getMessage = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.min(
      Math.max(Number(req.query.limit) || 10, 1),
      50
    );

    const skip = (page - 1) * limit;

    const search = req.query.search?.trim() || "";

    const filter = search
      ? {
          $or: [
            {
              name: {
                $regex: search,
                $options: "i",
              },
            },
            {
              email: {
                $regex: search,
                $options: "i",
              },
            },
            {
              subject: {
                $regex: search,
                $options: "i",
              },
            },
            {
              message: {
                $regex: search,
                $options: "i",
              },
            },
          ],
        }
      : {};

    const [messages, totalMessages] = await Promise.all([
      Message.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Message.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalMessages / limit);

    res.status(200).json({
      message: "Messages fetched successfully",
      data: messages,
      pagination: {
        currentPage: page,
        limit,
        totalMessages,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get messages error:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// delete
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    await Message.findByIdAndDelete(id);

    res.status(200).json({
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Delete message error:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};