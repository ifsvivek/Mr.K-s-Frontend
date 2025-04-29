import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/login",
        { email, password },
        { withCredentials: true }
      );
      window.location.href = "/admin";
    } catch (err) {
      alert("Invalid admin credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <Card className="w-full max-w-md shadow-2xl border border-gray-600">
        <CardHeader>
          <CardTitle className="text-2xl text-white text-center">Admin Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="email" className="text-white text-sm">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              className="bg-gray-800 text-white border-gray-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="text-white text-sm">Password</label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="bg-gray-800 text-white border-gray-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button className="w-full bg-primary text-white hover:bg-primary/80" onClick={handleLogin}>
            Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
