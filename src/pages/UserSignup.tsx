import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";

export default function UserSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const response = await axios.post(
        "http://localhost:1000/api/user/register",
        { name, email, phoneNumber, password },
        { withCredentials: true }
      );
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 animate-fade-in">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full flex items-center gap-2 justify-center"
            onClick={() =>
              (window.location.href = "http://localhost:1000/api/user/auth/google")
            }
          >
            <FcGoogle size={20} />
            Sign Up with Google
          </Button>

          <Button
            variant="outline"
            className="w-full flex items-center gap-2 justify-center"
            onClick={() =>
              (window.location.href = "http://localhost:1000/api/user/auth/linkedin")
            }
          >
            <FaLinkedin size={20} className="text-blue-700" />
            Sign Up with LinkedIn
          </Button>

          <div>
            <label htmlFor="name" className="text-sm">
              Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="email" className="text-sm">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="text-sm">
              PhoneNumber
            </label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="1234567890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button className="w-full" onClick={handleSignup}>
            Sign Up
          </Button>
        <div className="mt-6 text-center text-sm text-zinc-400">
              Already have an account?{" "}
              <Link 
                to="/user-login" 
                className="font-medium text-blue-500 hover:text-blue-400 transition-colors"
              >
                Login
              </Link>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
