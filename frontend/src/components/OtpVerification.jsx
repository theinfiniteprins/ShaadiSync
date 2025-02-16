import React from "react";

export default function OtpVerification({ prevStep, email, otp, setOtp, handleVerifyOtp, loading,error}) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#155dfc]/10 via-white to-[#155dfc]/5 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center">
                <h2 className="text-3xl font-bold text-[#155dfc] mb-4">OTP Verification</h2>
                <p className="text-gray-600 text-sm mb-6">
                    Enter the OTP sent to <span className="font-semibold">{email}</span>
                </p>

                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#155dfc] transition"
                />

                <button
                    onClick={handleVerifyOtp}
                    disabled={loading}
                    className="w-full mt-4 py-3 text-white bg-[#155dfc] hover:bg-[#1550e0] rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Verifying..." : "Verify OTP"}
                </button>

                <button onClick={prevStep} className="mt-4 text-[#155dfc] hover:underline text-sm">
                    Back
                </button>
            </div>
        </div>
    );
}
