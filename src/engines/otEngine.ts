import { documentClients } from "../config/websocketServer";
import { Operation } from "./constructOperations";

// Define the document state


export const broadcastOperation = (
  documentContent: any,
  documentId: any,
  WebSocket: any
) => {
  const clients = documentClients.get(documentId);
  if (!clients) {
    console.error(`No clients found for documentId: ${documentId}`);
    return;
  }

  console.log("Broadcasting operation");

  clients.forEach((client) => {
    // Prepare the operation for sending
    const operationToSend = JSON.stringify(documentContent);

    // Perform error handling to ensure robustness
    try {
      if (client.readyState === WebSocket.OPEN) {
        client.send(operationToSend);
      } else {
        console.error(`Client connection is not open.`);
      }
    } catch (error) {
      console.error(`Failed to send operation to client: ${error}`);
    }
  });
};
