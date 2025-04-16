import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import ArtistSignup from "../../components/ArtistSignup";
import OtpVerification from "../../components/OtpVerification";
import ArtistType from "../../components/ArtistType";
import BusinessInfo from "../../components/BusinessInfo";
import ServiceArea from "../../components/ServiceArea";
import MobileVerification from "../../components/MobileVerification";
import config from "../../configs/config";

export default function Signup() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        role: "artist",
        artistType: "",
        serviceAreaName: "",
        address: "",
        mobile: "",
        businessName: "",
    });

    const [errors, setErrors] = useState({}); // Stores validation errors (not backend)
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [verificationToken, setVerificationToken] = useState("");

    const toastConfig = {
        success: {
            duration: 3000,
            icon: '✅',
            style: {
                background: '#10B981',
                color: 'white',
                padding: '16px',
                borderRadius: '10px',
            }
        },
        error: {
            duration: 4000,
            icon: '❌',
            style: {
                background: '#EF4444',
                color: 'white',
                padding: '16px',
                borderRadius: '10px',
            }
        }
    };

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on change
    };

    // Handle Signup (Step 1)
    const handleSignup = async () => {
        const loadingToast = toast.loading('Sending OTP...');
        setLoading(true);
        
        try {
            const response = await fetch(`${config.baseUrl}/api/auth/sendotp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email, role: formData.role }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success('OTP sent successfully! 📧', toastConfig.success);
                setStep(2);
            } else {
                toast.error(data.message || 'Failed to send OTP', toastConfig.error);
            }
        } catch (error) {
            toast.error('Server error. Please try again later.', toastConfig.error);
        } finally {
            toast.dismiss(loadingToast);
            setLoading(false);
        }
    };

    // Handle OTP Verification (Step 2)
    const handleVerifyOtp = async () => {
        if (!otp) {
            toast.error('Please enter OTP', toastConfig.error);
            return;
        }

        const loadingToast = toast.loading('Verifying OTP...');
        setLoading(true);
        
        try {
            const response = await fetch(`${config.baseUrl}/api/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword,
                    otp: otp,
                    role: formData.role,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setVerificationToken(data.token);
                toast.success('OTP verified successfully! 🎉', toastConfig.success);
                setStep(3);
            } else {
                toast.error(data.message || 'Verification failed', toastConfig.error);
            }
        } catch (error) {
            toast.error('Verification failed. Please try again.', toastConfig.error);
        } finally {
            toast.dismiss(loadingToast);
            setLoading(false);
        }
    };

    // Handle Final Submission (Step 6)
    const handleFinalSubmit = async () => {
        const loadingToast = toast.loading('Creating your artist profile...');
        setLoading(true);
        
        try {
            const response = await fetch(`${config.baseUrl}/api/auth/createArtist`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${verificationToken}`
                },
                body: JSON.stringify({
                    name: formData.businessName,
                    artistType: formData.artistType,
                    mobile: formData.mobile,
                    address: formData.serviceAreaName + " " + formData.address,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success('Welcome to ShaadiSync! 🎨', toastConfig.success);
                navigate('/artist/login');
            } else {
                toast.error(data.message || 'Failed to create profile', toastConfig.error);
            }
        } catch (error) {
            toast.error('Profile creation failed. Please try again.', toastConfig.error);
        } finally {
            toast.dismiss(loadingToast);
            setLoading(false);
        }
    };

    return (
        <div>
            {step === 1 && <ArtistSignup formData={formData} handleChange={handleChange} handleSubmit={handleSignup} loading={loading} />}
            {step === 2 && <OtpVerification prevStep={() => setStep(1)} email={formData.email} otp={otp} setOtp={setOtp} handleVerifyOtp={handleVerifyOtp} loading={loading} />}
            {step === 3 && <ArtistType prevStep={() => setStep(2)} nextStep={() => setStep(4)} formData={formData} handleChange={handleChange} />}
            {step === 4 && <BusinessInfo prevStep={() => setStep(3)} nextStep={() =>setStep(5)} formData={formData} handleChange={handleChange} />}
            {step === 5 && <ServiceArea prevStep={() => setStep(4)} nextStep={() => setStep(6)} formData={formData} handleChange={handleChange} />}
            {step === 6 &&
                <MobileVerification
                    prevStep={() => setStep(5)}
                    formData={formData}
                    handleChange={handleChange}
                    loading={loading}
                    handleFinalSubmit={handleFinalSubmit}
                />
            }
        </div>
    );
}
