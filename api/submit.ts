import mongoose from 'mongoose';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Define o schema do MongoDB
const ConnectionSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    idade: { type: Number, required: true },
    motivo_conexao: { type: String, required: true },
    data_conexao: { type: Date, default: Date.now },
});

// Evita erro de recompilação do modelo no Vercel
const Connection = mongoose.models.Connection || mongoose.model('Connection', ConnectionSchema);

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
            return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await dbConnect();

        const { nome, idade, motivo } = req.body;

        const newConnection = new Connection({
            nome,
            idade: Number(idade),
            motivo_conexao: motivo,
            // data_conexao será preenchida pelo default: Date.now
        });

        await newConnection.save();

        return res.status(201).json({ message: 'Conexão registrada com sucesso!' });
    } catch (error: any) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Erro ao salvar no banco de dados', error: error.message });
    }
}
