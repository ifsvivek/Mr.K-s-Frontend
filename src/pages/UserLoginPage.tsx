import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin } from "react-icons/fa";
import axios from 'axios';
import { Link } from "react-router-dom";

export default function UserLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:1000/api/user/login",
        { email, password },
        { withCredentials: true }
      );
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 animate-fade-in">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">User Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full flex items-center gap-2 justify-center"
            onClick={() => window.location.href = "http://localhost:1000/api/user/auth/google"}
          >
            <FcGoogle size={20} />
            Continue with Google
          </Button>

          <Button
            variant="outline"
            className="w-full flex items-center gap-2 justify-center"
            onClick={() => window.location.href = "http://localhost:1000/api/user/auth/linkedin"}
          >
            <FaLinkedin size={20} className="text-blue-700" />
            Continue with LinkedIn
          </Button>

          <div>
            <label htmlFor="email" className="text-sm">Email</label>
            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label htmlFor="password" className="text-sm">Password</label>
            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <Button className="w-full" onClick={handleLogin}>
            Login
          </Button>
          <div className="mt-6 text-center text-sm text-zinc-400">
            Need an user account?{" "}
            <Link 
              to="/user-signup" 
              className="font-medium text-blue-500 hover:text-blue-400 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
