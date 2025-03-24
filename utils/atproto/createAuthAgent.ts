import { AtpAgent } from "@atproto/api";
import "jsr:@std/dotenv/load";

export const createAuthAgent = async () => {
  const username = Deno.env.get("BSKY_USERNAME");
  const password = Deno.env.get("BSKY_PASSWORD");

  try {
    if (!username || !password) {
      console.log("No username or password found in environment variables");
      return null;
    }

    const agent = new AtpAgent({
      service: "https://bsky.social",
    });
    await agent.login({
      identifier: username,
      password: password,
    });

    // return auth'd agent
    return agent;
  } catch (e) {
    console.error(`Error creating agent: ${e}`);
    return null;
  }
};
