import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './ConflictResolver.css';

export default function ConflictResolver({ items, options, onDecision, msg }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selected, setSelected] = useState(options.map(() => false));
    const [isDisplayMsg, setIsDisplayMsg] = useState(msg ? true : false);

    if (!items || items.length === 0) {
        return (
            <div className="container">
                <p className="empty">Empty</p>
            </div>
        );
    }

    const currentItem = items[currentIndex];

    const toggleCheckbox = idx => {
        const opt = options[idx];
        setSelected(prev => {
            let copy = [...prev];
            if (opt.exclusive) {
                copy = prev.map((val, i) => {
                    if (options[i].exclusive) {
                        return i === idx ? !prev[idx] : false;
                    }
                    return val;
                });
            } else {
                copy[idx] = !prev[idx];
            }
            return copy;
        });
    };

    const handleSubmit = () => {
        const choices = options
            .filter((opt, idx) => selected[idx] && opt.exclusive === true)
            .map(opt => opt.label);
        if (choices.length === 0) return;
        
        const specialChoice = options.find((opt, idx) => selected[idx] && opt.exclusive === false);
        if (specialChoice) specialChoice.ifSelected(currentIndex, items, choices[0]);
        else onDecision(currentItem, choices[0]);

        const next = currentIndex + 1;
        if (next < items.length) {
            setCurrentIndex(next);
            setSelected(options.map(() => false));
        }
    };

    return (
        isDisplayMsg ? (
            <div className="container">
                <p className="message">{msg}</p>
                <button onClick={() => setIsDisplayMsg(!isDisplayMsg)} className="ok-button">Resolve</button>
            </div>
        )
            : (
                <div className="container">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        className="card"
                    >
                        <div className="item">
                            {currentItem}
                        </div>
                        <div className="options">
                            {options.map((opt, idx) => (
                                <label key={idx} className="checkbox">
                                    <input
                                        type="checkbox"
                                        checked={selected[idx]}
                                        onChange={() => toggleCheckbox(idx)}
                                    />
                                    {opt.label}
                                </label>
                            ))}
                        </div>
                        <button
                            onClick={handleSubmit}
                            className="submit-button"
                            disabled={!selected.some(v => v)}
                        >
                            Onayla
                        </button>
                    </motion.div>
                </div>
            )
    );
}