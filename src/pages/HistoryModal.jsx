import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const HistoryModal = ({ onClose }) => {
    const history = JSON.parse(localStorage.getItem('history')) || [];
    const players = JSON.parse(localStorage.getItem('players')) || [];

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black-rgba flex items-center justify-center">
            <div className="modal-content">
                <div className="flex justify-between">
                    <h2 className="font-semibold text-xl">Score History</h2>
                    <button className="flex items-center justify-center w-[30px] h-[30px]" onClick={onClose}>
                        <FontAwesomeIcon className="text-xl" icon={faClose} />
                    </button>
                </div>
                <table className="w-full max-w-[600px] border-collapse overscroll-auto">
                    <thead className="text-left bg-blue-400">
                        <tr>
                            <th className="text-sm text-white font-semibold py-1 px-2">Round</th>
                            {players.map((player) => (
                                <th className="text-sm text-white font-semibold py-1 px-2" key={player}>
                                    {player}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((roundEntry, index) => (
                            <tr
                                className="even:bg-gray-100 last-of-type:border-b-2 last-of-type:border-blue-600"
                                key={index}
                            >
                                <td className="py-1 px-2">{roundEntry.round}</td>
                                {players.map((player) => (
                                    <td className="py-1 px-2" key={player}>
                                        {roundEntry.scores[player] || 0}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HistoryModal;
