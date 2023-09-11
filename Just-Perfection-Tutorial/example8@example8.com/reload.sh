#!/usr/bin/env bash

set -x

gnome-extensions disable example8@example8.com
gnome-extensions uninstall example8@example8.com
rm -rf ~/.local/share/gnome-shell/extensions/example8@example8.com

set -e

mkdir -p  ~/.local/share/gnome-shell/extensions/example8@example8.com

cp -r . ~/.local/share/gnome-shell/extensions/example8@example8.com/

# echo 
# echo -e "\033[31m restart gnome shell by Alt+F2 \033[0m"
# read -p "Press Enter to continue..."
# echo 
killall -SIGQUIT gnome-shell

gnome-extensions enable example8@example8.com
