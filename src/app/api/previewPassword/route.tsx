import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { fileId }: { fileId: string } = await req.json();
        const filePath = path.join(process.cwd(), "private/passwords", `${fileId}.txt`);

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: "El archivo no existe o ya fue eliminado" }, { status: 404 });
        }

        const fileContent = fs.readFileSync(filePath, "utf8");
        return NextResponse.json({ content: fileContent });
    } catch (error) {
        return NextResponse.json({ error: "Error al obtener la previsualización" }, { status: 500 });
    }
}
