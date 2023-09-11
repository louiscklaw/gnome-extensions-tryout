#!/usr/bin/env bash

set -x

rm -rf api-request@example.com.shell-extension.zip

# NOTE: uninstall doesn't matter, gnome may need to be restarted after install.
# force-install may solve 
gnome-extensions uninstall api-request@example.com
