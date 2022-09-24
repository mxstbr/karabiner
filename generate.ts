import fs from "fs";
import { KarabinerRules, ManipulatorsEntity, ToEntity } from "./types";

/**
 * Create a Hyper + something combination
 */
function hyper(
  key_code: string,
  to: ToEntity[],
  description?: string
): ManipulatorsEntity {
  return {
    description,
    type: "basic",
    from: {
      key_code,
      modifiers: {
        mandatory: [
          "left_command",
          "left_control",
          "left_shift",
          "left_option",
        ],
      },
    },
    to,
  };
}

/**
 * Shortcut to apps
 */
function apps(apps: { [key_code: string]: string }) {
  return Object.keys(apps).map((key) =>
    hyper(
      key,
      [
        {
          shell_command: `open -a '${apps[key]}.app'`,
        },
      ],
      `Hyper + ${key}: ${apps[key]}`
    )
  );
}

const rules: KarabinerRules[] = [
  // Hyper key
  {
    description: "Caps Lock → Hyper Key (⌃⌥⇧⌘) (Escape if alone)",
    manipulators: [
      {
        from: {
          key_code: "caps_lock",
        },
        to: [
          {
            key_code: "left_shift",
            modifiers: ["left_command", "left_control", "left_option"],
          },
        ],
        to_if_alone: [
          {
            key_code: "escape",
          },
        ],
        type: "basic",
      },
    ],
  },
  {
    description: "Hyper layer",
    manipulators: [
      hyper("h", [
        {
          key_code: "left_arrow",
          modifiers: ["right_control", "right_option"],
        },
      ]),
      hyper("l", [
        {
          key_code: "right_arrow",
          modifiers: ["right_control", "right_option"],
        },
      ]),
      ...apps({
        c: "Cron",
        g: "Google Chrome",
        v: "Visual Studio Code",
      }),
    ],
  },
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
            parameters: {
              "basic.simultaneous_threshold_milliseconds": 50,
              "basic.to_delayed_action_delay_milliseconds": 500,
              "basic.to_if_alone_timeout_milliseconds": 1000,
              "basic.to_if_held_down_threshold_milliseconds": 500,
              "mouse_motion_to_scroll.speed": 100,
            },
            rules,
          },
        },
      ],
    },
    null,
    2
  )
);
