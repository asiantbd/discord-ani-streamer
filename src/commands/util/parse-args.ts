type Args = {
  url: string;
};

function parseArgs(message: string): Args | undefined {
  const args = message.split(" ");
  if (args.length < 2) return;

  const url = args[1];

  return {
    url,
  };
}

function extractEpisodeCount(input: string): number | null {
  const match = input.match(/Eps:\s*(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

export { Args, parseArgs, extractEpisodeCount };
