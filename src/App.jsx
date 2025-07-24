import { useState } from "react";
import questions from './data'
import { decode } from "html-entities";

function App() {
    let [welcome,setWelcome]=useState(true)

    function shuffleArray(array) {
        const shuffled = [...array]; // Copy the array to avoid mutating the original
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // Random index
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap
        }
        return shuffled;
    }

    let questionsHTML = questions.map((question,index)=>{
        let choices = shuffleArray([question.correct_answer,...question.incorrect_answers])

        return (
            <div
                className="question w-full max-w-2xl bg-white p-6 rounded-lg shadow-md mb-6"
                key={index}
            >
                <p className="text-xl font-semibold mb-4 text-gray-800">
                    {index + 1}. {decode(question.question)}
                </p>
                <div className="answers grid grid-cols-1 md:grid-cols-2 gap-3">
                    {choices.map((answer) => {
                        return (
                            <button
                                className="answer border-2 px-4 py-3 rounded-lg transition-all "
                                key={answer}
                            >
                                {decode(answer)}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
})
    return (
        <main className="flex-grow flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 w-full">
            {welcome ? (
                <div className="flex flex-col items-center justify-center min-h-screen ">
                    <h1 className="text-4xl font-bold mb-4">
                        General Knowledge
                    </h1>
                    <p className="text-lg mb-6">How much do you know?</p>
                    <button
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
                        onClick={() => {
                            setWelcome(!welcome);
                        }}
                    >
                        Start
                    </button>
                </div>
            ) : (
                <div className="questions min-h-screen bg-gray-50 flex flex-col">
                    {questionsHTML}
                </div>
            )}
            ;
        </main>
    );}

export default App;
