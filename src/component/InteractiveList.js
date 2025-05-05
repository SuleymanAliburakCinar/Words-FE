import React, { useState, useEffect } from 'react';
import './InteractiveList.css';

export default function InteractiveList({
  items = [],
  multiple = false,
  onSelectionChange,
  listActions = [],
}) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [leftTopButton, setLeftTopButton] = useState([]);
  const [rightBottomButton, setRightBottomButton] = useState([]);

  useEffect(() => {
    setLeftTopButton(listActions.filter(action => action.position === 'left-top'));
    setRightBottomButton(listActions.filter(action => action.position === 'right-bottom'));
  }, [listActions]);

  const toggleItem = (item) => {
    let nextSelected;
    if (multiple) {
      nextSelected = selectedItems.includes(item)
        ? selectedItems.filter(i => i !== item)
        : [...selectedItems, item];
    } else {
      nextSelected = selectedItems.includes(item) ? [] : [item];
    }
    setSelectedItems(nextSelected);
    onSelectionChange && onSelectionChange(nextSelected);
  };

  return (
    <div className="interactive-list">
      {leftTopButton.length > 0 && (
        <div className="list-actions lt">
          {leftTopButton
            .filter(action => action.shouldShow(selectedItems))
            .map((action, idx) => (
              <div key={idx} className="list-action-btn">
                {action.render(selectedItems)}
              </div>
            ))}
        </div>
      )}
      {rightBottomButton.length > 0 && (
        <div className="list-actions rb">
          {rightBottomButton
            .filter(action => action.shouldShow(selectedItems))
            .map((action, idx) => (
              <div key={idx} className="list-action-btn">
                {action.render(selectedItems)}
              </div>
            ))}
        </div>
      )}
      <div className="items-container">
        {items.map(item => (
          <div
            key={item.id}
            className={`list-item ${selectedItems.find(selected => selected.id === item.id) ? 'selected' : ''}`}
            onClick={() => toggleItem(item)}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}