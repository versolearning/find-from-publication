import { Meteor } from "meteor/meteor";
import { METADATA_COLLECTION, constructId } from "./utils";

export const FindFromPublication = {};

FindFromPublication.publish = function(publicationName, fn) {
  Meteor.publish(publicationName, function() {
    let rank = 0;
    const oldAdded = this.added;
    const oldRemoved = this.removed;

    this.added = (collectionName, documentId, doc) => {
      oldAdded(collectionName, documentId, doc);

      oldAdded(METADATA_COLLECTION, constructId(collectionName, publicationName, documentId), {
        collectionName,
        documentId,
        publicationName,
        // NOTE: this rank is incremented across all collections
        // probably doesn't matter?
        rank
      });

      rank += 1;
    };

    this.removed = (collectionName, documentId) => {
      // the only way this can get called is when all documents are removed
      // from the subscription as it's torn down, we know that the underlying document
      // will also be removed, and this will pick it up.
      if (collectionName === METADATA_COLLECTION) return;

      oldRemoved(METADATA_COLLECTION, constructId(collectionName, publicationName, documentId));
      oldRemoved(collectionName, documentId);
    };

    return fn.apply(this, arguments);
  });
};
