import React, { useState, useEffect } from 'react';
import {useParams} from "react-router-dom";
import { getWordsByGroupId, saveWord, updateWord, deleteWord } from '../services/wordApi';
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
      const {data} = await getWordsByGroupId(id);
      setWords(data);
    } catch (error) {
      console.error('Kelimeler alınırken hata oluştu', error);
    }
  };

  const fetchSaveWord = async () => {
    const newWord = { "name": word, "mean": mean, "groupId": id };
    try {
      const response = await saveWord(newWord)

      if (response.status === 200) {
        setPopupMessage('Word Added');
        setPopupType('success');
        setWord('');
        setMean('');
        fetchWords();
      } else {
        setPopupMessage('Error occured while adding word');
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

  const fetchUpdateWord = async () => {
    const updatedWord = { "name": word, "mean": mean, "groupId": id };
    try {
      const response = await updateWord(selectedWord.id, updatedWord);

      if (response.status === 200) {
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
      setPopupMessage(error.response.data.message ? error.response.data.message : "Connection Error");
      setPopupType('error');
    }

    setTimeout(() => {
      setPopupMessage('');
      setPopupType('');
    }, 3000);
  };

  const fetchDeleteWord = async () => {
    try {
      const response = await deleteWord(selectedWord.id);

      if (response.status === 204) {
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
      if(selectedWord) fetchUpdateWord();
      else fetchSaveWord();
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
        {selectedWord == null ? null :
        (<button
          className={"button delete"}
          onClick={fetchDeleteWord}>
            Delete
        </button>)
        }
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
