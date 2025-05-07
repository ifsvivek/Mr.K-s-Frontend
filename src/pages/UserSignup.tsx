import { useState, useContext } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin } from "react-icons/fa";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "@/Context/AuthContext";
import { toast } from "sonner";

export default function UserSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { loginAsUser } = useContext(AuthContext);

  const handleSignup = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/register",
        { name, email, phoneNumber, password },
        { withCredentials: true }
      );

      const { user, token } = response.data;

      // Log in user immediately after registration
      loginAsUser(user, token);
      
      // Show success message
      toast.success("Account created successfully! Redirecting to dashboard...");
      
      // Navigate directly to dashboard
      navigate("/dashboard", { replace: true }); // Using replace to prevent going back to signup
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:5000/api/user/auth/google";
    // The AuthCallback component will handle the redirect to dashboard
  };

  const handleLinkedInSignup = () => {
    window.location.href = "http://localhost:5000/api/user/auth/linkedin";
    // The AuthCallback component will handle the redirect to dashboard
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 animate-fade-in">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Update social login buttons */}
          <Button
            variant="outline"
            className="w-full flex items-center gap-2 justify-center"
            onClick={handleGoogleSignup}
          >
            <FcGoogle size={20} />
            Sign Up with Google
          </Button>

          <Button
            variant="outline"
            className="w-full flex items-center gap-2 justify-center"
            onClick={handleLinkedInSignup}
          >
            <FaLinkedin size={20} className="text-blue-700" />
            Sign Up with LinkedIn
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Form Fields */}
          <div>
            <label htmlFor="name" className="text-sm">Name</label>
            <Input
              id="name"
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="text-sm">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="text-sm">Phone Number</label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="1234567890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm">Password</label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button className="w-full" onClick={handleSignup}>
            Create Account
          </Button>

          <div className="mt-6 text-center text-sm text-zinc-400">
            <span>By signing up, you agree to our </span>
            <Link
              to="/terms"
              className="font-medium text-blue-500 hover:text-blue-400 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}