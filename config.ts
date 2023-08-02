export const config = {
  name: 'VCS Studio',
  description: 'Custom composite a live stream in real-time with Daily',
  githubLink: 'https://github.com/daily-solutions/vcs-studio',
  theme: {
    background: 'hsl(224 71% 4%)',
    foreground: 'hsl(213 31% 91%)',
    border: 'hsl(216 34% 17%)',
    input: 'hsl(216 34% 17%)',
    ring: 'hsl(216 34% 17%)',
    radius: '0.5rem',
    primary: {
      default: 'hsl(210 40% 98%)',
      foreground: 'hsl(222.2 47.4% 1.2%)',
    },
    secondary: {
      default: 'hsl(222.2 47.4% 11.2%)',
      foreground: 'hsl(210 40% 98%)',
    },
    destructive: {
      default: 'hsl(359 92% 58%)',
      foreground: 'hsl(210 40% 98%)',
    },
    selected: {
      default: 'hsl(224 82% 56%)',
      foreground: 'hsl(0 0% 100%)',
    },
    muted: {
      default: 'hsl(223 47% 11%)',
      foreground: 'hsl(215.4 16.3% 56.9%)',
    },
    accent: {
      default: 'hsl(216 34% 17%)',
      foreground: 'hsl(210 40% 98%)',
    },
    popover: {
      default: 'hsl(224 71% 4%)',
      foreground: 'hsl(215 20.2% 65.1%)',
    },
    card: {
      default: 'hsl(224 71% 4%)',
      foreground: 'hsl(213 31% 91%)',
    },
  },
  options: {
    /**
     * Enables Remote Media Player in the call
     * https://docs.daily.co/private/remote-media-player
     */
    enable_rmp: true,
    /**
     * Allows owner to record the call
     */
    enable_recording: true,
    /**
     * Allows owner to live stream the call
     */
    enable_live_streaming: true,
    /**
     * Allow viewers to request to join the call
     */
    enable_viewers_request_to_join: true,
  },
  vcs: {
    mode: 'grid',
    'videoSettings.showParticipantLabels': true,
    'videoSettings.preferScreenshare': false,
    'videoSettings.omitPausedVideo': false,
    'videoSettings.omitAudioOnly': false,
    'videoSettings.omitExtraScreenshares': false,
    'videoSettings.roundedCorners': false,
    'videoSettings.cornerRadius_gu': 1.2,
    'videoSettings.scaleMode': 'fill',
    'videoSettings.scaleModeForScreenshare': 'fit',
    'videoSettings.highlight.color': '#000000',
    'videoSettings.highlight.stroke_gu': 0.2,
    'videoSettings.placeholder.bgColor': '#003250',
    'videoSettings.margin.left_gu': 0,
    'videoSettings.margin.right_gu': 0,
    'videoSettings.margin.top_gu': 0,
    'videoSettings.margin.bottom_gu': 0,
  },
};
