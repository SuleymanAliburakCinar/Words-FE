import React from 'react';
import './InfoModal.css';

export default function InfoModal({ group, info, onActionClick }) {
  return (
    <div className="info-modal">
      <header className="info-header">
        <h2 className="info-title">{group.name}</h2>
      </header>
      <div className="info-grid">
        <div className="info-item">
          <span className="info-label">Count</span>
          <span className="info-value">{info?.count ?? '???'}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Success Rate</span>
          <span className="info-value">{info?.successRate != null ? `${info.successRate}%` : '???'}</span>
        </div>
      </div>
      <button className="info-action-button" onClick={onActionClick}>
        Enter
      </button>
    </div>
  );
}
