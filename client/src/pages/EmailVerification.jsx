import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../provider/UserContext";
import toast from "react-hot-toast";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(""); // Single string for the 6-digit code
  const navigate = useNavigate();

  const { error, loading, verifyEmail } = useUserContext();

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
    if (value.length <= 6) {
      setCode(value); // Update the code state
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast.error("Please enter a 6-digit code.");
      return;
    }

    try {
      await verifyEmail(code); // Call verifyEmail with the 6-digit code
      toast.success("Email verified successfully");
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to verify email");
    }
  };

  // Auto-submit when the code length is 6
  useEffect(() => {
    if (code.length === 6) {
      handleSubmit(new Event("submit"));
    }
  }, [code]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
        <p className="mb-4 text-gray-600">
          Enter the 6-digit code sent to your email address.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center">
            <input
              type="text"
              value={code}
              onChange={handleChange}
              placeholder="123456"
              className="w-64 h-12 text-center text-2xl font-bold bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              maxLength={6}
              autoFocus
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailVerificationPage;