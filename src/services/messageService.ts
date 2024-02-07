import Chat, { IChat } from "../models/Chat";

export const saveChatMessage = async (
  message: string,
  senderId: string,
  receiverId: string
): Promise<IChat> => {
  return await Chat.create({ message, sender: senderId, receiver: receiverId });
};

export const getAllChatMessages = async (userId: string): Promise<IChat[]> => {
  return await Chat.find({
    $or: [{ sender: userId }, { receiver: userId }],
  }).populate("sender receiver");
};

export const getChatMessageById = async (id: string): Promise<IChat | null> => {
  return await Chat.findById(id).populate("sender receiver");
};

export const updateChatMessage = async (
  id: string,
  message: string
): Promise<IChat | null> => {
  return await Chat.findByIdAndUpdate(id, { message }, { new: true });
};
export const deleteChatMessage = async (id: string): Promise<IChat | null> => {
  return await Chat.findByIdAndDelete(id);
};
export const getChatMessagesByUser = async (
  userId: string,
  receiverId: string
): Promise<IChat[]> => {
  // Fetch messages where the sender is the current user and the receiver is the specified user
  return await Chat.find({ sender: userId, receiver: receiverId }).populate(
    "sender receiver"
  );
};
