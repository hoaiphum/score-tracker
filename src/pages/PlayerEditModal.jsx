import React, { useState } from 'react';

const PlayerEditModal = ({ onClose }) => {
    const [players, setPlayers] = useState(JSON.parse(localStorage.getItem('players')) || []);

    const addPlayer = () => {
        const newPlayer = prompt('Enter new player name:');
        if (newPlayer && !players.includes(newPlayer)) {
            setPlayers([...players, newPlayer]);
        }
    };

    const removePlayer = (player) => {
        const updatedPlayers = players.filter((p) => p !== player);
        setPlayers(updatedPlayers);
    };

    const saveChanges = () => {
        localStorage.setItem('players', JSON.stringify(players));
        onClose();
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Edit Players</h2>
                <ul>
                    {players.map((player) => (
                        <li key={player}>
                            {player}
                            <button onClick={() => removePlayer(player)}>Remove</button>
                        </li>
                    ))}
                </ul>
                <button onClick={addPlayer}>Add Player</button>
                <button onClick={saveChanges}>Save Changes</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default PlayerEditModal;
