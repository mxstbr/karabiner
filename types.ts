export interface KarabinerRules {
  description: string;
  manipulators?: Manipulator[];
}

export interface Manipulator {
  description?: string;
  type: "basic";
  from: From;
  to?: To[];
  to_if_alone?: To[];
}

export interface From {
  key_code: string;
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
