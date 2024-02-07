import request from "supertest";
import app from "../src/index";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { IChat } from "../src/models/Chat";
interface TestIChat extends Omit<IChat, "sender" | "receiver"> {
  _id: string;
  sender: string;
  receiver: string;
}

describe("Chat Routes", () => {
  let mongoServer: MongoMemoryServer;
  let chatId: string; // Declare chatId here to be accessible within all tests

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test("POST /api/chats", async () => {
    const newChat = {
      message: "Hello World",
      senderId: "123",
      receiverId: "456",
    };
    const response = await request(app).post("/api/chats").send(newChat);
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toEqual(newChat.message);
    chatId = response.body._id; // Store chatId for use in subsequent tests
  });

  test("GET /api/chats", async () => {
    const response = await request(app).get("/api/chats");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();

    expect(
      response.body.some((chat: TestIChat) => chat._id === chatId)
    ).toBeTruthy();
  });

  test("GET /api/chats/:id", async () => {
    const response = await request(app).get(`/api/chats/${chatId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toEqual(chatId);
  });

  test("PUT /api/chats/:id", async () => {
    const updatedChat = { message: "Updated Message" };
    const response = await request(app)
      .put(`/api/chats/${chatId}`)
      .send(updatedChat);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual(updatedChat.message);
  });

  test("DELETE /api/chats/:id", async () => {
    const response = await request(app).delete(`/api/chats/${chatId}`);
    expect(response.statusCode).toBe(204);
    // Optionally, verify deletion by attempting to fetch the deleted chat
    const fetchResponse = await request(app).get(`/api/chats/${chatId}`);
    expect(fetchResponse.statusCode).toBe(404); // Assuming your API returns 404 for not found
  });
});
