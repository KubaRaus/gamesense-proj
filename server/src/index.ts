import "dotenv/config";
import { createApp } from "./app";
import { getServerPort } from "./shared/config/runtime-env";

const port = getServerPort();

const app = createApp();

app.listen(port, () => {
  console.log(`GameSense server listening on port ${port}`);
});
