Package.describe({
  summary: "Enable finding all documents that have been published by a given publication"
});

Package.on_use(function (api, where) {
  api.add_files('find-from-publication.js', ['client', 'server']);
  api.export('FindFromPublication', 'server');
});

Package.on_test(function (api) {
  api.use('find-from-publication');
  api.add_files('find-from-publication_tests.js', ['client', 'server']);
});
