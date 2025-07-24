import { useState, useEffect } from "react";
import { decode } from "html-entities";

function App() {
    const [welcome, setWelcome] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [shuffledQuestions, setShuffledQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [fetchError, setFetchError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Fetch questions function with error handling
    const fetchQuestions = () => {
        setIsLoading(true);
        setFetchError(null);
        fetch(
            "https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple"
        )
            .then((res) => {
                if (!res.ok) {
                    if (res.status === 429) {
                        throw new Error("Too many requests. Please try again in a moment.");
                    } else {
                        throw new Error("Failed to fetch questions. Please try again.");
                    }
                }
                return res.json();
            })
            .then((data) => {
                setQuestions(data.results);
                setIsLoading(false);
            })
            .catch((err) => {
                setFetchError(err.message);
                setIsLoading(false);
            });
    };

    // Fetch questions once
    useEffect(() => {
        fetchQuestions();
    }, []);

    // Shuffle choices once welcome screen is exited and questions are loaded
    useEffect(() => {
        if (!welcome && questions.length > 0) {
            const shuffledWithChoices = questions.map((q) => ({
                ...q,
                choices: shuffleArray([
                    q.correct_answer,
                    ...q.incorrect_answers,
                ]),
            }));
            setShuffledQuestions(shuffledWithChoices);
        }
    }, [welcome, questions]);

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

    const handleRestart = () => {
        setWelcome(true);
        setSelectedAnswers({});
        setShowResults(false);
        setScore(0);
        setShuffledQuestions([]);
    };

    return (
        <main className="flex-grow flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
            {fetchError && (
                <div className="bg-red-100 border border-red-300 text-red-700 px-6 py-4 rounded-xl shadow mb-6 max-w-md w-full text-center animate-fade-in">
                    <p className="mb-2 font-semibold">{fetchError}</p>
                    <button
                        className="mt-2 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
                        onClick={fetchQuestions}
                    >
                        Retry
                    </button>
                </div>
            )}
            {isLoading && !fetchError && (
                <div className="text-lg text-gray-700 mb-6 animate-pulse">Loading questions...</div>
            )}
            {welcome ? (
                <div className="flex flex-col items-center justify-center min-h-screen w-full">
                    <div className="bg-white/90 rounded-2xl shadow-2xl px-10 py-12 flex flex-col items-center max-w-md mx-auto animate-fade-in">
                        <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-500 drop-shadow-lg text-center leading-[1.2]" style={{ minHeight: '4.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            General Knowledge
                        </h1>
                        <p className="text-lg mb-8 text-gray-700">How much do you know?</p>
                        <button
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 font-semibold text-lg"
                            onClick={() => setWelcome(false)}
                        >
                            Start
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="questions min-h-screen flex flex-col items-center px-4 w-full max-w-3xl mx-auto mt-8">
                        {shuffledQuestions.map((question, index) => (
                            <div
                                className="question w-full bg-white/95 p-7 rounded-2xl shadow-xl mb-8 border border-gray-100 animate-fade-in"
                                key={index}
                            >
                                <p className="text-2xl font-bold mb-5 text-gray-800 flex items-center gap-2">
                                    <span className="inline-block bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-full px-4 py-1 text-lg font-semibold shadow mr-2">
                                        {index + 1}
                                    </span>
                                    {decode(question.question)}
                                </p>
                                <div className="answers grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {question.choices.map((answer) => {
                                        const isSelected = selectedAnswers[index] === answer;
                                        const isCorrect = answer === question.correct_answer;
                                        const isUserWrong = showResults && isSelected && !isCorrect;

                                        let buttonClass = "";
                                        let icon = null;
                                        if (showResults) {
                                            if (isCorrect) {
                                                buttonClass = "bg-green-500/90 text-white border-green-600 shadow-lg";
                                                icon = (
                                                    <svg className="inline w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                );
                                            } else if (isUserWrong) {
                                                buttonClass = "bg-red-500/90 text-white border-red-600 shadow-lg";
                                                icon = (
                                                    <svg className="inline w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                                );
                                            } else {
                                                buttonClass = "border-gray-200 bg-gray-50 text-gray-500";
                                            }
                                        } else {
                                            buttonClass = isSelected
                                                ? "bg-blue-600 text-white border-blue-600 shadow-md scale-105"
                                                : "border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-gray-800";
                                        }

                                        return (
                                            <button
                                                className={`answer border-2 px-5 py-4 rounded-xl transition-all text-left font-medium flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${buttonClass}`}
                                                key={answer}
                                                onClick={() => handleAnswerSelect(index, answer)}
                                                disabled={showResults}
                                            >
                                                {icon}
                                                {decode(answer)}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 text-center mb-10">
                        {!showResults ? (
                            <button
                                className="px-10 py-4 bg-gradient-to-r from-green-500 to-lime-400 text-white rounded-full hover:scale-105 hover:shadow-xl transition-all shadow-lg font-bold text-lg tracking-wide"
                                onClick={handleSubmit}
                            >
                                Submit Answers
                            </button>
                        ) : (
                            <>
                                <div className="flex flex-col items-center mb-6 animate-fade-in">
                                    <div className="mb-2">
                                        <svg className="w-14 h-14 text-green-500 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#22c55e" opacity="0.2" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4 -4" stroke="#22c55e" strokeWidth="2" fill="none" /></svg>
                                    </div>
                                    <p className="text-2xl font-bold mb-2 text-gray-800">
                                        You scored <span className="text-green-600">{score}</span>/{questions.length}
                                    </p>
                                </div>
                                <button
                                    className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-full hover:scale-105 hover:shadow-xl transition-all shadow-lg font-bold text-lg tracking-wide"
                                    onClick={handleRestart}
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
