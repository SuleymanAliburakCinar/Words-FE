import React, { useState, useEffect } from 'react';
import {useParams} from "react-router-dom";
import "./AddWordPage.css";
import "./Popup.css";

function AddWordPage() {

  const [word, setWord] = useState('');
  const [mean, setMean] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('');
  const [words, setWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);

  const {id} = useParams();

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    try {
      const response = await fetch(`http://localhost:8080/words/getByGroupId/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      setWords(data);
    } catch (error) {
      console.error('Kelimeler alınırken hata oluştu', error);
    }
  };

  const addWord = async () => {
    const newWord = { "name": word, "mean": mean, "group": {"id":id} };
    try {
      const response = await fetch('http://localhost:8080/words', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newWord),
      });

      if (response.ok) {
        setPopupMessage('Kelime başarıyla eklendi');
        setPopupType('success');
        setWord('');
        setMean('');
        fetchWords();
      } else {
        setPopupMessage('Kelime eklenirken hata oluştu');
        setPopupType('error');
      }
    } catch (error) {
      setPopupMessage('Bağlantı hatası');
      setPopupType('error');
    }

    setTimeout(() => {
      setPopupMessage('');
      setPopupType('');
    }, 3000);
    setWord("");
    setMean("")
  };

  const updateWord = async () => {
    const newWord = { "name": word, "mean": mean };
    try {
      const response = await fetch('http://localhost:8080/words', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newWord),
      });

      if (response.ok) {
        setPopupMessage('Word updated');
        setPopupType('success');
        setWord('');
        setMean('');
        fetchWords();
      } else {
        setPopupMessage('Error occurred while word updating');
        setPopupType('error');
      }
    } catch (error) {
      setPopupMessage('Connection error');
      setPopupType('error');
    }

    setTimeout(() => {
      setPopupMessage('');
      setPopupType('');
    }, 3000);
    setWord("");
    setMean("")
  };

  const deleteWord = async () => {
    try {
      const response = await fetch(`http://localhost:8080/words/${word}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        setPopupMessage('Word deleted.');
        setPopupType('success');
        setWord('');
        setMean('');
        fetchWords();
      } else {
        setPopupMessage('Error occurred while deleting word');
        setPopupType('error');
      }
    } catch (error) {
      setPopupMessage('Connection Error');
      setPopupType('error');
    }

    setTimeout(() => {
      setPopupMessage('');
      setPopupType('');
    }, 3000);
    setWord("");
    setMean("")
  };

  const saveOrUpdate = () => {
      if(selectedWord && selectedWord.name == word) updateWord();
      else addWord();
  };

  const handleSelectWord = (selected) => {
      if(selected === selectedWord){
        setSelectedWord(null)
        setWord("");
        setMean("");
        return;
      }
      setSelectedWord(selected);
      setWord(selected.name);
      setMean(selected.mean);
  };

  return (
    <div className="add-word-container">
      <div className="input-section">
        <input
          type="text"
          placeholder="Word"
          value={word}
          onChange={(e) => setWord(e.target.value)}
        />
        <input
          type="text"
          placeholder="Mean"
          value={mean}
          onChange={(e) => setMean(e.target.value)}
        />
        <button
          className={`button ${selectedWord ?'update' : ''}`}
          onClick={saveOrUpdate}>
            {selectedWord? 'Update' : 'Save'}
        </button>
        <button
          className={"button delete"}
          onClick={deleteWord}>
            Delete
        </button>
      </div>
      <div className="word-list">
        {words.map((w, index) => (
          <div
            key={index}
            className={`word-item ${selectedWord === w ? 'selected' : ''}`}
            onClick={() => handleSelectWord(w)}
          >
            <strong>{w.name}</strong> : {w.mean}
          </div>
        ))}
      </div>
      {popupMessage && <div className={`popup ${popupType} top-right`}>{popupMessage}</div>}
    </div>
  );
}

export default AddWordPage;
