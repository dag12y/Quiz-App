import { useState, useEffect } from "react";
import questions from "./data";
import { decode } from "html-entities";

function App() {
    let [welcome, setWelcome] = useState(true);
    let [selectedAnswers, setSelectedAnswers] = useState({});
    let [shuffledQuestions, setShuffledQuestions] = useState([]);

    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);




    useEffect(() => {
        if (!welcome) {
            const shuffledWithChoices = questions.map((q) => {
                return {
                    ...q,
                    choices: shuffleArray([
                        q.correct_answer,
                        ...q.incorrect_answers,
                    ]),
                };
            });
            setShuffledQuestions(shuffledWithChoices);
        }
    }, [welcome]);

    const handleAnswerSelect = (questionIndex, answer) => {
        if (showResults) return; 
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionIndex]: answer,
        }));
    };

    const handleSubmit = () => {
        let correctCount = 0;
        shuffledQuestions.forEach((question, index) => {
            if (selectedAnswers[index] === question.correct_answer) {
                correctCount++;
            }
        });
        setScore(correctCount);
        setShowResults(true);
    };


    const questionsHTML = shuffledQuestions.map((question, index) => {
        return (
            <div
                className="question w-full max-w-2xl bg-white p-6 rounded-lg shadow-md mb-6"
                key={index}
            >
                <p className="text-xl font-semibold mb-4 text-gray-800">
                    {index + 1}. {decode(question.question)}
                </p>
                <div className="answers grid grid-cols-1 md:grid-cols-2 gap-3">
                    {question.choices.map((answer) => {
                        const isSelected = selectedAnswers[index] === answer;
                        const isCorrect = answer === question.correct_answer;
                        const isUserWrong =
                            showResults && isSelected && !isCorrect;

                        const buttonClass = showResults
                            ? isCorrect
                                ? "bg-green-500 text-white border-green-600"
                                : isUserWrong
                                ? "bg-red-500 text-white border-red-600"
                                : "border-gray-300"
                            : isSelected
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-300 hover:bg-blue-50 hover:border-blue-200";

                        return (
                            <button
                                className={`answer border-2 px-4 py-3 rounded-lg transition-all text-left ${buttonClass}`}
                                key={answer}
                                onClick={() =>
                                    handleAnswerSelect(index, answer)
                                }
                            >
                                {decode(answer)}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    });

    return (
        <main className="flex-grow flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 w-full">
            {welcome ? (
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <h1 className="text-4xl font-bold mb-4">
                        General Knowledge
                    </h1>
                    <p className="text-lg mb-6">How much do you know?</p>
                    <button
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
                        onClick={() => {
                            setWelcome(false);
                        }}
                    >
                        Start
                    </button>
                </div>
            ) : (
                <>
                    <div className="questions min-h-screen bg-gray-50 flex flex-col">
                        {questionsHTML}
                    </div>
                    <div className="mt-10 text-center">
                        {!showResults ? (
                            <button
                                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow hover:shadow-md font-medium"
                                onClick={handleSubmit}
                            >
                                Submit Answers
                            </button>
                        ) : (
                            <>
                                <p className="text-xl font-semibold mb-4">
                                    You scored {score}/{questions.length}
                                </p>
                                <button
                                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow hover:shadow-md font-medium"
                                    onClick={() => {
                                        setWelcome(true);
                                        setSelectedAnswers({});
                                        setShowResults(false);
                                        setScore(0);
                                    }}
                                >
                                    Play Again
                                </button>
                            </>
                        )}
                    </div>
                </>
            )}
        </main>
    );
}

export default App;
