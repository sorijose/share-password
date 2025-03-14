import fs from "fs";
import path from "path";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { password }: { password: string } = await req.json();
    if (!password) {
        return NextResponse.json({ error: "No password provided" }, { status: 400 });
    }

    // Generar nombre de archivo aleatorio
    const fileId = crypto.randomBytes(16).toString("hex");
    const folderPath = path.join(process.cwd(), "private/passwords");
    const filePath = path.join(folderPath, `${fileId}.txt`);

    // Asegurar que la carpeta existe
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    // Guardar la contraseña en el archivo
    fs.writeFileSync(filePath, password, "utf8");

    return NextResponse.json({ url: `/passwords/${fileId}` }, { status: 200 });
}
