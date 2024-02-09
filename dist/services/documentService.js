"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listDocuments = exports.deleteDocument = exports.updateDocument = exports.getDocumentById = exports.createDocument = void 0;
// src/services/documentService.ts
const Document_1 = __importDefault(require("../models/Document"));
// Create a new document
const createDocument = (docData) => __awaiter(void 0, void 0, void 0, function* () {
    const document = new Document_1.default(docData);
    yield document.save();
    return document;
});
exports.createDocument = createDocument;
// Get a document by ID
const getDocumentById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return Document_1.default.findById(id);
});
exports.getDocumentById = getDocumentById;
// Update a document
const updateDocument = (id, docData) => __awaiter(void 0, void 0, void 0, function* () {
    return Document_1.default.findByIdAndUpdate(id, docData, { new: true });
});
exports.updateDocument = updateDocument;
// Delete a document
const deleteDocument = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return Document_1.default.findByIdAndDelete(id);
});
exports.deleteDocument = deleteDocument;
// List all documents (optional, depending on your needs)
const listDocuments = () => __awaiter(void 0, void 0, void 0, function* () {
    return Document_1.default.find();
});
exports.listDocuments = listDocuments;
