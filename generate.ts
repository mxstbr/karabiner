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
        modifiers: {
          // Mandatory modifiers are *not* added to the "to" event
          mandatory: ["any"],
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
        description: "Caps Lock -> Hyper Key",
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
      {
        type: "basic",
        description: "Disable CMD + Tab to force Hyper Key usage",
        from: {
          key_code: "tab",
          modifiers: {
            mandatory: ["left_command"],
          },
        },
        to: [
          {
            key_code: "tab",
          },
        ],
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
            key_code: "left_arrow",
            modifiers: ["right_option", "right_control"],
          },
        ],
      },
      l: {
        description: "Window: Last Third",
        to: [
          {
            key_code: "right_arrow",
            modifiers: ["right_option", "right_control"],
          },
        ],
      },
    }),
  },
  {
    description: 'Hyper Key sublayer: S ("System")',
    manipulators: createHyperSubLayer("s", {
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
    }),
  },
  {
    // We don't choose M because then the right hand couldn't press hj anymore
    // so this sublayer key has to be on the left hand
    description: 'Hyper Key sublayer: V ("MoVement")',
    manipulators: createHyperSubLayer("v", {
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
      m: {
        to: [{ key_code: "f", modifiers: ["right_control"] }],
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
