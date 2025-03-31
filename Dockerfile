FROM denoland/deno:2.2.6

# The port that your application listens to.

EXPOSE 8000

WORKDIR /app

# Prefer not to run as root.
USER deno

# These steps will be re-run upon each file change in your working directory:
COPY . .

# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache vctBlueskyBot.ts

# Warmup caches
RUN timeout 10s deno -A vctBlueskyBot.ts || [ $? -eq 124 ] || exit 1

# Configure the container to run as an executable
CMD ["task", "start:vct-bot"]
