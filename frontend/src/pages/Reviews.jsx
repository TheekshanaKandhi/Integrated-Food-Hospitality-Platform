import { useEffect, useState } from "react";
import axios from "axios";

function Reviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5000/api/reviews");
        setReviews(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div>
      <h2>Reviews Page</h2>

      {reviews.length === 0 ? (
        <p>No reviews found.</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review._id}>
              <strong>{review.user.name}</strong> reviewed{" "}
              <strong>{review.restaurant.name}</strong> - {review.rating}/5 -{" "}
              {review.comment}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Reviews;