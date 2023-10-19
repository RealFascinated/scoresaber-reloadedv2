import { TriggerClient } from "@trigger.dev/sdk";

export const triggerClient = new TriggerClient({
  id: "scoresaber-reloaded-3SPH",
  apiKey: process.env.TRIGGER_API_KEY,
  apiUrl: process.env.TRIGGER_API_URL,
});
