import { Link, useNavigate } from "react-router-dom"
import Footer from "../components/Footer"
import { useContext, useState } from "react"
import axios from "axios"
import { URL } from "../url"
import { UserContext } from "../context/UserContext"
import { useUser } from "../context/UserContext"

const ForgotPassword = () => {
  const [email,setEmail]=useState("")
  const [error,setError]=useState(false)
  const navigate=useNavigate()

  const handleSent = async () => {
    try {
      const res = await axios.post(URL + "/api/users/forgotPassword", { email }, { withCredentials: true });
      navigate("/login");
    } catch (err) {
      setError(true);
      console.log(err);
    }
  };
  return (
    <>
      <div className="flex items-center justify-between px-6 md:px-20 py-8 bg-blue-800">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">
          <Link to="/" className="text-white">
            Blog Market
          </Link>
        </h1>
        <h3>
          <Link to="/login" className="text-white font-semibold hover:underline">
            Login
          </Link>
        </h3>
      </div>
      <div className="flex justify-center items-center h-[80vh] bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 w-[80%] md:w-[25%]">
          <h1 className="text-3xl font-bold text-blue-800 mb-6">Reset Your Password</h1>
          <p >Sent password resent link to:</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="w-full my-2 px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-800"
            type="text"
            placeholder="Enter your email"
          />
          <button
            onClick={handleSent}
            className="w-full px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-500 focus:outline-none"
          >
            Sent
          </button>
          {error && <p className="text-red-500 text-sm mt-4">Something went wrong</p>}
          <div className="flex justify-center items-center space-x-1 mt-4 text-gray-600">
            <p>New here?</p>
            <p>
              <Link to="/register" className="text-blue-800 font-semibold hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ForgotPassword;