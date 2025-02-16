import { useState, useEffect } from "react";
import config from "../configs/config";

export default function ArtistType({ prevStep, nextStep, formData, handleChange }) {
    const [artistTypes, setArtistTypes] = useState([]);
    const [selectedArtistId, setSelectedArtistId] = useState(formData.artistType || "");
    const [error, setError] = useState(""); // Error state

    useEffect(() => {
        const fetchArtistTypes = async () => {
            try {
                const response = await fetch(`${config.baseUrl}/api/artist-types/`);
                if (!response.ok) throw new Error("Failed to fetch artist types");

                const data = await response.json();
                setArtistTypes(data);
            } catch (error) {
                setError(error.message);
            }
        };
        fetchArtistTypes();
    }, []);

    const handleSelectArtist = (artist_id) => {
        setSelectedArtistId(artist_id);
        setError(""); // Clear error when selecting an artist
        handleChange({ target: { name: "artistType", value: artist_id } });
    };

    const handleNext = () => {
        if (!selectedArtistId) {
            setError("Please select an artist type.");
            return;
        }
        nextStep();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#155dfc]/10 via-white to-[#155dfc]/5">
            <div className="max-w-2xl w-full m-4">
                <div className="bg-white p-8 rounded-2xl shadow-2xl space-y-6">
                    <h2 className="text-center text-3xl font-extrabold text-[#155dfc]">Select Your Artist Type</h2>

                    {/* Display error if artist types fail to load */}
                    {error && <p className="text-center text-red-500">{error}</p>}

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {artistTypes.length > 0 ? (
                            artistTypes.map((artist) => (
                                <div
                                    key={artist._id}
                                    className={`p-4 border rounded-lg cursor-pointer transition transform hover:scale-105 hover:shadow-md ${
                                        selectedArtistId === artist._id
                                            ? "border-[#155dfc] ring-2 ring-[#155dfc]"
                                            : "border-gray-300"
                                    }`}
                                    onClick={() => handleSelectArtist(artist._id)}
                                >
                                    <img
                                        src={artist.typeimg}
                                        alt={artist.type}
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                    <p className="text-center mt-2 font-medium">{artist.type}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center col-span-2 sm:col-span-3 text-gray-500">
                                {error ? "Error loading artist types" : "Loading artist types..."}
                            </p>
                        )}
                    </div>

                    {/* Error message for selection */}
                    {error && !artistTypes.length && <p className="text-center text-red-500">{error}</p>}
                    {error && artistTypes.length > 0 && <p className="text-center text-red-500">{error}</p>}

                    <div className="flex justify-between">
                        <button
                            onClick={prevStep}
                            className="px-6 py-3 text-[#155dfc] border border-[#155dfc] rounded-lg font-medium transition hover:bg-[#155dfc]/10"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={!artistTypes.length}
                            className="px-6 py-3 text-white bg-[#155dfc] hover:bg-[#1550e0] rounded-lg font-medium transition disabled:bg-gray-300"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
