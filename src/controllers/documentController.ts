// src/controllers/documentController.ts
import { Request, Response } from "express";
import * as DocumentService from "../services/documentService";
import logger from "../config/logger";

export const createDocument = async (req: Request, res: Response) => {
  try {
    const document = await DocumentService.createDocument(req.body);
    logger.info(`Document created successfully: ${document.id}`);
    res.status(201).json(document);
  } catch (error) {
    logger.error("Error creating document", {
      error: error instanceof Error ? error.message : error,
    });
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getDocumentById = async (req: Request, res: Response) => {
  try {
    const document = await DocumentService.getDocumentById(req.params.id);
    if (!document) {
      logger.warn(`Document not found: ${req.params.id}`);
      return res.status(404).json({ error: "Document not found" });
    }
    logger.info(`Document retrieved successfully: ${document.id}`);
    res.json(document);
  } catch (error) {
    logger.error("Error retrieving document", {
      error: error instanceof Error ? error.message : error,
    });
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateDocument = async (req: Request, res: Response) => {
  try {
    const document = await DocumentService.updateDocument(
      req.params.id,
      req.body
    );
    if (!document) {
      logger.warn(`Document not found for update: ${req.params.id}`);
      return res.status(404).json({ error: "Document not found" });
    }
    logger.info(`Document updated successfully: ${document.id}`);
    res.json(document);
  } catch (error) {
    logger.error("Error updating document", {
      error: error instanceof Error ? error.message : error,
    });
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteDocument = async (req: Request, res: Response) => {
  try {
    const document = await DocumentService.deleteDocument(req.params.id);
    if (!document) {
      logger.warn(`Document not found for deletion: ${req.params.id}`);
      return res.status(404).json({ error: "Document not found" });
    }
    logger.info(`Document deleted successfully: ${req.params.id}`);
    res.status(204).send();
  } catch (error) {
    logger.error("Error deleting document", {
      error: error instanceof Error ? error.message : error,
    });
    res.status(500).json({ error: "Internal server error" });
  }
};
