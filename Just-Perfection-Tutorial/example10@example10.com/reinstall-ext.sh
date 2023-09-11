#!/usr/bin/env bash

set -x

pushd ..
    rm -rf example10@example10.com.shell-extension.zip
    gnome-extensions uninstall example10@example10.com
popd

set -ex

pushd ..
    gnome-extensions pack example10@example10.com
    ls -l example10@example10.com.shell-extension.zip
    gnome-extensions install example10@example10.com.shell-extension.zip

    rm -rf example10@example10.com.shell-extension.zip
popd
