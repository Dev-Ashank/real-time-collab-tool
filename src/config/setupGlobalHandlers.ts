import logger from "./logger";

export const setupGlobalHandlers = () => {
  process.on("uncaughtException", (error) => {
    logger.error("Uncaught Exception:", error);
    process.exit(1);
  });

  process.on("unhandledRejection", (error) => {
    logger.error("Unhandled Rejection:", error);
  });
};
