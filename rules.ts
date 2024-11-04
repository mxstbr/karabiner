import fs from "fs";
import { KarabinerRules } from "./types";
import { createHyperSubLayers, app, open, yabai, raycast } from "./utils";

const rules: KarabinerRules[] = [
  // Caps Lock to F18
  {
    description: "Caps Lock -> F18",
    manipulators: [
      {
        description: "Caps Lock -> F18",
        from: {
          key_code: "caps_lock",
          modifiers: {
            optional: ["any"],
          },
        },
        to: [
          {
            key_code: "f18",
          },
        ],
        type: "basic",
      },
    ],
  },
  // Define the Hyper key itself
  {
    description: "Hyper Key (⌃⌥⇧⌘)",
    manipulators: [
      {
        description: "Right Command -> Hyper Key",
        from: {
          key_code: "right_command",
          modifiers: {
            optional: ["any"],
          },
        },
        to: [
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
      {
        description: "Right Option -> Hyper Key",
        from: {
          key_code: "right_option",
          modifiers: {
            optional: ["any"],
          },
        },
        to: [
          {
            key_code: "left_command",
            modifiers: ["left_shift", "left_option", "left_control"],
          },
        ],
        type: "basic",
      },
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
  // Actual Hyper Key
  ...createHyperSubLayers({
    spacebar: raycast(
      "raycast://extensions/raycast/navigation/search-menu-items"
    ),
    // b = "B"rowse
    b: {
      // s = "S"earch
      s: {
        to: [
          // open new Litte Arc
          {
            key_code: "n",
            modifiers: ["left_command", "left_option"],
          },
        ],
      },
      g: open("https://github.com"),
      // t: open("https://twitter.com"),
      // // Quarterly "P"lan
      // p: open("https://qrtr.ly/plan"),
      // y: open("https://news.ycombinator.com"),
      // f: open("https://facebook.com"),
      // r: open("https://reddit.com"),
    },
    // o = "Open" applications
    o: {
      // Num
      1: app("1Password"),
      // QWER
      // q:
      w: app("Arc"), // W for Web
      // e:
      // r:
      t: app("Warp"), // T for Terminal
      // ASDF
      // a:
      // s:
      d: app("Docker"), // D for Docker
      f: {
        to: [
          {
            shell_command:
              "osascript -e 'tell application \"Finder\" to make new Finder window' -e 'tell application \"Finder\" to activate'",
          },
        ],
      },
      g: app("Figma"),
      // ZXCV
      z: app("Zed"),
      // x:
      c: app("Visual Studio Code"), // C for Code
      // v:
      b: app("Beeper"),
      // OTHERS
      k: app("KakaoTalk"),
      p: open("https://github.com/pulls"),
      // d: app("Discord"),
      // s: app("Slack"),
      // e: app("Superhuman"),
      // n: app("Notion"),
      // Open todo list managed via *H*ypersonic
      // h: open(
      //   "notion://www.notion.so/stellatehq/7b33b924746647499d906c55f89d5026"
      // ),
      // z: app("zoom.us"),
      // "M"essages
      // m: app("Texts"),
      // r: app("Texts"),
      // "i"Message
      // i: app("Texts"),
      // p: app("Spotify"),
      // a: app("iA Presenter"),
      // "W"hatsApp has been replaced by Texts
      // w: open("Texts"),
      // l: open(
      //   "raycast://extensions/stellate/mxstbr-commands/open-mxs-is-shortlink"
      // ),
      tab: {
        to: [
          {
            key_code: "grave_accent_and_tilde",
            modifiers: ["left_command"],
          },
        ],
      },
    },

    // Window management via Yabai
    // Shift Layer gives access to routine window management
    // Control Layer gives access to more advanced window management
    right_shift: {
      y: raycast("raycast://extensions/raycast/raycast/confetti"),
      r: yabai(["space --rotate 90"]),
      q: yabai(["window --focus prev"]),
      e: yabai(["window --focus next"]),
      w: yabai(["window --display next", "display --focus next"]),
      a: yabai(["space --focus prev"]),
      s: yabai(["window --display prev", "display --focus prev"]),
      d: yabai(["space --focus next"]),
      f: yabai(["window --toggle zoom-fullscreen"]),
      z: yabai(["space --focus recent"]),
      x: yabai(["window --toggle split"]),
      c: yabai(["window --toggle float", "window --grid 8:8:1:1:6:6"]),
      0: yabai(["space --balance"]),
      1: yabai(["space --focus 1"]), // w for warp
      2: yabai(["space --focus 2"]), // d for design
      3: yabai(["space --focus 3"]), // c for code
      4: yabai(["space --focus 4"]), // m for main
      5: yabai(["space --focus 5"]), // sub-main
      6: yabai(["space --focus 6"]), // t for texts
      tab: {
        to: [
          {
            key_code: "grave_accent_and_tilde",
            modifiers: ["left_command"],
          },
        ],
      },
    },
    slash: {
      1: yabai(["window --space 1", "space --focus 1"]),
      2: yabai(["window --space 2", "space --focus 2"]),
      3: yabai(["window --space 3", "space --focus 3"]),
      4: yabai(["window --space 4", "space --focus 4"]),
      5: yabai(["window --space 5", "space --focus 5"]),
      6: yabai(["window --space 6", "space --focus 6"]),
      a: yabai(["window --space prev", "space --focus prev"]),
      d: yabai(["window --space next", "space --focus next"]),
    },
    // Yabai Quick Access
    left_arrow: yabai(["space --focus prev"]),
    right_arrow: yabai(["space --focus next"]),

    // r = "Raycast"
    r: {
      // n: open("raycast://script-commands/dismiss-notifications"),
      // l: open(
      //   "raycast://extensions/stellate/mxstbr-commands/create-mxs-is-shortlink"
      // ),
      // e: open(
      //   "raycast://extensions/raycast/emoji-symbols/search-emoji-symbols"
      // ),
      // c: open("raycast://extensions/raycast/system/open-camera"),
      y: raycast("raycast://extensions/raycast/raycast/confetti"),
      p: raycast("raycast://extensions/thomas/color-picker/pick-color"),
      c: raycast("raycast://extensions/mooxl/coffee/caffeinateToggle"),
      t: raycast("raycast://extensions/huzef44/screenocr/recognize-text"),
      // a: open("raycast://extensions/raycast/raycast-ai/ai-chat"),
      // s: open("raycast://extensions/peduarte/silent-mention/index"),
      h: open(
        "raycast://extensions/raycast/clipboard-history/clipboard-history"
      ),
      k: raycast(
        "raycast://extensions/huzef44/keyboard-brightness/toggle-keyboard-brightness"
      ),
      m: raycast("raycast://extensions/Hugo-Persson/duckduckgo-email/index"),
      // 1: open(
      //   "raycast://extensions/VladCuciureanu/toothpick/connect-favorite-device-1"
      // ),
      // 2: open(
      //   "raycast://extensions/VladCuciureanu/toothpick/connect-favorite-device-2"
      // ),
    },

    // uTilities
    t: {
      p: {
        // pokeclicker
        to: [
          {
            shell_command:
              "cat ~/Developer/pokeclicker-stuff/AutoClicker.js | pbcopy",
          },
        ],
      },
      d: {
        // A Dark Room
        to: [
          {
            shell_command:
              "cat ~/Developer/pokeclicker-stuff/ADarkRoom.js | pbcopy",
          },
        ],
      },
    },

    // v = "moVe" which isn't "m" because we want it to be on the left hand
    // so that hjkl work like they do in vim
    // v: {
    //   h: {
    //     to: [{ key_code: "left_arrow" }],
    //   },
    //   j: {
    //     to: [{ key_code: "down_arrow" }],
    //   },
    //   k: {
    //     to: [{ key_code: "up_arrow" }],
    //   },
    //   l: {
    //     to: [{ key_code: "right_arrow" }],
    //   },
    //   // Magicmove via homerow.app
    //   m: {
    //     to: [{ key_code: "f", modifiers: ["right_control"] }],
    //   },
    //   // Scroll mode via homerow.app
    //   s: {
    //     to: [{ key_code: "j", modifiers: ["right_control"] }],
    //   },
    //   d: {
    //     to: [{ key_code: "d", modifiers: ["right_shift", "right_command"] }],
    //   },
    //   u: {
    //     to: [{ key_code: "page_down" }],
    //   },
    //   i: {
    //     to: [{ key_code: "page_up" }],
    //   },
    // },

    // c = Musi*c* which isn't "m" because we want it to be on the left hand
    // c: {
    //   p: {
    //     to: [{ key_code: "play_or_pause" }],
    //   },
    //   n: {
    //     to: [{ key_code: "fastforward" }],
    //   },
    //   b: {
    //     to: [{ key_code: "rewind" }],
    //   },
    // },
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
