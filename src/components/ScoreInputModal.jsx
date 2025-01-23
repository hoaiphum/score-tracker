import React, { useState } from 'react';

const ScoreInputModal = ({ players, host, onSubmit, onCancel }) => {
    const [scores, setScores] = useState(() =>
        players.reduce((acc, player) => {
            if (player !== host) acc[player] = 0;
            return acc;
        }, {}),
    );

    const handleInputChange = (player, value) => {
        // Parse the value as an integer and check for validity
        const parsedValue = value === "" ? "" : parseInt(value, 10);
        
        // Update only if it's a valid number or an empty value
        if (!isNaN(parsedValue) || value === "") {
            setScores({ ...scores, [player]: parsedValue });
        }
    };

    const handleSubmit = () => {
        onSubmit(scores);
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black-rgba flex items-center justify-center">
            <div className="shadow-md bg-white rounded-lg p-3 pb-5 w-[80%] lg:w-[30%] md:w-[40%] flex flex-col items-center gap-3">
                <h2 className="text-center font-semibold text-xl">Enter Scores</h2>
                <div className="w-full flex flex-col justify-between flex-1 px-4 gap-4">
                    <form className="w-full flex flex-col gap-4">
                        {players.map(
                            (player) =>
                                player !== host && (
                                    <div className='flex items-center' key={player}>
                                        <span className='w-[100px] text-sm font-semibold'>
                                            {player}
                                        </span>
                                        <input
                                        className={`flex-1 ring-[1.5px] rounded-md outline-none px-1 text-sm ${scores[player]<0 ? 'ring-red-400' : 'ring-green-400'}`}
                                            type="number"
                                            inputMode="decimal"
                                            value={scores[player] || ''}
                                            onChange={(e) => handleInputChange(player, e.target.value)}
                                            placeholder="Enter score"
                                        />
                                    </div>
                                ),
                        )}
                    </form>
                    <div className="flex justify-end gap-2">
                        <button className='py-2 px-4 bg-blue-500 text-white rounded-md text-sm hover:shadow-lg' onClick={handleSubmit}>Submit</button>
                        <button className='py-2 px-4 bg-gray-500 text-white rounded-md text-sm hover:shadow-lg' onClick={onCancel}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScoreInputModal;
