const { Soup, Atk, Clutter, GLib, GObject, Shell, St, Gio } = imports.gi;

var helloworld = () => {
  log('helloworld');
};

var helloworld_var = 'test test test';
var helloworld_const = 'hello constant';

var helloworld_constructor = GObject.registerClass(
  class HelloConstructor extends St.Widget {
    _init() {
      log('hello constructor');
    }
  },
);
