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

        const fileBuffer = fs.readFileSync(filePath);

        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                "Content-Type": "text/plain",
                "Content-Disposition": `attachment; filename="${fileId}.txt"`,
            },
        });
    } catch (error) {
        return NextResponse.json({ error: "Error al descargar el archivo" }, { status: 500 });
    }
}
