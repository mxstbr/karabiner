import fs from "fs";
import { KarabinerRules } from "./types";
import { createHyperSubLayers, app, open, rectangle } from "./utils";

const rules: KarabinerRules[] = [
  // Define the Hyper key itself
  {
    description: "Hyper Key (⌃⌥⇧⌘)",
    manipulators: [
      {
        description: "Change caps_lock to command+control+option+shift.",
        from: {
          key_code: "caps_lock",
          modifiers: {
            optional: ["any"],
          },
        },
        to: [
          // {
          //     key_code: "left_shift",
          //     modifiers: [
          //         "left_command",
          //         "left_control",
          //         "left_option"
          //     ]
          // },
          {
            set_variable: {
              name: "hyper",
              value: 1,
            },
          },
        ],
        to_after_key_up: [
          {
            set_variable: {
              name: "hyper",
              value: 0,
            },
          },
        ],
        to_if_alone: [
          {
            key_code: "escape",
          },
        ],
        type: "basic",
      },
      // {
      //   type: "basic",
      //   description: "Change Command Q to minimize window",
      //   from: {
      //     key_code: "q",
      //     modifiers: {
      //       mandatory: ["left_command"],
      //     },
      //   },
      //   to: [
      //     {
      //       key_code: "m",
      //       modifiers: ["left_command"],
      //     },
      //   ],
      // },
      //      {
      //        type: "basic",
      //        description: "Disable CMD + Tab to force Hyper Key usage",
      //        from: {
      //          key_code: "tab",
      //          modifiers: {
      //            mandatory: ["left_command"],
      //          },
      //        },
      //        to: [
      //          {
      //            key_code: "tab",
      //          },
      //        ],
      //      },
    ],
  },
  ...createHyperSubLayers({
    // b = "B"rowse
    b: {
      y: open("https://youtube.com"),
      c: open("https://crunchyroll.com"),
      r: open("https//rocketmoney.com"),
      l: open("https://ldjam.com"),
      g: open("https://github.com"),
    },
    o: {
      n: app("Obsidian"),
      v: app("Visual Studio Code"),
      d: app("Discord"),
      e: app("Spark Desktop"),
      t: app("Todoist"),
      f: app("Finder"),
      u: app("Unity Hub"),
      m: app("Spotify"),
      a: app("Arc"),
      s: app("Slack"),
      r: app("Rider 2024.1"),
      // "G"ames
      g: app("Steam"),
      c: open("raycast://extensions/raycast/raycast-ai/ai-chat"),
    },

    // s = "System"
    s: {
      m: open("raycast://extensions/raycast/navigation/search-menu-items"),
      u: {
        to: [
          {
            key_code: "volume_increment",
          },
        ],
      },
      j: {
        to: [
          {
            key_code: "volume_decrement",
          },
        ],
      },
      i: {
        to: [
          {
            key_code: "display_brightness_increment",
          },
        ],
      },
      k: {
        to: [
          {
            key_code: "display_brightness_decrement",
          },
        ],
      },
      l: {
        to: [
          {
            key_code: "q",
            modifiers: ["right_control", "right_command"],
          },
        ],
      },
      p: {
        to: [
          {
            key_code: "play_or_pause",
          },
        ],
      },
      semicolon: {
        to: [
          {
            key_code: "fastforward",
          },
        ],
      },
      period: {
        to: [
          {
            key_code: "rewind",
          },
        ],
      },
      e: {
        to: [
          {
            // Emoji picker
            key_code: "spacebar",
            modifiers: ["right_control", "right_command"],
          },
        ],
      },
      // "D"o not disturb toggle
      d: open(`raycast://extensions/yakitrak/do-not-disturb/toggle`),
    },

    // c = Musi*c* which isn't "m" because we want it to be on the left hand
    c: {
      p: {
        to: [{ key_code: "play_or_pause" }],
      },
      n: {
        to: [{ key_code: "fastforward" }],
      },
      b: {
        to: [{ key_code: "rewind" }],
      },
    },
    m: {
      l: open("raycast://extensions/mattisssa/spotify-player/like"),
      d: open("raycast://extensions/mattisssa/spotify-player/dislike"),
      p: open("raycast://extensions/mattisssa/spotify-player/togglePlayPause"),
      open_bracket: open(
        "raycast://extensions/mattisssa/spotify-player/previous"
      ),
      close_bracket: open("raycast://extensions/mattisssa/spotify-player/next"),
      s: open("raycast://extensions/mattisssa/spotify-player/toggleShuffle"),
      r: open("raycast://extensions/mattisssa/spotify-player/cycleRepeat"),
      w: open("raycast://extensions/mattisssa/spotify-player/devices"),
      c: open("raycast://extensions/mattisssa/spotify-player/copyUrl"),
    },
    // r = "Raycast"
    r: {
      e: open(
        "raycast://extensions/raycast/emoji-symbols/search-emoji-symbols"
      ),
      c: open("raycast://extensions/raycast/system/open-camera"),
      p: open("raycast://extensions/raycast/raycast/confetti"),
      h: open(
        "raycast://extensions/raycast/clipboard-history/clipboard-history"
      ),
      1: open(
        "raycast://extensions/VladCuciureanu/toothpick/connect-favorite-device-1"
      ),
      2: open(
        "raycast://extensions/VladCuciureanu/toothpick/connect-favorite-device-2"
      ),
      3: open(
        "raycast://extensions/VladCuciureanu/toothpick/disconnect-favorite-device-1"
      ),
      4: open(
        "raycast://extensions/VladCuciureanu/toothpick/disconnect-favorite-device-2"
      ),
    },
    n: {
      // "D"aily note
      d: open("raycast://extensions/KevinBatdorf/obsidian/dailyNoteCommand"),
      // "S"earch
      s: open("raycast://extensions/KevinBatdorf/obsidian/searchNoteCommand"),
      // "C"reate
      c: open("raycast://extensions/KevinBatdorf/obsidian/createNoteCommand"),
    },
  }),
];

fs.writeFileSync(
  "karabiner.json",
  JSON.stringify(
    {
      global: {
        show_in_menu_bar: false,
      },
      profiles: [
        {
          name: "Default",
          complex_modifications: {
            rules,
          },
        },
      ],
    },
    null,
    2
  )
);
