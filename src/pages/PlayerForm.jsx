import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PlayerForm = () => {
    const [players, setPlayers] = useState([]);
    const [host, setHost] = useState('');
    const [newPlayer, setNewPlayer] = useState('');
    const navigate = useNavigate();

    // Redirect to scoreboard if players exist in localStorage
    useEffect(() => {
        const storedPlayers = JSON.parse(localStorage.getItem('players')) || [];
        if (storedPlayers.length > 0) {
            navigate('/scoreboard');
        }
    }, [navigate]);

    const addPlayer = () => {
        if (newPlayer && !players.includes(newPlayer)) {
            setPlayers([...players, newPlayer]);
            setNewPlayer('');
        }
    };
    const removePlayer = (playerName) => {
        if (playerName) {
            setPlayers(players.filter((player) => player !== playerName));
        }
    };

    const handleSubmit = () => {
        if (players.length > 0 && host) {
            localStorage.setItem('players', JSON.stringify(players));
            localStorage.setItem('host', host);
            navigate('/scoreboard');
        } else {
            alert('Please add players and select a host.');
        }
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center overflow-auto">
            <div className="flex flex-col items-center bg-white p-10 gap-4 w-full h-full lg:max-w-[600px] lg:max-h-max lg:rounded-lg lg:shadow-md">
                <h1 className="text-center font-semibold text-xl">Enter Players</h1>
                <div className="w-full flex items-center justify-center gap-2">
                    <input
                        className="w-full ring-[1.5px] ring-gray-300 outline-none rounded-full px-3 py-2 font-semibold text-sm flex-1"
                        type="text"
                        placeholder="Enter player name"
                        value={newPlayer}
                        onChange={(e) => setNewPlayer(e.target.value)}
                    />
                    <button
                        className="flex items-center justify-center bg-blue-500 font-semibold text-white text-2xl text-center w-[40px] h-[40px] rounded-full"
                        onClick={addPlayer}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                </div>
                {players && players.length > 0 && (
                    <p className="font-semibold text-sm text-gray-400">Select the host player</p>
                )}
                <ul className="w-full flex flex-col gap-2">
                    {players.map((player) => (
                        <li className="flex items-center" key={player}>
                            <label
                                className="w-full flex items-center border-[1.5px] rounded-md p-2 text-sm"
                                htmlFor={player}
                            >
                                <input
                                    className="mx-2"
                                    type="radio"
                                    name="host"
                                    value={player}
                                    onChange={(e) => setHost(e.target.value)}
                                    id={player}
                                />
                                {player}
                            </label>
                            <button
                                onClick={() => removePlayer(player)}
                                className="mx-1 p-2 font-semibold text-red-500"
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </li>
                    ))}
                </ul>
                <button
                    className="bg-blue-500 p-2 w-[60%] text-white text-sm font-semibold rounded-md"
                    onClick={handleSubmit}
                >
                    Start Game
                </button>
            </div>
        </div>
    );
};

export default PlayerForm;
