import React, { useState } from 'react';

const PlayerEditModal = ({ onClose }) => {
    const [players, setPlayers] = useState(JSON.parse(localStorage.getItem('players')) || []);

    const addPlayer = () => {
        const newPlayer = prompt('Enter new player name:');
        if (newPlayer && !players.includes(newPlayer)) {
            const updatedPlayers = [...players, newPlayer];
            setPlayers(updatedPlayers);
            localStorage.setItem('players', JSON.stringify(updatedPlayers));
        }
    };

    const removePlayer = (player) => {
        const updatedPlayers = players.filter((p) => p !== player);
        setPlayers(updatedPlayers);
        localStorage.setItem('players', JSON.stringify(updatedPlayers));
    };

    const saveChanges = () => {
        onClose();
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black-rgba flex items-center justify-center">
            <div className="modal-content">
                <h2 className="font-semibold text-xl">Edit Players</h2>
                <span className="font-semibold text-red-500">(This feature under development)</span>
                <ul>
                    {players.map((player) => (
                        <li key={player}>
                            {player}
                            <button onClick={() => removePlayer(player)}>Remove</button>
                        </li>
                    ))}
                </ul>
                <div className="">
                    <button
                        className="py-2 px-4 bg-blue-500 text-white rounded-md text-sm hover:shadow-lg"
                        onClick={addPlayer}
                    >
                        Add Player
                    </button>
                    <button
                        className="py-2 px-4 bg-blue-500 text-white rounded-md text-sm hover:shadow-lg"
                        onClick={saveChanges}
                    >
                        Save Changes
                    </button>
                    <button
                        className="py-2 px-4 bg-blue-500 text-white rounded-md text-sm hover:shadow-lg"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlayerEditModal;
