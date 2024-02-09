"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.deleteDocument = exports.updateDocument = exports.getDocumentById = exports.createDocument = void 0;
const DocumentService = __importStar(require("../services/documentService"));
const logger_1 = __importDefault(require("../config/logger"));
const createDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const document = yield DocumentService.createDocument(req.body);
        logger_1.default.info(`Document created successfully: ${document.id}`);
        res.status(201).json(document);
    }
    catch (error) {
        logger_1.default.error("Error creating document", {
            error: error instanceof Error ? error.message : error,
        });
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.createDocument = createDocument;
const getDocumentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const document = yield DocumentService.getDocumentById(req.params.id);
        if (!document) {
            logger_1.default.warn(`Document not found: ${req.params.id}`);
            return res.status(404).json({ error: "Document not found" });
        }
        logger_1.default.info(`Document retrieved successfully: ${document.id}`);
        res.json(document);
    }
    catch (error) {
        logger_1.default.error("Error retrieving document", {
            error: error instanceof Error ? error.message : error,
        });
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getDocumentById = getDocumentById;
const updateDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const document = yield DocumentService.updateDocument(req.params.id, req.body);
        if (!document) {
            logger_1.default.warn(`Document not found for update: ${req.params.id}`);
            return res.status(404).json({ error: "Document not found" });
        }
        logger_1.default.info(`Document updated successfully: ${document.id}`);
        res.json(document);
    }
    catch (error) {
        logger_1.default.error("Error updating document", {
            error: error instanceof Error ? error.message : error,
        });
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.updateDocument = updateDocument;
const deleteDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const document = yield DocumentService.deleteDocument(req.params.id);
        if (!document) {
            logger_1.default.warn(`Document not found for deletion: ${req.params.id}`);
            return res.status(404).json({ error: "Document not found" });
        }
        logger_1.default.info(`Document deleted successfully: ${req.params.id}`);
        res.status(204).send();
    }
    catch (error) {
        logger_1.default.error("Error deleting document", {
            error: error instanceof Error ? error.message : error,
        });
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.deleteDocument = deleteDocument;
