#!/usr/bin/env bash

set -x

gnome-extensions disable example9@example9.com
gnome-extensions uninstall example9@example9.com
rm -rf ~/.local/share/gnome-shell/extensions/example9@example9.com

set -e

mkdir -p  ~/.local/share/gnome-shell/extensions/example9@example9.com

cp -r . ~/.local/share/gnome-shell/extensions/example9@example9.com/

# echo 
# echo -e "\033[31m restart gnome shell by Alt+F2 \033[0m"
# read -p "Press Enter to continue..."
# echo 
killall -SIGQUIT gnome-shell

gnome-extensions enable example9@example9.com
