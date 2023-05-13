import {
  layer,
  map,
  rule,
  to$,
  toApp,
  withMapper,
  withModifier,
  writeToProfile,
} from "karabiner.ts";

writeToProfile("--dry-run", [
  rule("Hyper Key (⌃⌥⇧⌘)").manipulators([
    map("⇪").toHyper().toIfAlone("⎋"), //
  ]),

  layer("o", "hyper-o")
    .modifiers("Hyper")
    .description('"Open" applications')
    .manipulators([
      withMapper({
        g: toApp("Google Chrome"),
        c: toApp("Cron"),
        v: toApp("Visual Studio Code"),
        d: toApp("Discord"),
        s: toApp("Slack"),
        e: toApp("Superhuman"),
        n: toApp("Notion"),
        t: toApp("Terminal"),
        // Open todo list managed via *H*ypersonic
        h: to$(
          "open notion://notion.so/stellatehq/Max-Stoiber-CEO-90ea5326add5408f967278461f37c39b#29b31b030a5a4192b05f3883f7d47fe3"
        ),
        z: toApp("zoom.us"),
        m: toApp("Mochi"),
        f: toApp("Figma"),
        r: toApp("Telegram"),
        // "i"Message
        i: toApp("Messages"),
        p: toApp("Spotify"),
        a: toApp("iA Presenter"),
        w: to$("open https://web.whatsapp.com"),
        l: to$("open Linear"),
      })((k, v) => map(k, "any").to(v)),
    ]),

  layer("w", "hyper-w")
    .modifiers("Hyper")
    .description('"Window" via rectangle.app')
    .manipulators([
      withModifier("any")([
        map(";").to("h", "›⌘").description("Window: Hide"),
        map("y").to("←", "›⌥⌃").description("Window: First Third"),
        map("k").to("↑", "›⌘⌥").description("Window: Top Half"),
        map("j").to("↓", "›⌘⌥").description("Window: Bottom Half"),
        map("o").to("→", "›⌥⌃").description("Window: Last Third"),
        map("h").to("←", "‹⌘⌥").description("Window: Left Half"),
        map("l").to("→", "›⌘⌥").description("Window: Right Half"),
        map("f").to("f", "›⌘⌥").description("Window: Full Screen"),
        map("u").to("⇥", "›⌃⇧").description("Window: Previous Tab"),
        map("i").to("⇥", "›⌃").description("Window: Next Tab"),
        map("n").to("`", "›⌘").description("Window: Next Window"),
        map("b").to("[", "›⌘").description("Window: Back"),
        map("m").to("]", "›⌘").description("Window: Forward"), // Note: No literal connection. Both f and n are already taken.
        map("d").to("→", "›⌘⌥⌃").description("Window: Next display"),
      ]),
    ]),

  layer("s", "hyper-s")
    .modifiers("Hyper")
    .description('"System"')
    .manipulators([
      withModifier("any")([
        map("u").to("volume_increment"),
        map("j").to("volume_decrement"),
        map("i").to("display_brightness_increment"),
        map("k").to("display_brightness_decrement"),
        map("l").to("q", "›⌘⌃"),
        map("p").to("play_or_pause"),
        map(";").to("fastforward"),
        map("e").to("␣", "›⌘⌃"), // Emoji picker
        map("y").to$(
          `curl -H 'Content-Type: application/json' --request PUT --data '{ "numberOfLights": 1, "lights": [ { "on": 1, "brightness": 100, "temperature": 215 } ] }' http://192.168.8.84:9123/elgato/lights`
        ), // Turn on Elgato KeyLight
        map("h").to$(
          `curl -H 'Content-Type: application/json' --request PUT --data '{ "numberOfLights": 1, "lights": [ { "on": 0, "brightness": 100, "temperature": 215 } ] }' http://192.168.8.84:9123/elgato/lights`
        ),
      ]),
    ]),

  // v = "moVe" which isn't "m" because we want it to be on the left hand
  // so that hjkl work like they do in vim
  layer("v", "hyper-v")
    .modifiers("Hyper")
    .description("moVe")
    .manipulators([
      withModifier("any")([
        map("h").to("←"),
        map("j").to("↓"),
        map("k").to("↑"),
        map("l").to("→"),
        map("m").to("f", "›⌃"), // Magicmove via homerow.app
        map("s").to("j", "›⌃"), // Scroll mode via homerow.app
        map("d").to("d"),
        map("u").to("page_down"),
        map("i").to("page_up"),
      ]),
    ]),

  // c = Musi*c* which isn't "m" because we want it to be on the left hand
  layer("c", "hyper-v")
    .modifiers("Hyper")
    .description("Musi*c*")
    .manipulators([
      withModifier("any")([
        map("p").to("play_or_pause"),
        map("n").to("fastforward"),
        map("b").to("rewind"),
      ]),
    ]),
]);
