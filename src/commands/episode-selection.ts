import { extractEpisodeCount } from "./util/parse-args";
import { getStreamUrl } from "./util/get-stream-url";
import { aniStream } from "./stream";
import { matchAllanimeId } from "./provider/allanime";

export async function reactAnimeSelection(msg: any) {
  let embeds = msg.message.embeds;
  if (embeds.length !== 0) {
    let title = msg.message.embeds[0].title;
    let epsCount = extractEpisodeCount(msg.message.embeds[0].description);

    await msg.message.reply(
      "**>> Your requested anime `" +
        title +
        "`.** \nReply with your selected episode (1-" +
        epsCount +
        ") : ",
    );
  }
}

export async function replyEpisodeSelection(
  streamer: any,
  channel: any,
  msg: any,
) {
  const episodeConfirmMessageId = msg.reference.messageId;
  const episodeConfirmMessage = await channel.messages.fetch(
    episodeConfirmMessageId,
  );
  if (!episodeConfirmMessage.reference.messageId) return;

  const selectedTitleMessage = await channel.messages.fetch(
    episodeConfirmMessage.reference.messageId,
  );

  // Make sure embeds message have data
  if (selectedTitleMessage.embeds.length == 0) return;

  // Parse the Embeds Anime Title data
  // Get Stream URL & Play Stream
  try {
    const selectedEps = parseInt(msg.content);
    let title = selectedTitleMessage.embeds[0].title;
    let anilistId = selectedTitleMessage.embeds[0].provider.name;

    const allanimeId = await matchAllanimeId(title, anilistId);
    const streamUrl = await getStreamUrl(allanimeId, selectedEps);
    console.log(`>> DEBUG Stream URL: ${streamUrl}`);

    await msg.channel.send({
      content:
        ">> Playing now **" +
        title +
        "** (Eps: " +
        selectedEps +
        " ) at https://discord.com/channels/808753367891050527/1292803046706774016",
    });

    aniStream(streamer, episodeConfirmMessage, streamUrl);
  } catch (error) {
    console.error(`Error when selecting episode: ${error.message}`);
  }
}
