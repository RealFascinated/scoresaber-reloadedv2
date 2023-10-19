import { triggerClient } from "@/trigger";
import { eventTrigger } from "@trigger.dev/sdk";

triggerClient.defineJob({
  id: "setup-user",
  name: "Setup User: Add first time user to the database",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "user.add",
  }),
  run: async (payload, io, ctx) => {
    const { id } = payload;

    await io.logger.info(`Setup User: Running for ${id}`);
  },
});
