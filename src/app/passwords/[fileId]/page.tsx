"use client";
import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";

export default function DownloadPage() {
    const params = useParams();
    const pathname = usePathname();
    const [fileId, setFileId] = useState<string | null>(null);
    const [error, setError] = useState<boolean | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (params && typeof params.fileId === "string") {
            setFileId(params.fileId);

            fetch("/api/previewPassword", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileId: params.fileId }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.error) {
                        setError(true);
                    } else {
                        setError(false);
                    }
                })
                .catch(() => {
                    setError(true);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setError(true);
            setLoading(false);
        }
    }, [params]);

    // ✅ Función para eliminar el archivo antes de salir
    const deleteFile = () => {
        if (!fileId) return;
        fetch("/api/deletePassword", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileId }),
        });
    };

    // ✅ Eliminar archivo al cerrar la pestaña o recargar la página
    useEffect(() => {
        const handleUnload = (event: BeforeUnloadEvent) => {
            deleteFile();
            event.preventDefault();
        };

        window.addEventListener("beforeunload", handleUnload);
        return () => {
            window.removeEventListener("beforeunload", handleUnload);
        };
    }, [fileId]);

    // ✅ Eliminar archivo si el usuario cambia de página
    useEffect(() => {
        return () => {
            deleteFile();
        };
    }, [pathname]);

    if (loading) {
        return null;
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#1e1e2e] to-[#181825]">
                <div className="p-6 w-full max-w-lg bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl text-white text-center">
                    <h1 className="text-2xl font-bold text-red-500">El archivo no existe o ya fue eliminado.</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#1e1e2e] to-[#181825]">
            <div className="relative p-6 w-full max-w-lg bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl text-white text-center">
                <h1 className="text-4xl font-extrabold drop-shadow-lg">
                    <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                        sorijose
                    </span>
                    <span className="text-gray-300"> PassView</span>
                </h1>

                <div className="mt-6">
                    {preview ? (
                        <div className="p-4 bg-gray-800/50 backdrop-blur-md rounded-xl border border-white/20 text-lg font-medium text-white 
                            whitespace-pre-wrap text-left overflow-y-auto max-h-60 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                            {preview}
                        </div>
                    ) : (
                        <button
                            onClick={() => {
                                if (!fileId) return;
                                fetch("/api/previewPassword", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ fileId }),
                                })
                                    .then((response) => response.json())
                                    .then((data) => {
                                        if (data.error) {
                                            setError(true);
                                        } else {
                                            setPreview(data.content);
                                        }
                                    })
                                    .catch(() => {
                                        setError(true);
                                    });
                            }}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all text-lg py-3 rounded-xl font-bold tracking-wide shadow-md mt-4"
                        >
                            Mostrar Contraseña
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
