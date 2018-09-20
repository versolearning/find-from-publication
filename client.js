import { Meteor } from "meteor/meteor";
import { METADATA_COLLECTION } from "./utils";

SubscriptionMetadata = new Meteor.Collection(METADATA_COLLECTION);

Meteor.Collection.prototype.findFromPublication = function(publicationName, where, options) {
  const ids = SubscriptionMetadata.find(
    {
      collectionName: this._name,
      publicationName
    },
    { sort: { rank: -1 } }
  ).map(doc => doc.documentId);
  where = { _id: { $in: ids }, ...where };
  return this.find(where, options);
};
