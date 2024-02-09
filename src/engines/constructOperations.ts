// Define the possible types of operations
export enum OperationType {
  Insert = "insert",
  Delete = "delete",
}

// Define the structure of an operation
export interface Operation {
  type: OperationType;
  position: number;
  content: string;
}

export const constructOperation = ({
  type,
  position,
  content,
}: Operation): Operation => {
  // Construct the operation object
  return {
    type,
    position,
    content: type === "delete" ? "" : content,
  };
};
export const applyOperationToDocument = (
    operation: Operation,
    documentContent: string
  ): string => {
    switch (operation.type) {
      case OperationType.Insert:
        return documentContent.slice(0, operation.position) +
               operation.content +
               documentContent.slice(operation.position);
      case OperationType.Delete:
        // Assuming operation.content for delete is the number of characters to delete
        const deleteCount = parseInt(operation.content, 10);
        if (!isNaN(deleteCount)) {
          return documentContent.slice(0, operation.position) +
                 documentContent.slice(operation.position + deleteCount);
        }
        break;
    }
    return documentContent;
  };