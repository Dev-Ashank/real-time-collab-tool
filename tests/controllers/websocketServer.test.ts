import { Server } from "http";
import { AddressInfo } from "net";
import { WebSocket, WebSocketServer } from "ws";
require("dotenv").config({ path: ".env.test" });
const PORT = process.env.PORT || 5000;
describe("WebSocket Server", () => {
  let server: Server;
  let wss: WebSocketServer;

  beforeAll((done) => {
    // Setup HTTP and WebSocket server for testing
    server = new Server();
    wss = new WebSocketServer({ server });
    server.listen(PORT, () => {
      console.log(`Test server listening on port ${PORT}`);
      done();
    });
  }, 10000);

  afterAll((done) => {
    wss.close(() => {
      server.close(done);
    });
  }, 10000);

  test("WebSocket server connects", (done) => {
    const { port } = server.address() as AddressInfo;
    const client = new WebSocket(`ws://localhost:${port}`);

    client.onopen = () => {
      console.log("Connection established");
      client.close();
      done();
    };

    client.onerror = (err) => {
      console.error("WebSocket error:", err);
      done(err);
    };
  }, 10000);
});
