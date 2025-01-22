import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HistoryModal from './HistoryModal';
import PlayerEditModal from './PlayerEditModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons/faTrashCan';

const Scoreboard = () => {
    const [players, setPlayers] = useState([]);
    const [host, setHost] = useState('');
    const [scores, setScores] = useState({});
    const [round, setRound] = useState(0);
    const [showHistory, setShowHistory] = useState(false);
    const [showPlayerEdit, setShowPlayerEdit] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedPlayers = JSON.parse(localStorage.getItem('players')) || [];
        const storedHost = localStorage.getItem('host') || '';
        const storedScores = JSON.parse(localStorage.getItem('scores')) || {};
        const storedRound = parseInt(localStorage.getItem('round'), 10) || 0;

        setPlayers(storedPlayers);
        setHost(storedHost);

        const initialScores = {};
        storedPlayers.forEach((player) => {
            initialScores[player] = storedScores[player] || 0;
        });
        setScores(initialScores);
        setRound(storedRound);

        if (!localStorage.getItem('history')) {
            localStorage.setItem('history', JSON.stringify([]));
        }
    }, []);

    const addRoundScores = (newScores) => {
        const updatedScores = { ...scores };
        let total = 0;

        players.forEach((player) => {
            if (player !== host) {
                updatedScores[player] += newScores[player] || 0;
                total += newScores[player] || 0;
            }
        });
        updatedScores[host] = -total;
        setScores(updatedScores);
        setRound(round + 1);

        // Save history as a single entry for the round
        const history = JSON.parse(localStorage.getItem('history')) || [];
        const newRoundHistory = {
            round: round + 1,
            scores: { ...newScores, [host]: -total },
        };
        localStorage.setItem('history', JSON.stringify([...history, newRoundHistory]));

        // Save scores and round to localStorage
        localStorage.setItem('scores', JSON.stringify(updatedScores));
        localStorage.setItem('round', round + 1);
    };

    const resetGame = () => {
        if (window.confirm('Are you sure you want to reset the game?')) {
            localStorage.clear();
            navigate('/');
        }
    };

    const updatePlayers = () => {
        const storedPlayers = JSON.parse(localStorage.getItem('players')) || [];
        setPlayers(storedPlayers);

        const updatedScores = {};
        storedPlayers.forEach((player) => {
            updatedScores[player] = scores[player] || 0;
        });
        setScores(updatedScores);
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center overflow-auto">
            <div className="flex flex-col items-center bg-white p-2 pt-0 gap-4 w-full h-full">
                <div className="w-screen bg-blue-600 h-[60px] flex items-center justify-center">
                    <h1 className="text-center font-semibold text-white text-xl">Scoreboard</h1>
                </div>
                <table className="w-full max-w-[600px] border-collapse">
                    <thead className="text-left bg-blue-400">
                        <tr>
                            <th className="text-sm text-white font-semibold py-1 px-2">Player</th>
                            <th className="text-sm text-white font-semibold py-1 px-2">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {players.map((player) => (
                            <tr
                                className="even:bg-gray-100 last-of-type:border-b-2 last-of-type:border-blue-600"
                                key={player}
                            >
                                <td className="py-1 px-2">{player}</td>
                                <td className="py-1 px-2">{scores[player]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button
                    className="bg-yellow-300 w-[300px] h-[40px] rounded-full flex justify-center items-center gap-2"
                    onClick={() => addRoundScores(promptForScores(players, host))}
                >
                    <FontAwesomeIcon className="text-white text-xl" icon={faPlus} />
                    <span className="font-semibold text-sm text-white">Add Round Scores</span>
                </button>
                <button
                    className="bg-yellow-300 w-[300px] h-[40px] rounded-full flex justify-center items-center gap-2"
                    onClick={() => setShowHistory(true)}
                >
                    <FontAwesomeIcon className="text-white text-xl" icon={faList} />
                    <span className="font-semibold text-sm text-white">View History</span>
                </button>
                <button
                    className="bg-yellow-300 w-[300px] h-[40px] rounded-full flex justify-center items-center gap-2"
                    onClick={() => {
                        setShowPlayerEdit(true);
                        updatePlayers();
                    }}
                >
                    <FontAwesomeIcon className="text-white text-xl" icon={faPenToSquare} />
                    <span className="font-semibold text-sm text-white">Edit Players</span>
                </button>
                <button
                    onClick={resetGame}
                    className="bg-yellow-300 w-[300px] h-[40px] rounded-full flex justify-center items-center gap-2"
                >
                    <FontAwesomeIcon className="text-white text-xl" icon={faTrashCan} />
                    <span className="font-semibold text-sm text-white">Reset Game</span>
                </button>
            </div>

            {showHistory && <HistoryModal onClose={() => setShowHistory(false)} />}
            {showPlayerEdit && (
                <PlayerEditModal
                    onClose={() => {
                        setShowPlayerEdit(false);
                        updatePlayers();
                    }}
                />
            )}
        </div>
    );
};

const promptForScores = (players, host) => {
    const newScores = {};
    players.forEach((player) => {
        if (player !== host) {
            let score;
            do {
                const input = prompt(`Enter an integer score for ${player}:`);
                score = parseInt(input, 10);

                if (isNaN(score)) {
                    alert('Invalid input. Please enter an integer.');
                } else {
                    break;
                }
            } while (true);
            newScores[player] = score;
        }
    });
    return newScores;
};

export default Scoreboard;
