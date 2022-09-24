import fs from "fs";
import { KarabinerRules, Manipulator, To } from "./types";

/**
 * Custom way to describe a command in a layer
 */
interface LayerCommand {
  to: To[];
  description?: string;
}

/**
 * Create a Hyper + {key_code} trigger
 */
function hyper(key_code: string, command: LayerCommand): Manipulator {
  return {
    description: command.description,
    to: command.to,
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
  };
}

/**
 * Create the Hyper Layer
 */
function createHyperLayer(commands: { [key_code: string]: LayerCommand }) {
  return Object.keys(commands).map((key) => hyper(key, commands[key]));
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
      d: app("Discord"),
      s: app("Slack"),
      e: app("Superhuman"),
      n: app("Notion"),
      t: app("Terminal"),
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
            rules,
          },
        },
      ],
    },
    null,
    2
  )
);
