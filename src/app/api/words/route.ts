import { NextResponse } from 'next/server';

// Esta lista debería estar en una base de datos
const WORDS = [
  'GATOS', 'PERRO', 'MUNDO', 'LETRA', 'JUEGO', 'LIBRO', 'PLAZA', 
  'TABLA', 'VERDE', 'DULCE', 'PLAYA', 'CIELO', 'PAPEL', 'RELOJ',
  'NEGRO', 'PIZZA', 'RADIO', 'SILLA', 'TECHO', 'VOLAR'
];

export async function GET() {
  const randomIndex = Math.floor(Math.random() * WORDS.length);
  const word = WORDS[randomIndex];
  
  return NextResponse.json({ word });
}

// Opcional: Endpoint para verificar si una palabra es válida
export async function POST(request: Request) {
  const { word } = await request.json();
  const isValid = WORDS.includes(word.toUpperCase());
  
  return NextResponse.json({ isValid });
}