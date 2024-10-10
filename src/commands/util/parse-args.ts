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

export { Args, parseArgs };
