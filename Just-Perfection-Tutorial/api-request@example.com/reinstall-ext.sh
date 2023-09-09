#!/usr/bin/env bash

set -x

pushd ..
    rm -rf api-request@example.com.shell-extension.zip
    gnome-extensions uninstall api-request@example.com
popd

set -ex

pushd ..
    gnome-extensions pack api-request@example.com
    ls -l api-request@example.com.shell-extension.zip

    gnome-extensions install api-request@example.com.shell-extension.zip
    rm -rf api-request@example.com.shell-extension.zip
popd
