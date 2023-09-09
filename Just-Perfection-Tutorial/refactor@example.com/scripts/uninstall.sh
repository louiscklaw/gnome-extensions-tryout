#!/usr/bin/env bash

set -x

rm -rf refactor@example.com.shell-extension.zip
rm -rf /home/logic/.local/share/gnome-shell/extensions/refactor@example.com

sleep 0.1

# NOTE: uninstall doesn't matter, gnome may need to be restarted after install.
# force-install may solve 
gnome-extensions uninstall refactor@example.com
