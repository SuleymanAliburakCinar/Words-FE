import React, { useState, useCallback } from 'react';
import './TextDisplayer.css';

export default function TextDisplayer({ isExport, encodedString = '', onImport, onClose }) {

    const [inputValue, setInputValue] = useState('');
    const [copySuccess, setCopySuccess] = useState('');

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(encodedString);
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
            setCopySuccess('Copy Failed');
        }
    }, [encodedString, onClose]);

    const handleImport = useCallback(() => {
        if (onImport) onImport(inputValue);
        setInputValue('');
        onClose();
    }, [inputValue, onImport, onClose]);

    return (
        <div className="container">
            <h2 className="title">
                {isExport ? 'Export' : 'Import'}
            </h2>
            <textarea
                className="textarea"
                rows={4}
                readOnly={isExport}
                placeholder={!isExport ? "Paste here!" : undefined}
                value={isExport ? encodedString : inputValue}
                onChange={!isExport ? (e) => setInputValue(e.target.value) : undefined}
            />

            {isExport ? (
                <>
                    <button onClick={handleCopy} className="button button-copy">
                        Copy
                    </button>
                    {copySuccess && <span className="success-message">{copySuccess}</span>}
                </>
            ) : (
                <button
                    onClick={handleImport}
                    className="button button-import"
                    disabled={!inputValue}
                >
                    Import
                </button>
            )}
            <button onClick={onClose} className="button button-close">
                Close
            </button>
        </div>
    );
};