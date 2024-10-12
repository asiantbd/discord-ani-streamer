import { Client } from "discord.js-selfbot-v13";
import { command, Streamer } from "@dank074/discord-video-stream";
import config from "./config.json";
import { aniStream } from "./commands/stream";
import { aniCam } from "./commands/cam";
import { aniSearch } from "./commands/search";
import {
  reactAnimeSelection,
  replyEpisodeSelection,
} from "./commands/episode-selection";

const client = new Client();
const streamer = new Streamer(client);
const _TestHardcodedStreamURL =
  "https://myanime.sharepoint.com/sites/chartlousty/_layouts/15/download.aspx?share=EeGsVmRLf9BEjtspvrqKz60Bm-R4vwrDaG-DpKh-1mYSUA";

// ready event
streamer.client.on("ready", () => {
  console.log(`--- ${streamer.client.user.tag} is ready ---`);
});

// message event
streamer.client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;

  // whitelist accepted command authors
  if (!config.acceptedAuthors.includes(msg.author.id)) return;

  if (!msg.content) return;

  if (msg.content.startsWith(`$ani-stream`)) {
    aniStream(streamer, msg, _TestHardcodedStreamURL);
  } else if (msg.content.startsWith("$ani-hls")) {
    let input = msg.content.split(" ");
    input.shift();
    let masterPlaylistUrl = input.join(" ");
    aniStream(streamer, msg, masterPlaylistUrl);
  } else if (msg.content.startsWith("$ani-cam")) {
    aniCam(streamer, msg, _TestHardcodedStreamURL);
  } else if (msg.content.startsWith("$disconnect")) {
    command?.kill("SIGINT");
    streamer.leaveVoice();
  } else if (msg.content.startsWith("$stop-stream")) {
    command?.kill("SIGINT");
    const stream = streamer.voiceConnection?.streamConnection;
    if (!stream) return;
    streamer.stopStream();
  } else if (msg.content.startsWith("$ani-search")) {
    let input = msg.content.split(" ");
    input.shift();
    let title = input.join(" ");
    aniSearch(msg, title);
  }

  // Handle Episode Selection from reply message
  if (msg.reference) {
    const channel = msg.channel;

    // Only handle reply action from episode selection message
    if (!msg.reference.messageId) return;

    // Handle reply episode selection
    replyEpisodeSelection(streamer, channel, msg);
  }
});

// Reaction event to embeds anime title message
streamer.client.on("messageReactionAdd", async (msg) => {
  reactAnimeSelection(msg);
});

// login
streamer.client.login(config.token);
