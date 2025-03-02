import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';

const ScoreInputModal = ({ players, host, onSubmit, onCancel }) => {
    const betValue = localStorage.getItem('bet') || '';
    const [scores, setScores] = useState(() =>
        players.reduce((acc, player) => {
            if (player !== host) acc[player] = betValue; // Giá trị ban đầu dạng chuỗi
            return acc;
        }, {}),
    );

    const handleInputChange = (player, value) => {
        setScores({ ...scores, [player]: value });
    };
    const handleZero = (player, value) => {
        if (parseInt(scores[player], 10) === 0) {
            setScores({ ...scores, [player]: betValue });
        } else {
            setScores({ ...scores, [player]: '0' });
        }
    };

    const handleMinusClick = (player) => {
        setScores((prevScores) => {
            const currentScore = prevScores[player];
            if (currentScore.startsWith('-')) {
                // Nếu đã có dấu '-', xóa nó
                return { ...prevScores, [player]: currentScore.slice(1) };
            } else {
                if (currentScore === '0') {
                    return { ...prevScores, [player]: `-${betValue}` };
                }
                // Nếu chưa có dấu '-', thêm vào
                return { ...prevScores, [player]: `-${currentScore}` };
            }
        });
    };

    const handleSubmit = () => {
        const parsedScores = Object.fromEntries(
            Object.entries(scores).map(([player, score]) => [player, parseInt(score, 10) || 0]),
        );
        onSubmit(parsedScores);
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black-rgba flex items-center justify-center">
            <div className="shadow-md bg-white rounded-lg p-3 pb-5 lg:w-[30%] flex flex-col items-center gap-3">
                <h2 className="text-center font-semibold text-xl">Enter Scores</h2>
                <div className="w-full flex flex-col justify-between flex-1 px-4 gap-4">
                    <form className="w-full flex flex-col gap-4">
                        {players.map(
                            (player) =>
                                player !== host && (
                                    <div className="flex items-center" key={player}>
                                        <span className="w-[60px] text-sm font-semibold">{player}</span>
                                        <button
                                            className={`w-[20px] h-[20px] rounded-full mr-2 flex items-center justify-center ${
                                                scores[player].startsWith('-') ? 'bg-yellow-400' : 'bg-gray-400'
                                            }`}
                                            type="button"
                                            onClick={() => handleMinusClick(player)}
                                        >
                                            <FontAwesomeIcon className="text-sm text-center" icon={faMinus} />
                                        </button>
                                        <input
                                            className={`flex-1 ring-[1.5px] w-[120px] rounded-md outline-none p-1 text-sm ${
                                                parseInt(scores[player], 10) < 0
                                                    ? 'ring-red-400'
                                                    : parseInt(scores[player], 10) > 0
                                                    ? 'ring-green-400'
                                                    : 'ring-gray-300'
                                            }`}
                                            type="text"
                                            inputMode="numeric"
                                            value={scores[player]}
                                            onChange={(e) => handleInputChange(player, e.target.value)}
                                            placeholder="Enter score"
                                        />
                                        <button
                                            className={`w-[20px] h-[20px] rounded-full ml-2 flex items-center justify-center bg-blue-500`}
                                            type="button"
                                            onClick={() => handleZero(player, '0')}
                                        >
                                            <span className="text-sm text-center text-white">0</span>
                                        </button>
                                    </div>
                                ),
                        )}
                    </form>
                    <div className="flex justify-end gap-2">
                        <button
                            className="py-2 px-4 bg-blue-500 text-white rounded-md text-sm hover:shadow-lg"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                        <button
                            className="py-2 px-4 bg-gray-500 text-white rounded-md text-sm hover:shadow-lg"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScoreInputModal;
