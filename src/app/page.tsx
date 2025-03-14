"use client";
import { useState } from "react";
import { Clipboard, ClipboardCheck } from "lucide-react"; // 📌 Importamos iconos minimalistas

export default function Home() {
    const [password, setPassword] = useState<string>('');
    const [link, setLink] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState<boolean>(false); // ✅ Estado para animación de copiado

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch("/api/savePassword", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
        });
        const data = await response.json();
        setLink(`${window.location.origin}${data.url}`);
    };

    const handleCopy = () => {
        if (link) {
            navigator.clipboard.writeText(link);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 3000);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#1e1e2e] to-[#181825]">
            <div className="relative p-6 w-full max-w-lg bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl text-white text-center">
                <h1 className="text-4xl font-extrabold drop-shadow-lg">
                    <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                        sorijose
                    </span>
                    <span className="text-gray-300"> PassShare</span>
                </h1>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <textarea
                        className="w-full p-3 pr-4 border border-white/20 rounded-xl bg-gray-800/50 text-white placeholder-gray-400 
                            resize-none overflow-y-auto max-h-40 box-border 
                            scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
                        rows={4}
                        placeholder="Introduce la contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all text-lg py-3 rounded-xl font-bold tracking-wide shadow-md">
                        Generar Enlace
                    </button>
                </form>

                {link && (
                    <div className="mt-6 p-4 bg-gray-800/50 backdrop-blur-md rounded-xl border border-white/20 text-center">
                        <p className="text-gray-300 font-medium">Comparte este enlace:</p>

                        <div className="relative flex w-full items-center mt-2 bg-gray-700 p-3 rounded-lg border border-white/20">
                            <input
                                className="text-white w-full bg-transparent text-center focus:outline-none"
                                value={link}
                                readOnly
                            />
                            
                            {/* ✅ Nuevo Botón de Copiar Minimalista */}
                            <button
                                onClick={handleCopy}
                                className="ml-2 p-2 rounded-lg bg-transparent hover:bg-gray-600 transition duration-200"
                            >
                                {copySuccess ? (
                                    <ClipboardCheck className="text-green-400 w-6 h-6" />
                                ) : (
                                    <Clipboard className="text-gray-300 hover:text-white w-6 h-6" />
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ✅ Aviso de "Copiado correctamente" */}
            {copySuccess && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-500/20 text-green-400 px-6 py-2 rounded-xl border border-green-400/30 shadow-lg backdrop-blur-md transition-all animate-fade-in-out">
                    ✔ Copiado correctamente
                </div>
            )}
        </div>
    );
}
