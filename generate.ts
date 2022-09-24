import fs from "fs";
import { KarabinerRules, Manipulator, To } from "./types";

// JSON does not support Infinity, so this is to "fake" that
const JSON_INFINITY_MS = 9999999999;

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
 * Create a Hyper Key sublayer, where every command is prefixed with a key
 * e.g. Hyper + O ("Open") is the "open applications" layer, I can press
 * e.g. Hyper + O + G ("Google Chrome") to open Chrome
 */
function createHyperSubLayer(
  sublayer_key: string,
  commands: { [key_code: string]: LayerCommand }
): Manipulator[] {
  return Object.keys(commands).map((command_key) => ({
    ...commands[command_key],
    type: "basic",
    parameters: {
      // By combining "infinity" simultanous threshold with key_down_order strict,
      // I can press e.g. Hyper + O > G relatively slowly; since the Hyper key is
      // unique anyway, this works great for my use cases to create hyper "sub layers"
      "basic.simultaneous_threshold_milliseconds": JSON_INFINITY_MS,
    },
    from: {
      simultaneous_options: {
        key_down_order: "strict",
      },
      simultaneous: [
        {
          key_code: sublayer_key,
        },
        {
          key_code: command_key,
        },
      ],
      modifiers: {
        mandatory: [
          "left_command",
          "left_control",
          "left_shift",
          "left_option",
        ],
      },
    },
  }));
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
  // Define the Hyper key itself
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
  {
    description: 'Hyper Key sublayer: O ("Open") ',
    manipulators: createHyperSubLayer("o", {
      g: app("Google Chrome"),
      c: app("Cron"),
      v: app("Visual Studio Code"),
      d: app("Discord"),
      s: app("Slack"),
      e: app("Superhuman"),
      n: app("Notion"),
      t: app("Terminal"),
    }),
  },
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
