import React, { useState, useEffect } from 'react';
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
  const [words, setWords] = useState([]); // Örnek kelime
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [mean, setMean] = useState('');
  const [feedback, setFeedback] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [library, setLibrary] = useState({"id":0, "name":"All"});
  const [libraries, setLibraries] = useState([{"id":0, "name":"All"}]);

  useEffect(() => {
    getLibraries();
  }, []);

  const handleStart = async () => {
    if (!count) {
      alert("Sayı alanı zorunludur!");
      return;
    }

    const url = library.name === "All" ? "http://localhost:8080/words/getByRate" : "http://localhost:8080/words/getByRateAndGroup";
    const body = library.name === "All" ? {"rate":rate, "count":count} : {"rate":rate, "count":count, "groupId": library.id};

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error("API isteği başarısız!");
      }

      const data = await response.json();
      setWords(data);
      setStep(2);
    } catch (error) {
      console.error("API Hatası:", error);
      alert("Veri alınırken hata oluştu!");
    }
  };

  const handleSubmit = async () => {
    if (!mean) return;
    try {
      const response = await fetch("http://localhost:8080/words/checkAnswer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: words[currentWordIndex].name,
          mean: mean
        })
      });
      const result = await response.json();
      if (result) {
        setCorrectAnswers(correctAnswers + 1);
      }
      setFeedback(result ? "Doğru!" : "Yanlış!");
      setTimeout(() => {
        setFeedback("");
        setMean("");
        if (currentWordIndex + 1 < words.length) {
          setCurrentWordIndex(currentWordIndex + 1);
        } else {
          const successRate = ((correctAnswers / words.length) * 100).toFixed(2);
          alert(`Quiz Completed! Success Rate: ${successRate}%`);
          setCorrectAnswers(0);
          setStep(1);
        }
      }, 1500);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const getLibraries = async () => {
    try{
      const response = await fetch('http://localhost:8080/groups', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      setLibraries([{"id":0, "name":"All"}]);
      setLibraries(libraries.concat(data));
    } catch (error) {
      console.error("API Error:", error);
    }
  }

  return (
    <div className="quiz-container">
      {step === 1 ? (
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
      ) : (
        <QuizQuestion
          word={words[currentWordIndex]?.name || ""}
          mean={mean}
          setMean={setMean}
          handleSubmit={handleSubmit}
          feedback={feedback}
        />
      )}
    </div>
  );
}

export default QuizPage;