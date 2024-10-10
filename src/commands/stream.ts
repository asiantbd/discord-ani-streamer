import { playVideo } from "./util/play-video";
import { parseArgs } from "./util/parse-args";
import config from "../config.json";
import { StageChannel } from "discord.js-selfbot-v13";

/*
 * Parameters
 * ---------------------------------------
 *  stream	: stream client from library, should be passed to call this function
 *  msg 	: parameter related to the discord information.
 *  playbackUrl	: the video url that will be played from discord bot stream.
 *
 * Response
 * ---------------------------------------
 *  No response will be returned for the function, but the bot should play the stream.
 * */
export async function aniStream(streamer: any, msg: any, playbackUrl: string) {
  const args = parseArgs(msg.content);
  if (!args) return;

  // get voiche channel from config
  const voiceChannelId = config.serverOpts.voiceChannelId;

  if (!voiceChannelId) return;

  console.log(
    `Attempting to join voice channel ${msg.guildId}/${voiceChannelId}`,
  );
  await streamer.joinVoice(msg.guildId, voiceChannelId);

  const channel = streamer.client.user.voice.channel;
  if (channel instanceof StageChannel) {
    await streamer.client.user.voice.setSuppressed(false);
  }
  const streamUdpConn = await streamer.createStream({
    width: config.streamOpts.width,
    height: config.streamOpts.height,
    fps: config.streamOpts.fps,
    bitrateKbps: config.streamOpts.bitrateKbps,
    maxBitrateKbps: config.streamOpts.maxBitrateKbps,
    hardwareAcceleratedDecoding: config.streamOpts.hardware_acceleration,
    videoCodec: config.streamOpts.videoCodec === "H264" ? "H264" : "VP8",
  });

  await playVideo(playbackUrl, streamUdpConn);

  streamer.stopStream();
  return;
}
