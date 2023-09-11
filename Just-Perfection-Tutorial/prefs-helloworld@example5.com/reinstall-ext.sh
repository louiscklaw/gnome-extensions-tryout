#!/usr/bin/env bash

set -x

pushd ..
    rm -rf prefs-helloworld@example5.com.shell-extension.zip
    gnome-extensions uninstall prefs-helloworld@example5.com
popd

set -ex

pushd ..
    gnome-extensions pack prefs-helloworld@example5.com
    # ls -l prefs-helloworld@example5.com.shell-extension.zip

    # gnome-extensions install prefs-helloworld@example5.com.shell-extension.zip
    # rm -rf prefs-helloworld@example5.com.shell-extension.zip
popd
