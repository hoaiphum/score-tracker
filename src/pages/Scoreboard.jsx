import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HistoryModal from './HistoryModal';
import PlayerEditModal from './PlayerEditModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons/faTrashCan';
import ScoreInputModal from '../components/ScoreInputModal';

const Scoreboard = () => {
    const [players, setPlayers] = useState([]);
    const [host, setHost] = useState('');
    const [scores, setScores] = useState({});
    const [round, setRound] = useState(0);
    const [showHistory, setShowHistory] = useState(false);
    const [showPlayerEdit, setShowPlayerEdit] = useState(false);
    const navigate = useNavigate();

    const [showScoreInputModal, setShowScoreInputModal] = useState(false);

    useEffect(() => {
        const storedPlayers = JSON.parse(localStorage.getItem('players')) || [];
        const storedHost = localStorage.getItem('host') || '';
        const storedScores = JSON.parse(localStorage.getItem('scores')) || {};
        const history = JSON.parse(localStorage.getItem('history')) || [];

        setRound(history.length)

        setPlayers(storedPlayers);
        setHost(storedHost);

        // Initialize scores
        const initialScores = {};
        storedPlayers.forEach((player) => {
            initialScores[player] = storedScores[player] || 0;
        });

        setScores(initialScores);

        if (!localStorage.getItem('history')) {
            localStorage.setItem('history', JSON.stringify([]));
        }
    }, []);

    const addRoundScores = (newScores) => {
        const updatedScores = { ...scores };
        const history = JSON.parse(localStorage.getItem('history')) || [];
        let roundTotal = 0;

        // Update scores for all players
        players.forEach((player) => {
            if (player !== host) {
                updatedScores[player] += newScores[player] || 0;
                roundTotal += newScores[player] || 0;
            }
        });

        // Calculate the host's score as the negative of the total for others
        updatedScores[host] = players
            .filter((player) => player !== host)
            .reduce((total, player) => total - updatedScores[player], 0);

        // Update state and localStorage
        setScores(updatedScores);
        setRound(round + 1);

        // Save round to history
        const newRoundHistory = { round: round + 1, scores: { ...newScores, [host]: -roundTotal }, modified: false };
        localStorage.setItem('history', JSON.stringify([...history, newRoundHistory]));
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

    const openScoreInputModal = () => {
        setShowScoreInputModal(true);
    };

    const handleScoreSubmit = (newScores) => {
        addRoundScores(newScores);
        setShowScoreInputModal(false);
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
                    className="bg-blue-400 hover:shadow-md w-[300px] h-[40px] rounded-full flex justify-center items-center gap-2"
                    onClick={() => openScoreInputModal()}
                >
                    <FontAwesomeIcon className="text-white text-xl" icon={faPlus} />
                    <span className="font-semibold text-sm text-white">Add Round Scores</span>
                </button>
                <button
                    className="bg-green-400 hover:shadow-md w-[300px] h-[40px] rounded-full flex justify-center items-center gap-2"
                    onClick={() => setShowHistory(true)}
                >
                    <FontAwesomeIcon className="text-white text-xl" icon={faList} />
                    <span className="font-semibold text-sm text-white">View History</span>
                </button>
                <button
                    className="bg-yellow-400 hover:shadow-md w-[300px] h-[40px] rounded-full flex justify-center items-center gap-2"
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
                    className="bg-red-400 hover:shadow-md w-[300px] h-[40px] rounded-full flex justify-center items-center gap-2"
                >
                    <FontAwesomeIcon className="text-white text-xl" icon={faTrashCan} />
                    <span className="font-semibold text-sm text-white">Reset Game</span>
                </button>
            </div>

            {showHistory && (
                <HistoryModal onClose={() => setShowHistory(false)} onUpdateScores={setScores} host={host} />
            )}
            {showPlayerEdit && (
                <PlayerEditModal
                    onClose={() => {
                        setShowPlayerEdit(false);
                        updatePlayers();
                    }}
                />
            )}
            {showScoreInputModal && (
                <ScoreInputModal
                    players={players}
                    host={host}
                    onSubmit={handleScoreSubmit}
                    onCancel={() => setShowScoreInputModal(false)}
                />
            )}
        </div>
    );
};

export default Scoreboard;
