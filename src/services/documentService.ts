// src/services/documentService.ts
import Document, { IDocument } from '../models/Document';

// Create a new document
export const createDocument = async (docData: Partial<IDocument>): Promise<IDocument> => {
  const document = new Document(docData);
  await document.save();
  return document;
};

// Get a document by ID
export const getDocumentById = async (id: string): Promise<IDocument | null> => {
  return Document.findById(id);
};

// Update a document
export const updateDocument = async (id: string, docData: Partial<IDocument>): Promise<IDocument | null> => {
  return Document.findByIdAndUpdate(id, docData, { new: true });
};

// Delete a document
export const deleteDocument = async (id: string): Promise<IDocument | null> => {
  return Document.findByIdAndDelete(id);
};

// List all documents (optional, depending on your needs)
export const listDocuments = async (): Promise<IDocument[]> => {
  return Document.find();
};
