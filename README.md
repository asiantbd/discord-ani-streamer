# discord-ani-streamer

## WIP (Work In Progress)

## Dependencies

This bot relies on the outstanding contributions from:

- [dank074/Discord-video-stream](https://github.com/dank074/Discord-video-stream)
- [pystardust/ani-cli](https://github.com/pystardust/ani-cli)

* This project is still under development, additional dependencies may be added in the future.

## Running the Development Workflow

1. Create a `config.json` file in the `src` directory. Here's an example:

```json
{
  "token": "xxxxxxxxxxxxxxxxxxxxx-user-token-non-bot",
  "acceptedAuthors": ["xxxxxxxxxxxxxxxxxxxxx"],
  "serverOpts": {
    "voiceChannelId": "xxxxxxxxxxxxxxxxxxxxx"
  },
  "streamOpts": {
    "width": 1280,
    "height": 720,
    "fps": 30,
    "bitrateKbps": 1000,
    "maxBitrateKbps": 2500,
    "hardware_acceleration": false,
    "videoCodec": "H264"
  }
}
```

2. Execute the Docker Build and Run commands. All necessary dependencies are preconfigured in the `Dockerfile`:

```sh
docker build --platform=linux/amd64 -t discord-ani-streamer:devel . && docker run -it --rm --platform=linux/amd64 discord-ani-streamer:devel
```

3. In the Discord channel, use the following command:

```sh
$ani-stream test
# Note: For development and testing purposes, the command arguments are hardcoded
```

4. After making code changes, repeat the build and test process using the above commands.
