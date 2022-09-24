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
 * Custom way to describe a command in a layer
 */
interface LayerCommand {
  to: ToEntity[];
  description?: string;
}

/**
 * Create the Hyper Layer
 */
function createHyperLayer(commands: { [key_code: string]: LayerCommand }) {
  return Object.keys(commands).map((key) =>
    hyper(key, commands[key].to, commands[key].description)
  );
}

/**
 * Open an app layer command
 */
function app(name: string): LayerCommand {
  return {
    to: [
      {
        shell_command: `open -a '${name}.app'`,
      },
    ],
    description: `Open ${name}`,
  };
}

const rules: KarabinerRules[] = [
  // Hyper key
  {
    description: "Hyper Key (⌃⌥⇧⌘)",
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

  // Hyper layer
  {
    description: "Hyper Key layer",
    manipulators: createHyperLayer({
      h: {
        description: "Window: First Third",
        to: [
          {
            key_code: "left_arrow",
            modifiers: ["right_control", "right_option"],
          },
        ],
      },
      l: {
        description: "Window: Last Third",
        to: [
          {
            key_code: "right_arrow",
            modifiers: ["right_control", "right_option"],
          },
        ],
      },
      c: app("Cron"),
      g: app("Google Chrome"),
      v: app("Visual Studio Code"),
    }),
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
