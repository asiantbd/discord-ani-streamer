import {
    command,
    streamLivestreamVideo,
    MediaUdp,
    getInputMetadata,
    inputHasAudio,
} from "@dank074/discord-video-stream";

export async function playVideo(video: string, udpConn: MediaUdp) {
    let includeAudio = true;

    try {
        const metadata = await getInputMetadata(video);
        //console.log(JSON.stringify(metadata.streams));
        includeAudio = inputHasAudio(metadata);
    } catch (e) {
        console.log(e);
        return;
    }

    console.log("Started playing video");

    udpConn.mediaConnection.setSpeaking(true);
    udpConn.mediaConnection.setVideoStatus(true);
    try {
        const res = await streamLivestreamVideo(video, udpConn, includeAudio);

        console.log("Finished playing video " + res);
    } catch (e) {
        console.log(e);
    } finally {
        udpConn.mediaConnection.setSpeaking(false);
        udpConn.mediaConnection.setVideoStatus(false);
    }
    command?.kill("SIGINT");
}
