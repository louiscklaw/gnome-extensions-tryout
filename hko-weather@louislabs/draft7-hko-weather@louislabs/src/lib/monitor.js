const { Atk, Clutter, GLib, GObject, Shell, St } = imports.gi;
const PopupMenu = imports.ui.popupMenu;
const Main = imports.ui.main;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();


var HkoMonitor = GObject.registerClass(

    {},
    class HkoMonitorBase extends St.Widget {
        _init() {
            super._init()
        }
    }
)
