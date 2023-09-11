#!/usr/bin/env bash

set -x

gnome-extensions disable hko-weather@louislabs
gnome-extensions uninstall hko-weather@louislabs
rm -rf ~/.local/share/gnome-shell/extensions/hko-weather@louislabs

set -e

mkdir -p  ~/.local/share/gnome-shell/extensions/hko-weather@louislabs

pushd src
    cp -r . ~/.local/share/gnome-shell/extensions/hko-weather@louislabs/
popd

# echo 
# echo -e "\033[31m restart gnome shell by Alt+F2 \033[0m"
# read -p "Press Enter to continue..."
# echo 
killall -SIGQUIT gnome-shell

gnome-extensions enable hko-weather@louislabs
