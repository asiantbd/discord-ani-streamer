import { querySearchAnime } from "./provider/anilist";
import { WebEmbed } from "discord.js-selfbot-v13";

export async function aniSearch(msg: any, title: string) {
    try {
        let result = await querySearchAnime(title);
        /*
         * todo : enhance this so many results can be sown
         * */
        msg.reply("**>> Anime Search Results :**");
        if (result.data) {
            for (let anime of result.data.Page.media) {
                let animeDesc =
                    "EN: " +
                    (anime.title.english || "N/A") +
                    "\nJP: " +
                    (anime.title.native || "N/A") +
                    "\nEps: " +
                    (anime.episodes || "N/A") +
                    "\nScore: " +
                    (anime.meanScore || "N/A");
                let animeSeason =
                    "(" + anime.seasonYear + "-" + anime.season + ") ";
                let animeTitle =
                    anime.title.romaji || anime.title.native || "Unknown Title";
                let content = new WebEmbed()
                    .setTitle(animeSeason + animeTitle)
                    .setColor("GREEN")
                    .setDescription(animeDesc)
                    .setImage(anime.coverImage.large || "");
                await msg.channel.send({
                    content: `${WebEmbed.hiddenEmbed}${content}`,
                });
            }
        } else {
            await msg.channel.send({
                content:
                    "🚫 Oops! No results found or there was an error with the search.",
            });
        }
    } catch (error) {
        console.error("Error in aniSearch:", error);
        await msg.channel.send({
            content: "🚫 Oops! An error occurred while searching for anime.",
        });
    }
    return;
}
