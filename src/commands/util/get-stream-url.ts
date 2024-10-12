import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

function sanitizeInput(input: string): string {
  return input.replace(/[^a-zA-Z0-9_-]/g, "");
}

async function localExec(command: string): Promise<string> {
  try {
    const { stdout, stderr } = await execAsync(command);
    if (stderr) {
      throw new Error(`Command execution error: ${stderr}`);
    }
    return stdout.trim();
  } catch (error) {
    throw new Error(`Error executing command: ${error.message}`);
  }
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function extractUrl(output: string): string {
  const urlMatch = output.match(/https?:\/\/[^\s"]+/);
  return urlMatch ? urlMatch[0] : "";
}

export async function getStreamUrl(
  anilistId: string,
  episodeNum: number,
): Promise<string> {
  const sanitizedAnilistId = sanitizeInput(anilistId);
  const sanitizedEpisodeNum = Math.max(1, Math.floor(episodeNum));

  const command = `./ani-cli --patch-discord-ani-stream ${sanitizedAnilistId} bypassed --episode ${sanitizedEpisodeNum}`;

  try {
    const result = await localExec(command);
    const sanitizedURL = extractUrl(result);

    if (!isValidUrl(sanitizedURL)) {
      throw new Error("Command did not return a valid URL");
    }

    return sanitizedURL;
  } catch (error) {
    console.error(`Failed to get stream URL: ${error.message}`);
    throw new Error(
      `Unable to retrieve stream URL for Anilist ID ${anilistId}, Episode ${episodeNum}`,
    );
  }
}
