"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructOperation = void 0;
const otEngine_1 = require("./otEngine");
// Function to construct an operation based on the received content
const constructOperation = (content) => {
    // Here you can implement your logic to construct the operation
    // For example, you might need to compare the received content
    // with the current document state to determine the type and position of the operation
    // For simplicity, let's assume it's an insertion operation at the end of the document
    // Determine the position for insertion (e.g., at the end of the document)
    const position = otEngine_1.documentState.length;
    // Construct the operation object
    const operation = {
        type: "insert",
        position,
        content
    };
    return operation;
};
exports.constructOperation = constructOperation;
