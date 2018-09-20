import { Mongo } from "meteor/mongo";
import { LocalCollection } from "meteor/minimongo";
import { METADATA_COLLECTION } from "./utils";

SubscriptionMetadata = new Mongo.Collection(METADATA_COLLECTION);

function limitQuery(publicationName, where) {
  const ids = SubscriptionMetadata.find(
    {
      collectionName: this._name,
      publicationName
    },
    { sort: { rank: -1 } }
  ).map(doc => doc.documentId);

  if (LocalCollection._selectorIsId(where)) {
    where = { _id: where };
  }

  where = {
    $and: [
      { _id: { $in: ids } },
      where
    ]
  }

  return where;
}

['find', 'findOne'].forEach(method => {
  Meteor.Collection.prototype[method+'FromPublication'] = function(publicationName, where, options) {
    return this[method](limitQuery.call(this, publicationName, where), options);
  };
});