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
    spacebar: open(
      "raycast://extensions/stellate/mxstbr-commands/create-notion-todo"
    ),
    // b = "B"rowse
    b: {
      s: {
        to: [
          // open new Litte Arc
          {
            key_code: "n",
            modifiers: ["left_command", "left_option"],
          },
        ],
      },
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
      f: app("Finder"),
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
    },

    // Window management via Yabai
    // Shift Layer gives access to routine window management
    // Control Layer gives access to more advanced window management
    left_shift: {
      m: yabai(["space --focus main"]), // m for main
      n: yabai(["space --focus sub"]), // sub-main
      t: yabai(["space --focus text"]), // t for texts
      w: yabai(["space --focus terminal"]), // w for warp
      d: yabai(["space --focus figma"]), // d for design
      c: yabai(["space --focus code"]), // c for code
      r: yabai(["space --rotate 90"]),
      comma: yabai(["space --focus prev"]), // <
      period: yabai(["space --focus next"]), // >
      slash: yabai(["window --toggle float", "window --grid 8:8:1:1:6:6"]),
      quote: yabai(["window --toggle split"]),
      j: yabai(["window --focus prev"]),
      k: yabai(["window --focus next"]),
      f: yabai(["window --toggle zoom-fullscreen"]),
      l: yabai(["window --display next", "display --focus next"]),
      0: yabai(["space --balance"]),
      z: yabai(["space --focus recent"]),
    },
    left_control: {
      m: yabai(["window --space main", "space --focus main"]),
      n: yabai(["window --space sub", "space --focus sub"]),
      t: yabai(["window --space text", "space --focus text"]),
      w: yabai(["window --space terminal", "space --focus terminal"]),
      d: yabai(["window --space figma", "space --focus figma"]),
      c: yabai(["window --space code", "space --focus code"]),
    },

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
    },

    // v = "moVe" which isn't "m" because we want it to be on the left hand
    // so that hjkl work like they do in vim
    v: {
      h: {
        to: [{ key_code: "left_arrow" }],
      },
      j: {
        to: [{ key_code: "down_arrow" }],
      },
      k: {
        to: [{ key_code: "up_arrow" }],
      },
      l: {
        to: [{ key_code: "right_arrow" }],
      },
      // Magicmove via homerow.app
      m: {
        to: [{ key_code: "f", modifiers: ["right_control"] }],
      },
      // Scroll mode via homerow.app
      s: {
        to: [{ key_code: "j", modifiers: ["right_control"] }],
      },
      d: {
        to: [{ key_code: "d", modifiers: ["right_shift", "right_command"] }],
      },
      u: {
        to: [{ key_code: "page_down" }],
      },
      i: {
        to: [{ key_code: "page_up" }],
      },
    },

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
