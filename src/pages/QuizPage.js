import React, { useState, useEffect } from 'react';
import { getQuiz, processResult } from '../services/wordApi';
import { getGroups } from '../services/groupApi';
import SummaryCard from '../component/SummaryCard';
import WordCardSlider from '../component/WordCardSlider';
import "./QuizPage.css";

function QuizSetup({ count, setCount, rate, setRate, handleStart, library, setLibrary, libraries }) {
  return (
    <div className="setup-section">
      <label>count</label>
      <input
        type="count"
        value={count}
        onChange={(e) => setCount(e.target.value)}
      />
      <label>Rate</label>
      <input
        type="rate"
        value={rate}
        onChange={(e) => setRate(e.target.value)}
      />
      <label>Library</label>
      <select value={library.id} onChange={(e) => setLibrary(libraries.find(lib => lib.id === Number(e.target.value)))}>
        {libraries.map((lib) => (
          <option key={lib.id} value={lib.id}>{lib.name}</option>
        ))}
      </select>
      <button onClick={handleStart}>Start</button>
    </div>
  );
}

function QuizQuestion({ word, mean, setMean, handleSubmit, feedback }) {
  return (
    <div className="quiz-section">
      <h2>{word}</h2>
      <input
        type="text"
        placeholder="Anlamını girin"
        value={mean}
        onChange={(e) => setMean(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>
      {feedback && <p>{feedback}</p>}
    </div>
  );
}

function QuizPage() {
  const [step, setStep] = useState(1);
  const [count, setCount] = useState('');
  const [rate, setRate] = useState('');
  const [words, setWords] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [mean, setMean] = useState('');
  const [feedback, setFeedback] = useState('');
  const [library, setLibrary] = useState({ "id": 0, "name": "All" });
  const [libraries, setLibraries] = useState([{ "id": 0, "name": "All" }]);
  const [difficulty, setDifficulty] = useState(0.0);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    getLibraries();
  }, []);

  const handleStart = async () => {
    if (!count) {
      alert("Sayı alanı zorunludur!");
      return;
    }

    const body = library.name === "All" ? { "rate": rate, "count": count } : { "rate": rate, "count": count, "groupId": library.id };

    try {
      const response = await getQuiz(body);

      if (response.status !== 200) {
        throw new Error("Failed API Request");
      }

      setWords(response.data.questionList);
      setDifficulty(response.data.difficulty)
      setCount("");
      setRate("");
      setStep(2);
    } catch (error) {
      console.error("API Error", error);
      alert("Error occured");
    }
  };

  const handleSubmit = async () => {
    if (!mean) return;

    if (currentWordIndex === 0) {
      setCards([]);
    }

    const word = words[currentWordIndex];
    let answerList = answers;
    if (mean !== word.mean) {
      setCards(prevCards => [...prevCards, { "name": word.name, "mean": word.mean, "yourAnswer": mean }]);
      answerList = [...answerList, { "wordId": word.id, "result": false }]
    }
    else {
      answerList = [...answerList, { "wordId": word.id, "result": false }]
    }
    setAnswers(answerList);

    if (currentWordIndex + 1 < words.length) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      setCurrentWordIndex(0);
      fetchResult(answerList)
      setStep(3);
    }
    setMean("")
  };

  const getLibraries = async () => {
    try {
      const { data } = await getGroups();
      setLibraries([{ "id": 0, "name": "All" }]);
      setLibraries(libraries.concat(data));
    } catch (error) {
      console.error("API Error:", error);
    }
  }

  const fetchResult = async (answers) => {
    try {
      const response = await processResult(answers);
      if (response.status != 204) {
        console.log("Result couldn't fetch. Response Code:", response.status)
      }
    } catch (error) {
      console.error("API Error", error)
    }
    setAnswers([]);
  }

  return (
    <div className="quiz-container">
      {step === 1 && (
        <QuizSetup
          count={count}
          setCount={setCount}
          rate={rate}
          setRate={setRate}
          handleStart={handleStart}
          library={library}
          setLibrary={setLibrary}
          libraries={libraries}
        />
      )}
      {step === 2 && (
        <QuizQuestion
          word={words[currentWordIndex]?.name || ""}
          mean={mean}
          setMean={setMean}
          handleSubmit={handleSubmit}
          feedback={feedback}
        />
      )}
      {step === 3 && (
        <div>
          <SummaryCard
            correct={words.length - cards.length}
            total={words.length}
            difficulty={difficulty.toFixed(2)}
          />
          <button onClick={() => setStep(4)}>face it</button>
          <button onClick={() => setStep(1)}>return</button>
        </div>
      )}
      {step === 4 && (
        <div>
          <WordCardSlider
            cards={cards}
          />
          <button onClick={() => setStep(1)}>return</button>
        </div>
      )}
    </div>
  );
}

export default QuizPage;