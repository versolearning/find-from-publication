export const METADATA_COLLECTION = 'subscriptionMetadata';

export const constructId = (collectionName, publicationName, id) => 
  `${collectionName}-${publicationName}-${id}`;