"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastOperation = exports.handleOperation = exports.applyOperationToDocument = exports.transformDelete = exports.transformInsert = exports.documentState = exports.clients = void 0;
// Define the document state
exports.clients = new Set();
exports.documentState = "";
// Transformation function for insertion operation
const transformInsert = (operation, concurrentOperation) => {
    if (operation.position < concurrentOperation.position) {
        // No change needed if the concurrent operation is before the current operation
        return operation;
    }
    else if (operation.position === concurrentOperation.position) {
        /**
         * TODO :-for future apply Tie break Logic based on timeStamp or userId
         */
        // For simplicity, we'll assume the operation with the lower user ID wins
        if (operation.userId < concurrentOperation.userId) {
            return operation;
        }
        else {
            operation.position++; // Move the position of the current operation
            return operation;
        }
    }
    else {
        operation.position++; // Move the position of the current operation
        return operation;
    }
};
exports.transformInsert = transformInsert;
// Transformation function for deletion operation
const transformDelete = (operation, concurrentOperation) => {
    if (operation.position <= concurrentOperation.position) {
        // Adjust the position of the current operation if it's affected by the concurrent deletion
        operation.position--;
    }
    return operation;
};
exports.transformDelete = transformDelete;
// Apply operation to the document state
const applyOperationToDocument = (operation) => {
    // Apply the operation to the document state based on the operation type
    if (operation.type === "insert") {
        exports.documentState =
            exports.documentState.slice(0, operation.position) +
                operation.text +
                exports.documentState.slice(operation.position);
    }
    else if (operation.type === "delete") {
        exports.documentState =
            exports.documentState.slice(0, operation.position) +
                exports.documentState.slice(operation.position + operation.length);
    }
};
exports.applyOperationToDocument = applyOperationToDocument;
// Function to handle incoming operations from clients
const handleOperation = (operation) => {
    // Apply necessary transformations to the operation
    // For simplicity, let's assume no conflicts occur
    // You'll need to implement actual transformation logic
    // based on the type of operation and current document state
    // Apply operation to the document state
    (0, exports.applyOperationToDocument)(operation);
    // Broadcast the transformed operation to all clients
    (0, exports.broadcastOperation)(operation);
};
exports.handleOperation = handleOperation;
// Broadcast transformed operation to all clients
const broadcastOperation = (operation) => {
    // Broadcast the operation to all connected clients
    // For simplicity, let's assume we have access to all client WebSocket connections
    // You'll need to implement actual broadcasting logic
    // to send the operation to all clients
    exports.clients.forEach((client) => {
        client.send(JSON.stringify(operation));
    });
};
exports.broadcastOperation = broadcastOperation;
