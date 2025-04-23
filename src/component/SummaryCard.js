import React from "react";
import "./SummaryCard.css";

const SummaryCard = ({ correct, total, difficulty }) => {

  return (
    <div className="card-container">
      <div className="summary-card">
        <h2 className="summary-title">📜 Quiz Summary</h2>
        <p className="summary-info">❓ Total Question: <strong>{total}</strong></p>
        <p className="summary-info">✅ Correct Answer: <strong>{correct}</strong></p>
        <p className="summary-info">📊 Success Rate: <strong>%{(correct / total * 100).toFixed(2)}</strong></p>
        <p className="summary-info">🔥 Difficulty: <strong>{difficulty}</strong></p>
      </div>
    </div>
  );
};

export default React.memo(SummaryCard);