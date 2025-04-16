import React from 'react';
import toast from 'react-hot-toast';

export default function ArtistSignup({ formData, handleChange, handleSubmit, loading }) {
    const onSubmit = (e) => {
        e.preventDefault();
        
        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }

        // If passwords match, proceed with submission
        handleSubmit();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#155dfc]/10 via-white to-[#155dfc]/5">
            <div className="max-w-md w-full m-4">
                <div className="bg-white p-8 rounded-2xl shadow-2xl space-y-8">
                    <h2 className="text-center text-3xl font-extrabold text-[#155dfc]">Artist Signup</h2>
                    <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#155dfc] transition"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#155dfc] transition"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    minLength={6}
                                />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    className={`appearance-none relative block w-full px-4 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#155dfc] transition ${
                                        formData.confirmPassword && formData.password !== formData.confirmPassword
                                            ? 'border-red-500'
                                            : 'border-gray-300'
                                    }`}
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    minLength={6}
                                />
                                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-500">
                                        Passwords do not match
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading || (formData.confirmPassword && formData.password !== formData.confirmPassword)}
                                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#155dfc] hover:bg-[#1550e0] focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Processing..." : "Sign Up"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
