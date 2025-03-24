/**
 * WIP
 * This script automates the process of collecting player updates from the
 * Valorant Champions Tour (VCT) Global Database and storing them in the
 * database and / or displaying them on a historgraph (unsure what i want to do with it yet)
 *
 * Written and maintained by Joe Linogao (@joedoescoding.com)
 * 2025 - Present
 */

import "jsr:@std/dotenv/load";
import { createAuthAgent } from "./utils/atproto/index.ts";

// TODO: testing bsky agent here
const agent = await createAuthAgent();

if (!agent) {
  console.log("Failed to create agent");
  Deno.exit();
}

console.log("Agent created successfully!");

const messagePayload = {
  text: "Testing :)",
  createdAt: new Date().toISOString(),
};

await agent.post(messagePayload);

console.log(`Message posted successfully!: ${messagePayload.text}`);
