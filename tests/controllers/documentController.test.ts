// src/controllers/__tests__/documentController.test.ts
import request from "supertest";
import app from "../../src/index"; // Import your Express application
import * as DocumentService from "../../src/services/documentService";

// Mocking the Document model
jest.mock("../../src/models/Document");
jest.mock("../../src/services/documentService", () => ({
  createDocument: jest.fn(),
  getDocumentById: jest.fn(),
  updateDocument: jest.fn(),
  deleteDocument: jest.fn(),
}));
describe("Document Controller", () => {
  describe("createDocument", () => {
    it("should create a document and return it", async () => {
      const mockDocument = {
        id: "1",
        title: "Test Document",
        content: "Test content",
        owner: "Test Owner",
        collaborators: [],
        lastUpdated: new Date(),
      };

      // Mocking the service layer to return a resolved promise with a document
      (DocumentService.createDocument as jest.Mock).mockResolvedValue(
        mockDocument
      );

      const response = await request(app).post("/api/documents/").send({
        title: "Test Document",
        content: "Test content",
        owner: "65c307f6a7467c08ab825fbb",
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockDocument);
      expect(DocumentService.createDocument).toHaveBeenCalledWith({
        title: "Test Document",
        content: "Test content",
        owner: "Test Owner",
      });
    });

    // Additional tests for error handling, validation failures, etc.
  });

  // Tests for getDocumentById, updateDocument, deleteDocument, etc.
});
