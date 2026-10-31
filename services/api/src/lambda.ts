import serverless from "serverless-http";

import { createApp } from "./app.ts";

// Lambda invokes the same Express app without opening a listening socket.
export const handler = serverless(createApp());
