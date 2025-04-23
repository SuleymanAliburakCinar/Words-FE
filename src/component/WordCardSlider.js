import React, { useState } from "react";
import WordCard from "./WordCard";
import "./WordCardSlider.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const WordCardSlider = ({ cards }) => {

  const [currentIndex, setCurrentIndex] = useState(0);

  if (!cards || cards.length === 0) {
    return <div className="slider-container">Gösterilecek kart yok.</div>;
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev < cards.length - 1 ? prev + 1 : prev
    );
  };

  return (
    <div className="slider-container">
      {cards.length > 1 && (
        <button className="nav-button left" onClick={handlePrev}>
          <FaChevronLeft />
        </button>
      )}

      <div className="slider">
        {cards.map((card, index) => {
          const position = index - currentIndex;

          if (position < -1 || position > 1) {
            return null;
          }

          const isActive = position === 0;

          return (
            <div
              key={index}
              className={`slide ${isActive ? "active" : ""}`}
              style={{
                transform: `translateX(${position * 60}%) scale(${isActive ? 1 : 0.85
                  })`,
                opacity: isActive ? 1 : 0.6,
              }}
            >
              <WordCard
                word={card.name}
                mean={card.mean}
                wrongAnswer={card.yourAnswer}
              />
            </div>
          );
        })}
      </div>

      {cards.length > 1 && (
        <button className="nav-button right" onClick={handleNext}>
          <FaChevronRight />
        </button>
      )}
    </div>
  );
};

export default React.memo(WordCardSlider);
