#!/usr/bin/env bash

set -x

rm -rf api-request@example.com.shell-extension.zip
gnome-extensions disable api-request@example.com
gnome-extensions uninstall api-request@example.com

set -e

gnome-extensions pack src
ls -l api-request@example.com.shell-extension.zip

gnome-extensions install --force api-request@example.com.shell-extension.zip
rm -rf api-request@example.com.shell-extension.zip

# echo 
# echo -e "\033[31m restart gnome shell by Alt+F2 \033[0m"
# read -p "Press Enter to continue..."
# echo 
killall -SIGQUIT gnome-shell

gnome-extensions enable api-request@example.com
