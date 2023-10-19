import { triggerClient } from "@/trigger";
import { createAppRoute } from "@trigger.dev/nextjs";

import "@/jobs";

//this route is used to send and receive data with Trigger.dev
export const { POST, dynamic } = createAppRoute(triggerClient);
