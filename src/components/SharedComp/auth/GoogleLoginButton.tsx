// src/components/GoogleLoginButton.tsx
import { useGoogleLogin } from "@react-oauth/google";
import type { DecodedUser } from "../../../types/auth/auth";
import { Chrome } from "lucide-react";
import { motion } from "framer-motion";

interface GoogleProps {

    handelGoogleLogin: (arg0: any, arg1: any) => void;
    title?:string
}

export default function GoogleLoginButton({ handelGoogleLogin,title }: GoogleProps) {
    const login = useGoogleLogin({
        onSuccess: async (tokenResponse: any) => {
            try {
                const accessToken = tokenResponse.access_token;
                if (!accessToken) { throw new Error("No access token returned") };

                const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                const userInfo: DecodedUser = await res.json();
                handelGoogleLogin(null, userInfo);
                console.log("Google User:", userInfo);
            } catch (err) {
                handelGoogleLogin("Failed to fetch user info", null);
                console.error(err);
            }
        },
        onError: (error) => {
            handelGoogleLogin("Login Failed", null);
            console.log("Google error:", error);
        },
        flow: "implicit", // you can also use "auth-code" if you want backend verification
    });


    return (

        <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => login()}
            whileTap={{ scale: 0.98 }}
            className="w-full border cursor-pointer border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 text-white font-medium py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
        >
            <Chrome className="w-5 h-5" />
            <span>{title} Google</span>
        </motion.div>
    );
}
