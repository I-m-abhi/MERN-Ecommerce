import { useState } from "react";
import "../componentStyles/Rating.css";

const Rating = ({ value, onRatingChange, disabled }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(value || 0);

  // Handle star hover
  const handleMouseEnter = (rating) => {
    if (!disabled) {
      setHoverRating(rating);
    }
  }

  // Mouse Leave
  const handleMouseLeave = () => {
    if (!disabled) {
      setHoverRating(0);
    }
  }

  // Handle Click
  const handleClick = (rating) => {
    if (!disabled) {
      setSelectedRating(rating);
      if (onRatingChange) {
        onRatingChange(rating);
      }
    }
  }

  // Generate Stars
  const generateStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= (hoverRating || selectedRating);
      stars.push(
        <span
          key={i}
          className={`star ${isFilled ? "filled" : "empty"}`}
          onMouseEnter={()=>handleMouseEnter}
          onMouseLeave={()=>handleMouseLeave}
          onClick={()=>handleClick}
          style={{pointerEvents:disabled ? "none" : "auto"}}
          >★</span>
      )
    }
    return stars;
  }

  return (
    <div>
      <div className="rating">{generateStars()}</div>
    </div>
  )
};

export default Rating;