const fetch = require('node-fetch');

// Test review submission without comment
async function testReviewSubmission() {
  try {
    const reviewData = {
      restaurantId: "507f1f77bcf86cd799439011", // dummy ObjectId
      orderId: "507f1f77bcf86cd799439012", // dummy ObjectId
      rating: 5,
      comment: "", // empty comment
      userId: "507f1f77bcf86cd799439013" // dummy ObjectId
    };

    console.log('Testing review submission with empty comment...');
    console.log('Review data:', reviewData);

    const response = await fetch('http://127.0.0.1:5000/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reviewData)
    });

    const result = await response.json();

    if (response.ok) {
      console.log('Success! Review created:', result);
    } else {
      console.log('Error:', result);
    }
  } catch (error) {
    console.log('Error:', error.message);
  }
}

testReviewSubmission();