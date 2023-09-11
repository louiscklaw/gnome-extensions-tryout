#!/usr/bin/env bash

set -x

rm -rf hko-weather@louislabs.com.shell-extension.zip
gnome-extensions disable hko-weather@louislabs.com
gnome-extensions uninstall hko-weather@louislabs.com

set -e

gnome-extensions pack src
ls -l hko-weather@louislabs.com.shell-extension.zip

gnome-extensions install --force hko-weather@louislabs.com.shell-extension.zip
rm -rf hko-weather@louislabs.com.shell-extension.zip

# echo 
# echo -e "\033[31m restart gnome shell by Alt+F2 \033[0m"
# read -p "Press Enter to continue..."
# echo 
killall -SIGQUIT gnome-shell

gnome-extensions enable hko-weather@louislabs.com
