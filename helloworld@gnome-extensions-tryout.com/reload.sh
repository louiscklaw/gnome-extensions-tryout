#!/usr/bin/env bash

set -x

gnome-extensions disable helloworld@gnome-extensions-tryout.com
gnome-extensions uninstall helloworld@gnome-extensions-tryout.com
rm -rf ~/.local/share/gnome-shell/extensions/helloworld@gnome-extensions-tryout.com

set -e

mkdir -p  ~/.local/share/gnome-shell/extensions/helloworld@gnome-extensions-tryout.com

cp -r . ~/.local/share/gnome-shell/extensions/helloworld@gnome-extensions-tryout.com/

# echo 
# echo -e "\033[31m restart gnome shell by Alt+F2 \033[0m"
# read -p "Press Enter to continue..."
# echo 
killall -SIGQUIT gnome-shell

gnome-extensions enable helloworld@gnome-extensions-tryout.com
