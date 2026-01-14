
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    backButton?: {
        href: string;
        label: string;
    };
}

export default function AuthLayout({ children, title, subtitle, backButton }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4">
            {/* Background Gradient & Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-background z-0" />
            <div
                className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 relative z-10 overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />

                <div className="p-8 md:p-10 relative">
                    {backButton && (
                        <div className="absolute top-6 left-6">
                            <Link to={backButton.href}>
                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary/50 text-muted-foreground hover:text-primary transition-colors h-8 w-8" title={backButton.label}>
                                    <ArrowLeft className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    )}
                    <div className="flex flex-col items-center text-center mb-8">
                        <Link to="/" className="w-20 h-20 flex items-center justify-center mb-6 hover:scale-110 transition-transform duration-300 drop-shadow-md">
                            <img src="/assets/logo.png" alt="Logo" className="w-full h-full object-contain" />
                        </Link>
                        <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/80">{title}</h1>
                        <p className="text-muted-foreground mt-3 text-sm md:text-base">{subtitle}</p>
                    </div>
                    {children}
                </div>
            </motion.div>
        </div>
    );
}
