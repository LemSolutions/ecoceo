import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { success: false, message: 'Password richiesta' },
        { status: 400 }
      );
    }

    // Get the password from environment variables
    const correctPassword = process.env.AREA_CLIENTI_PASSWORD;

    if (!correctPassword) {
      console.error('AREA_CLIENTI_PASSWORD not set in environment variables');
      return NextResponse.json(
        { success: false, message: 'Configurazione mancante' },
        { status: 500 }
      );
    }

    // Simple password comparison
    if (password === correctPassword) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, message: 'Password non corretta' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth API error:', error);
    return NextResponse.json(
      { success: false, message: 'Errore del server' },
      { status: 500 }
    );
  }
}
