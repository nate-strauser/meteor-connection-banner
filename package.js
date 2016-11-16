Package.describe({
    summary: "A banner that displays when meteor server is disconnected with countdown and reconnect option",
    name: "natestrauser:connection-banner",
    version: "0.5.2",
    git: "https://github.com/nate-strauser/meteor-connection-banner.git"
});

Package.on_use(function (api) {
	api.versionsFrom("METEOR@1.4.2.1");
	api.use([
        'ecmascript',
        'tracker',
        'templating@1.2.14_1',
        'reactive-var'
      ],
      'client');

    api.add_files(['client/banner.css', 'client/banner.html', 'client/util.js', 'client/banner.js'], 'client');
});
