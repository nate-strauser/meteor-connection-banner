Package.describe({
    summary: "A banner that displays when meteor server is disconnected with countdown and reconnect option",
    name: "maxharris9:connection-banner",
    version: "0.5.0",
    git: "https://github.com/nate-strauser/meteor-connection-banner.git"
});

Package.on_use(function (api) {
	api.versionsFrom("METEOR@1.0.1");
	api.use([
    'tracker',
    'templating',
    'reactive-var'
  ],
  'client');

    api.add_files(['client/banner.css', 'client/banner.html', 'client/util.js', 'client/banner.js'], 'client');
});
