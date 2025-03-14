import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { fileId }: { fileId: string } = await req.json();
        const filePath = path.join(process.cwd(), 'private/passwords', `${fileId}.txt`);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return NextResponse.json({ message: "Archivo eliminado correctamente" }, { status: 200 });
        } else {
            return NextResponse.json({ error: "El archivo no existe o ya fue eliminado" }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
