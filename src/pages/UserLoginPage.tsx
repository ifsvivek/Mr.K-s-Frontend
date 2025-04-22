import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin } from "react-icons/fa";

export default function UserLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 animate-fade-in">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">User Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full flex items-center gap-2 justify-center">
            <FcGoogle size={20} />
            Continue with Google
          </Button>
          <Button variant="outline" className="w-full flex items-center gap-2 justify-center">
            <FaLinkedin size={20} className="text-blue-700" />
            Continue with LinkedIn
          </Button>

          <div className="text-center text-muted-foreground text-xs">or sign in with email</div>

          <div>
            <label htmlFor="email" className="text-sm">Email</label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="password" className="text-sm">Password</label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>
          <Button className="w-full">Login</Button>
        </CardContent>
      </Card>
    </div>
  );
}
