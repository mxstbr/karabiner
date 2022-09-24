# @mxstbr's Karabiner Elements configuration

## Installation

1. Install Karabiner Elements
1. Clone the repository
1. Delete the default `~/.config/karabiner` folder
1. Create a symlink with `ln -s ~/github/mxstbr/karabiner ~/.config`
1. [Restart karabiner_console_user_server](https://karabiner-elements.pqrs.org/docs/manual/misc/configuration-file-path/) with `launchctl kickstart -k gui/`id -u`/org.pqrs.karabiner.karabiner_console_user_server`