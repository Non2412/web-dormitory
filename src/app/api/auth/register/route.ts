import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, firstName, lastName, phone } = body;

        // Mock success response
        return NextResponse.json({
            success: true,
            data: {
                user: {
                    id: '1',
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    phone: phone,
                    role: 'STUDENT'
                },
                tokens: {
                    accessToken: 'mock_access_token_' + Date.now(),
                    refreshToken: 'mock_refresh_token_' + Date.now(),
                    tokenType: 'Bearer',
                    expiresIn: '3600'
                }
            }
        });
    } catch (error) {
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
