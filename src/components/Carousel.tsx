import { useState, useEffect } from "react";
import carousel1 from "../assets/1.jpeg";
import carousel2 from "../assets/2.jpeg";
import carousel3 from "../assets/3.jpeg";
import carousel4 from "../assets/4.jpeg";
import carousel5 from "../assets/5.jpeg";

const images = [carousel1, carousel2, carousel3, carousel4, carousel5];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="carousel">
      <div className="carousel__container">
        <button
          className="carousel__nav carousel__nav--prev"
          onClick={goToPrev}
          aria-label="Anterior"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <div
          className="carousel__track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="carousel__slide">
              <img
                src={image}
                alt={`Teresópolis - Imagem ${index + 1}`}
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>

        <button
          className="carousel__nav carousel__nav--next"
          onClick={goToNext}
          aria-label="Próximo"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      <div className="carousel__dots">
        {images.map((_, index) => (
          <button
            key={index}
            className={`carousel__dot ${index === currentIndex ? "carousel__dot--active" : ""}`}
            onClick={() => goToSlide(index)}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
