import React, { useState } from 'react';
import { faClose, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons/faTrashCan';

const HistoryModal = ({ onClose, onUpdateScores, host }) => {
    const history = JSON.parse(localStorage.getItem('history')) || [];
    const [localHistory, setLocalHistory] = useState(history);

    const editRound = (roundIndex) => {
        const updatedScores = { ...localHistory[roundIndex].scores };
        const players = JSON.parse(localStorage.getItem('players'));
        const host = localStorage.getItem('host');

        let total = 0;

        players.forEach((player) => {
            if (player !== host) {
                const newScore = parseInt(
                    prompt(`Enter new score for ${player} (Round ${localHistory[roundIndex].round}):`),
                    10,
                );
                if (!isNaN(newScore)) {
                    updatedScores[player] = newScore;
                    total += newScore;
                }
            }
        });

        // Update host score dynamically
        updatedScores[host] = -total;

        const updatedHistory = [...localHistory];
        updatedHistory[roundIndex] = {
            ...updatedHistory[roundIndex],
            scores: updatedScores,
            modified: true,
        };

        setLocalHistory(updatedHistory);
        localStorage.setItem('history', JSON.stringify(updatedHistory));
        recalculateScores(updatedHistory);
    };

    const deleteRound = (roundIndex) => {
        if (window.confirm(`Are you sure you want to delete round ${roundIndex + 1}?`)) {
            const updatedHistory = [...localHistory];
            updatedHistory[roundIndex].deleted = true;
            setLocalHistory(updatedHistory);
            localStorage.setItem('history', JSON.stringify(updatedHistory));
            recalculateScores(updatedHistory);
        }
    };

    const recalculateScores = (updatedHistory) => {
        const recalculatedScores = {};
        const playersList = JSON.parse(localStorage.getItem('players'));

        // Initialize scores
        playersList.forEach((player) => {
            recalculatedScores[player] = 0;
        });

        // Accumulate scores for valid rounds
        updatedHistory.forEach((round) => {
            if (!round.deleted) {
                Object.keys(round.scores).forEach((player) => {
                    if (player !== host) {
                        recalculatedScores[player] += round.scores[player] || 0;
                    }
                });
            }
        });

        // Recalculate host's score
        recalculatedScores[host] = playersList
            .filter((player) => player !== host)
            .reduce((total, player) => total - recalculatedScores[player], 0);

        // Update localStorage and parent state
        localStorage.setItem('scores', JSON.stringify(recalculatedScores));
        onUpdateScores(recalculatedScores);
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black-rgba flex items-center justify-center">
            <div className="shadow-md bg-white rounded-lg p-3 pb-5 w-[90%] lg:w-[50%] md:w-[80%] flex flex-col items-center min-h-[300px]">
                <div className="flex justify-between w-full mb-2">
                    <h2 className="font-semibold text-xl">Score History</h2>
                    <button className="flex items-center justify-center w-[30px] h-[30px]" onClick={onClose}>
                        <FontAwesomeIcon className="text-xl" icon={faClose} />
                    </button>
                </div>
                <div className="w-full overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="text-left bg-blue-400">
                            <tr>
                                <th className="text-sm text-white font-semibold py-1 px-2">Round</th>
                                {JSON.parse(localStorage.getItem('players')).map((player) => (
                                    <th className="text-sm text-white font-semibold py-1 px-2" key={player}>
                                        {player}
                                    </th>
                                ))}
                                <th className="text-sm text-white font-semibold py-1 px-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {localHistory.map((round, roundIndex) => (
                                <tr
                                    className={`even:bg-gray-100 last-of-type:border-b-2 last-of-type:border-blue-600 ${
                                        round.deleted && 'text-gray-400'
                                    }`}
                                    key={roundIndex}
                                    style={{ textDecoration: round.deleted ? 'line-through' : 'none' }}
                                >
                                    <td className="py-1 px-2">
                                        {round.round}
                                        {round.modified && '*'}
                                    </td>
                                    {JSON.parse(localStorage.getItem('players')).map((player) => (
                                        <td key={player}>{round.scores[player] || 0}</td>
                                    ))}
                                    <td className="py-1 px-2">
                                        {!round.deleted && (
                                            <div className="flex justify-center items-center gap-2">
                                                <button
                                                    className="w-[25px] h-[25px] bg-yellow-400 flex items-center justify-center rounded-full hover:shadow-lg"
                                                    onClick={() => editRound(roundIndex)}
                                                >
                                                    <FontAwesomeIcon
                                                        className="text-white text-sm"
                                                        icon={faPenToSquare}
                                                    />
                                                </button>
                                                <button
                                                    className="w-[25px] h-[25px] bg-red-400 flex items-center justify-center rounded-full hover:shadow-lg"
                                                    onClick={() => deleteRound(roundIndex)}
                                                >
                                                    <FontAwesomeIcon className="text-white text-sm" icon={faTrashCan} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HistoryModal;
