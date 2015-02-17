Package.describe({
  summary: "Enable finding all documents that have been published by a given publication"
});

Package.onUse(function (api, where) {
  api.use('underscore');
  api.add_files('find-from-publication.js', ['client', 'server']);
  api.export('FindFromPublication', 'server');
});

Package.onTest(function (api) {
  api.use(['tinytest', 'find-from-publication']);
  api.add_files('find-from-publication_tests.js', 'server');
});
