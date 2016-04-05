var METADATA_COLLECTION = 'subscriptionMetadata';

var constructId = function(collectionName, publicationName, id) {
  return collectionName + '-' + publicationName + '-' + id;
};

if (Meteor.isServer) {
  FindFromPublication = {};
  FindFromPublication.publish = function(name, fn) {
    Meteor.publish(name, function() {
      var rank = 0;
      var oldAdded = _.bind(this.added, this);
      var oldRemoved = _.bind(this.removed, this);
      
      this.added = function(collection, id, doc) {
        oldAdded(collection, id, doc);
        
        oldAdded(METADATA_COLLECTION, constructId(collection, name, id), {
          collectionName: collection,
          documentId: id,
          publicationName: name,
          // NOTE: this rank is incremented across all collections
          // probably doesn't matter?
          rank: rank
        });

        rank += 1;
      };
        
      this.removed = function(collection, id) {
        // the only way this can get called is when all documents are removed
        // from the subscription as it's torn down, we know that the underlying document
        // will also be removed, and this will pick it up.
        if (collection === METADATA_COLLECTION)
          return;

        oldRemoved(METADATA_COLLECTION, constructId(collection, name, id));
        oldRemoved(collection, id);
      };
      
      // On Meteor 1.3 data gets removed from the publication on stop.  This will
      // prevent it from calling the remove document when this subscription stops so
      // the data if it is being used by another publication is still present on the
      // client.
      this.onStop(function () {
        this.removed = function (collection, id) {
          // the only way this can get called is when all documents are removed
          // from the subscription as it's torn down, we know that the underlying document
          // will also be removed, and this will pick it up.
          if (collection === METADATA_COLLECTION) {
            return;
          }
          oldRemoved(METADATA_COLLECTION, constructId(collection, name, id));
        };
      });

      
      return fn.apply(this, arguments);
    });
  };
} else {
  SubscriptionMetadata = new Meteor.Collection(METADATA_COLLECTION);
  
  Meteor.Collection.prototype.findFromPublication = function(name, where, options) {
    var ids = SubscriptionMetadata.find({
      collectionName: this._name,
      publicationName: name
    }, {sort: {rank: -1}}).map(function(doc) {
      return doc.documentId;
    });
    where = _.extend({_id: {$in: ids}}, where);
    
    return this.find(where, options);
  };
}
