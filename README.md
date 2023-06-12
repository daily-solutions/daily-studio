![VCS Studio](./public/vcs-studio.png)

# VCS Studio

Custom composite a live stream in real-time with Daily

## Features

* Interactive Live Streaming ([ILS](https://www.daily.co/products/interactive-live-streaming)), supports three roles.
  * Owner - The owner of the stream, can invite participants to join the stream, customize the layout.
  * Presenter - The presenter of the stream, can share their camera, screen, and audio.
  * Viewer - The viewer of the stream, can only view the stream.
* Stream to multiple platforms at once (e.g. YouTube, Twitch, Facebook, etc.)
* Record your stream
* Customizable Stream UI
* Invite participants to join your stream
* Chat with participants
* Remote Media Player

### Live example

**[See it in action here ➡️](https://vcs-studio.vercel.app/)**

## Getting Started

### Install dependencies

```
yarn install
```

### Copy & update the env variables

```
# set DAILY_API_KEY, NEXT_PUBLIC_DAILY_DOMAIN & NEXT_PUBLIC_BASE_URL
cp env.example .env.local
```

### Start your dev server

```
yarn dev
```

Demo should be live at - http://localhost:3000

## Deploy your own on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone-flow?repository-url=https%3A%2F%2Fgithub.com%2Fdaily-solutions%2Fvcs-studio.git&env=NEXT_PUBLIC_DAILY_DOMAIN%2CNEXT_PUBLIC_BASE_URL%2CDAILY_API_KEY)
