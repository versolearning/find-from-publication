Package.describe({
  name: 'percolate:find-from-publication',
  version: '0.2.0',
  summary: 'Enable finding all documents that have been published by a given publication',
  git: 'https://github.com/percolatestudio/find-from-publication.git'
});

Package.onUse(function (api, where) {
  api.versionsFrom('METEOR@1.7');
  api.use(['ecmascript', 'meteor', 'minimongo', 'mongo']);
  api.mainModule('server.js', 'server');
  api.mainModule('client.js', 'client');
  api.export('FindFromPublication', 'server');
});

Package.onTest(function (api) {
  api.use(['ecmascript', 'meteor', 'tinytest', 'percolate:find-from-publication']);
  api.addFiles('find-from-publication_tests.js', 'server');
});
