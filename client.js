import { Meteor } from "meteor/meteor";
import { METADATA_COLLECTION } from "./utils";

SubscriptionMetadata = new Meteor.Collection(METADATA_COLLECTION);

function limitQuery(publicationName, where) {
  const ids = SubscriptionMetadata.find(
    {
      collectionName: this._name,
      publicationName
    },
    { sort: { rank: -1 } }
  ).map(doc => doc.documentId);
  where = { _id: { $in: ids }, ...where };
}

['find', 'findOne'].forEach(method => {
  Meteor.Collection.prototype[method+'FromPublication'] = function(publicationName, where, options) {
    return this[method](limitQuery(publicationName, where), options);
  };
});