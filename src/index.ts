import {
    Client,
    StageChannel,
    WebEmbed,
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
    aniSearch
} from "./commands/ani-search";

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
        let input = msg.content.split(' ');
        input.shift();
        let title = input.join(' ');
        let result = await aniSearch(title);
        /*
         * todo : enhance this so many results can be sown
         * */
        let firstTitle = result.data.Page.media[0].title;
        let firstTitleDesc = 'english: ' + firstTitle.english +
            '\nnative: ' + firstTitle.native +
            '\nromaji: ' + firstTitle.romaji;
        let content = new WebEmbed()
            .setTitle('Anime Search Results')
            .setColor('GREEN')
            .setDescription(firstTitleDesc);
        msg.channel.send({
            content: `${WebEmbed.hiddenEmbed}${content}`,
        });
    }
});

// login
streamer.client.login(config.token);
