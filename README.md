![VCS Studio](./public/vcs-studio.png)

# VCS Studio

Create a custom live and recorded experience with Daily's Video Component System (VCS) and Interactive Live Streaming (ILS)

## Features

### Studio for Layout Management 

Craft the video experience you want. Control layouts, add static text, logos or dynamic elements with the Studio UI.

* Choose between five preset video layouts: Single, Split, Grid, Speaker, and Picture-in-Picture
* Overlay text and image elements (eg: logos)
* Trigger dynamic toast elements

### Multi-endpoint RTMP streaming 

Stream using RTMP to multiple endpoints such as Youtube, Twitch, LinkedIn, and more. Stream up to 20 concurrent destinations

### Recording

Record your session and save a mp4 file for on-demand pipelines

> Note - you can stream out via RTMP and record a session at the same time

### Real-time live experience via ILS

Invite viewers to watch and participate in the live session

* Support up to 100,000 viewers broadcasting in real-time latency (200ms) via Daily's Interactive Live Streaming
* Bring viewers to the stage to ask questions and build a true two-way interactive  
* Host up to 25 speakers "on stage"
* Chat with your viewers in real-time

> Note - The ILS live experience, RTMP live stream, and the recording will all display and retain the UI elements created in the Studio as-is!

### Playback recorded media

Add and play pre-recorded videos in the live experience!

* Play any hosted video file as part of the live experience


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
