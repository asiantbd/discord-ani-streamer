import {
    Client,
    StageChannel
} from "discord.js-selfbot-v13";
import {
    command,
    streamLivestreamVideo,
    MediaUdp,
    getInputMetadata,
    inputHasAudio,
    Streamer,
} from "@dank074/discord-video-stream";
import config from "./config.json";
import {
    aniStream
} from "./commands/stream";
import {
    aniCam
} from "./commands/cam";
import {
    Args,
    parseArgs
} from "./commands/util/parse-args";

const streamer = new Streamer(new Client());
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
    }
});

// login
streamer.client.login(config.token);
