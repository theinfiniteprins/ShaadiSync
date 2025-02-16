import { useState } from "react";

export default function MobileVerification({ prevStep, formData, handleChange, handleFinalSubmit }) {
    const [error, setError] = useState(""); // Error state

    const validateAndSubmit = () => {
        const mobileRegex = /^[6-9]\d{9}$/; // Validates Indian 10-digit numbers (starting with 6-9)

        if (!formData.mobile.trim()) {
            setError("Mobile number is required.");
            return;
        }
        if (!mobileRegex.test(formData.mobile)) {
            setError("Enter a valid 10-digit mobile number.");
            return;
        }

        setError(""); // Clear error if valid
        handleFinalSubmit();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#155dfc]/10 via-white to-[#155dfc]/5">
            <div className="max-w-md w-full m-4">
                <div className="bg-white p-8 rounded-2xl shadow-2xl space-y-6">
                    <h2 className="text-center text-3xl font-extrabold text-[#155dfc]">Mobile Number</h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Enter Mobile Number</label>
                        <input
                            type="text"
                            name="mobile"
                            value={formData.mobile}
                            onChange={(e) => {
                                handleChange(e);
                                setError(""); // Clear error on input change
                            }}
                            placeholder="Enter mobile number"
                            className="border p-2 rounded w-full"
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>

                    <div className="flex justify-between">
                        <button
                            onClick={prevStep}
                            className="px-6 py-3 text-[#155dfc] border border-[#155dfc] rounded-lg font-medium transition hover:bg-[#155dfc]/10"
                        >
                            Back
                        </button>
                        <button
                            onClick={validateAndSubmit}
                            className="px-6 py-3 text-white bg-[#155dfc] hover:bg-[#1550e0] rounded-lg font-medium transition"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
