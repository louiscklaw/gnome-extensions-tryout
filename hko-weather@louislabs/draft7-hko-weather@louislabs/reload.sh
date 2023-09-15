#!/usr/bin/env bash

set -x

gnome-extensions disable hko-weather@louislabs.com
gnome-extensions uninstall hko-weather@louislabs.com
rm -rf ~/.local/share/gnome-shell/extensions/hko-weather@louislabs.com

set -e

mkdir -p  ~/.local/share/gnome-shell/extensions/hko-weather@louislabs.com

pushd src
    glib-compile-schemas schemas/
    cp -r . ~/.local/share/gnome-shell/extensions/hko-weather@louislabs.com/
popd

# echo 
# echo -e "\033[31m restart gnome shell by Alt+F2 \033[0m"
# read -p "Press Enter to continue..."
# echo 
killall -SIGQUIT gnome-shell

gnome-extensions enable hko-weather@louislabs.com
