// TODO -- make a package out of this, reuse together with publications package

var Future = Npm.require('fibers/future');

var runPublication = function(user, name/*, arguments */) {
  var pub = Meteor.server.publish_handlers[name];
  
  var future = new Future;
  var results = {};
  // NOTE: changed/removed not implemented, will throw error
  var sub = {
    userId: user._id,
    ready: function() {
      future.return(results);
    },
    added: function(collectionName, id, doc) {
      results[collectionName] = results[collectionName] || {};
      results[collectionName][id] = doc;
    },
    removed: function(collectionName, id) {
      delete results[collectionName][id];
    }
  }
  
  var args = Array.prototype.slice.call(arguments, 2);
  pub.apply(sub, args);
  
  return future.wait();
}

FindFromPublication.publish('tracked', function() {
  this.added('posts', 'post-1', {foo: 'bar'});
  this.added('posts', 'post-2', {foo: 'bar'});
  this.added('comments', 'comments-1', {});
  this.ready();
});

Meteor.publish('not-tracked', function() {
  this.added('posts', 'post-1', {foo: 'bar'});
  this.added('posts', 'post-2', {foo: 'bar'});
  this.added('comments', 'comments-1', {});
  this.ready();
});



Tinytest.add('FindFromPublication - publish - correct metadata is published', function(test) {
  var records = runPublication({}, 'tracked');
  test.equal(_.keys(records.posts).length, 2);
  test.equal(_.keys(records.comments).length, 1);
  test.equal(_.keys(records.subscriptionMetadata).length, 3);
});

Tinytest.add('FindFromPublication - publish - metadata is not published for default pubs', function(test) {
  var records = runPublication({}, 'not-tracked');
  test.equal(_.keys(records.posts).length, 2);
  test.equal(_.keys(records.comments).length, 1);
  test.isUndefined(records.subscriptionMetadata);
});