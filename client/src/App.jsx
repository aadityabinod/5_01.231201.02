import { Route, Routes } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import EmailVerification from "./pages/EmailVerification";
import Login from "./pages/Login";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

export default function App() {
  return (
    <Routes>
      <Route path="/register" element={<RegisterPage/>}/>
      <Route path="/verifyEmail" element={<EmailVerification/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/forgotPassword" element={<ForgotPasswordPage/>}/>

    </Routes>
    
  )
}