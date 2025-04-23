import React from "react";
import "./WordCard.css";

const WordCard = ({word, mean, wrongAnswer}) => {

  return (
    <div className="word-card">
      <p className="word">❓ {word}</p>
      <p className="mean">✅ {mean}</p>
      <p className="wrong-answer">❌ {wrongAnswer}</p>
    </div>
  );
};

export default React.memo(WordCard);