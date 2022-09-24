export interface KarabinerRules {
  description?: string;
  manipulators?: Manipulator[];
}

export interface Manipulator {
  description?: string;
  type: "basic";
  from: From;
  to?: To[];
  to_if_alone?: To[];
  parameters?: Parameters;
}

export interface Parameters {
  "basic.simultaneous_threshold_milliseconds"?: number;
}

export interface SimultaneousFrom {
  key_code: string;
}

export interface SimultaneousOptions {
  key_down_order?: "insensitive" | "strict" | "strict_inverse";
}

export interface From {
  key_code?: string;
  simultaneous?: SimultaneousFrom[];
  simultaneous_options?: SimultaneousOptions;
  modifiers?: Modifiers;
}

export interface Modifiers {
  optional?: string[];
  mandatory?: string[];
}

export interface To {
  key_code?: string;
  modifiers?: string[];
  shell_command?: string;
}
