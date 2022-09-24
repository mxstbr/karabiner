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
 * Create a Hyper Key sublayer, where every command is prefixed with a key
 * e.g. Hyper + O ("Open") is the "open applications" layer, I can press
 * e.g. Hyper + O + G ("Google Chrome") to open Chrome
 */
function createHyperSubLayer(
  sublayer_key: string,
  commands: { [key_code: string]: LayerCommand }
): Manipulator[] {
  const subLayerVariableName = `hyper_sublayer_${sublayer_key}`;
  return [
    // When Hyper + sublayer_key is pressed, set the variable to true; on key_up, set it to false again
    {
      description: `Toggle Hyper sublayer ${sublayer_key}`,
      type: "basic",
      from: {
        key_code: sublayer_key,
        modifiers: {
          mandatory: [
            "left_command",
            "left_control",
            "left_shift",
            "left_option",
          ],
        },
      },
      to_after_key_up: [
        {
          set_variable: {
            name: subLayerVariableName,
            value: false,
          },
        },
      ],
      to: [
        {
          set_variable: {
            name: subLayerVariableName,
            value: true,
          },
        },
      ],
    },
    ...Object.keys(commands).map((command_key) => ({
      ...commands[command_key],
      type: "basic" as const,
      from: {
        key_code: command_key,
        // Without this, it doesn't work.
        modifiers: {
          optional: ["any"],
        },
      },
      // Only trigger this command if the variable is true (i.e., if Hyper + sublayer is held)
      conditions: [
        {
          type: "variable_if",
          name: subLayerVariableName,
          value: true,
        },
      ],
    })),
  ];
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
    description: 'Hyper Key sublayer: O ("Open")',
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
    description: 'Hyper Key sublayer: W ("Window")',
    manipulators: createHyperSubLayer("w", {
      h: {
        description: "Window: First Third",
        to: [
          {
            // NOTE: Requires Rectangle v60+
            shell_command:
              'open -g "rectangle://execute-action?name=first-third"',
          },
        ],
      },
      l: {
        description: "Window: Last Third",
        to: [
          {
            // NOTE: Requires Rectangle v60+
            shell_command:
              'open -g "rectangle://execute-action?name=last-third"',
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
