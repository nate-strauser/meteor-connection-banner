Package.describe({
    summary: "A banner that displays when meteor server is disconnected with countdown and reconnect option"
});

Package.on_use(function (api) {
	// CLIENT
  api.use([
    'deps',
    'templating',
    'session']
  , 'client');

    api.add_files(['client/banner.css','client/banner.html','client/banner.js'], 'client');
});
