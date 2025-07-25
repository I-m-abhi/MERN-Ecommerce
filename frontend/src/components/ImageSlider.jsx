import { useEffect, useState } from "react";
import "../componentStyles/ImageSlider.css";

const ImageSlider = () => {
  const images = [
    "./images/banner1.jpg",
    "./images/banner2.jpg",
    "./images/banner3.jpg",
    "./images/banner4.jpg",
    "./images/banner5.jpg",
    "./images/banner6.jpg",
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  // console.log(currentIndex)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000)

    return () => clearInterval(interval);
  }, [])

  return (
    <div className="image-slider-container">
      <div className="slider-images" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {images.map((image, index) =>
        (<div className="slider-item" key={index}>
          <img src={image} alt={`Slider${index + 1}`} />
        </div>))}
      </div>

      <div className="slider-dots">
        {images.map((_, index) => (
          <span key={index} className={`dot ${index === currentIndex ? "active" : ""}`} onClick={()=> setCurrentIndex(index)}  />
        ))}
      </div>
    </div>
  )
};

export default ImageSlider;