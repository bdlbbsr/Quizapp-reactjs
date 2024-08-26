import React, { useEffect, useState } from "react";
import data from "../../questions.json";
import styles from "./question.module.scss";

const Question = () => {
  const [qAndA, setQAndA] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [progressBar, setProgressBar] = useState(0);
  const totalMark = 100;

  const randomArray = (arrayData) => {
    for (let i = arrayData.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arrayData[i], arrayData[j]] = [arrayData[j], arrayData[i]];
    }
  };

  useEffect(() => {
    randomArray(data.questions);
    setQAndA(data.questions);
    setProgressBar((currentIndex / qAndA.length) * 100);
  }, [currentIndex, qAndA.length]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % qAndA.length);
  };

  const handlePrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + qAndA.length) % qAndA.length
    );
    const progress = ((currentIndex - 1) / qAndA.length) * 100;
    setProgressBar(progress);
  };

  const handleOptionClick = (index) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = index;
    setAnswers(newAnswers);

    if (currentIndex + 1 !== qAndA.length) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % qAndA.length);
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    let totalAnswered = 0;

    answers.forEach((answerIndex, index) => {
      if (answerIndex != null && answerIndex !== undefined) {
        totalAnswered++;
        const question = qAndA[index];
        if (
          question &&
          question.options &&
          question.options[answerIndex] &&
          question.options[answerIndex].isCorrect
        ) {
          correctAnswers++;
        }
      }
    });

    const percentageScore =
      totalAnswered > 0 ? (totalMark / qAndA.length) * correctAnswers : 0;
    setScore(Math.floor(percentageScore));

    setProgressBar("100");
  };

  return (
    <div className="gameBaord shadow-md">
      <div className={styles.quesSection}>
        <div className="flex justify-between">
          <button
            className={`${styles.arrowBtn} ${score ? "noVisible" : ""}`}
            onClick={handlePrevious}
            disabled={currentIndex === 0}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="currentColor"
              className="bi bi-chevron-left"
              viewBox="0 0 16 16">
              <path
                fillRule="evenodd"
                d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
              />
            </svg>
          </button>

          <p>
            <span className="text-2xl font-medium text-gray-800">
              {currentIndex + 1}
            </span>
            <span className="text-xl font-medium text-gray-400">
              /{qAndA.length}
            </span>
          </p>

          <button
            className={styles.arrowBtn}
            onClick={handleNext}
            disabled={currentIndex === qAndA.length - 1}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="currentColor"
              className="bi bi-chevron-right"
              viewBox="0 0 16 16">
              <path
                fillRule="evenodd"
                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
              />
            </svg>
          </button>
        </div>

        <div className="relative pt-6 pb-10">
          <div className="progress-bar-border">
            <div
              style={{ width: progressBar + "%" }}
              className="progress-bar flex flex-col text-center whitespace-nowrap text-white justify-center bg-pink-500"></div>
          </div>
        </div>
        {!score && qAndA.length > 0 && (
          <div className="mb-8">
            <p className={`${styles.question} animate-fade`}>
              {qAndA[currentIndex].question}
            </p>

            {currentIndex === qAndA.length - 1 && (
              <div className="text-center mt-8">
                <button
                  onClick={calculateScore}
                  className="finishBtn">
                  Do you want to finish now?
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {!score && qAndA.length > 0 && (
        <div className={styles.ansSection}>
          <ul>
            {qAndA[currentIndex].options.map((option, index) => (
              <li
                key={index}
                className={
                  answers[currentIndex] === index
                    ? `${styles.ansOptions} ${styles.active}`
                    : `${styles.ansOptions}`
                }
                onClick={() => handleOptionClick(index)}>
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {score > 0 && (
        <div className={styles.quesSection}>
          <p className={styles.question}>Total Mark : {totalMark}</p>
          <p className={styles.question}>Passmark : {data?.passmark}</p>
          <p className={styles.question}>Your mark: {score}</p>
        </div>
      )}
    </div>
  );
};

export default Question;
