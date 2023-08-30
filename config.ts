export const config = {
  name: 'ILS Studio',
  description:
    "Create a custom live and recorded experience with Daily's Video Component System (VCS) and Interactive Live Streaming (ILS)",
  githubLink: 'https://github.com/daily-solutions/vcs-studio',
  theme: {
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(20 14.3% 4.1%)',
    border: 'hsl(20 5.9% 90%)',
    input: 'hsl(20 5.9% 90%)',
    ring: 'hsl(24.6 95% 53.1%)',
    radius: '0.5rem',
    primary: {
      default: 'hsl(24.6 95% 53.1%)',
      foreground: 'hsl(60 9.1% 97.8%)',
    },
    secondary: {
      default: 'hsl(60 4.8% 95.9%)',
      foreground: 'hsl(24 9.8% 10%)',
    },
    destructive: {
      default: 'hsl(0 84.2% 60.2%)',
      foreground: 'hsl(60 9.1% 97.8%)',
    },
    muted: {
      default: 'hsl(60 4.8% 95.9%)',
      foreground: 'hsl(25 5.3% 44.7%)',
    },
    accent: {
      default: 'hsl(60 4.8% 95.9%)',
      foreground: 'hsl(24 9.8% 10%)',
    },
    popover: {
      default: 'hsl(0 0% 100%)',
      foreground: 'hsl(20 14.3% 4.1%)',
    },
    card: {
      default: 'hsl(0 0% 100%)',
      foreground: 'hsl(20 14.3% 4.1%)',
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
    /**
     * Enable chat in the call
     */
    enable_chat: true,
    /**
     * Enable screen sharing in the call
     */
    enable_screenshare: true,
    /**
     * Enable people tab
     */
    enable_people: true,
    /**
     * Enable network UI
     */
    enable_network_ui: true,
    /**
     * Available layout modes
     */
    available_layouts: {
      single: 'Single',
      split: 'Split',
      grid: 'Grid',
      dominant: 'Speaker',
      pip: 'PiP',
    },
    /**
     * Enable viewer count
     */
    enable_viewer_count: true,
  },
  vcs: {
    mode: 'grid',
    'videoSettings.showParticipantLabels': true,
    'videoSettings.preferScreenshare': true,
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
