const mongoose = require('mongoose');
const Review = require('./models/Review');
const ObjectId = mongoose.Types.ObjectId;
const id = new ObjectId();
const review = new Review({
  user: id,
  restaurant: id,
  order: id,
  rating: 4,
  comment: ''
});
const err = review.validateSync();
console.log('Validation error:', err ? err.message : 'none');
console.log('Comment path options:', Review.schema.path('comment').options);
console.log('Error details:', err && err.errors ? Object.keys(err.errors).map(k => [k, err.errors[k].message]) : null);
