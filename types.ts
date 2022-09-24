export interface KarabinerRules {
  description: string;
  manipulators?: ManipulatorsEntity[] | null;
}
export interface ManipulatorsEntity {
  description?: string;
  type: "basic";
  from: From;
  to?: ToEntity[] | null;
  to_if_alone?: ToIfAloneEntityOrToEntity[] | null;
}
export interface From {
  key_code: string;
  modifiers?: Modifiers;
}
export interface Modifiers {
  optional?: string[] | null;
  mandatory?: string[] | null;
}
export interface ToEntity {
  key_code?: string | null;
  modifiers?: string[] | null;
  mouse_key?: MouseKey | null;
  pointing_button?: string | null;
  shell_command?: string | null;
}
export interface MouseKey {
  x?: number | null;
  horizontal_wheel?: number | null;
  y?: number | null;
  vertical_wheel?: number | null;
}
export interface ToIfAloneEntityOrToEntity {
  key_code: string;
}
