import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Mock validation
        if (!email || !password) {
            return NextResponse.json(
                { message: 'Email and password are required' },
                { status: 400 }
            );
        }

        const role = email.startsWith('admin') ? 'ADMIN' : 'STUDENT';
        const mockToken = `mock_access_token_${role}_${Date.now()}`;

        // Mock success response
        return NextResponse.json({
            success: true,
            data: {
                user: {
                    id: '1',
                    email: email,
                    firstName: role === 'ADMIN' ? 'Admin' : 'Student',
                    lastName: 'User',
                    phone: '0812345678',
                    role: role
                },
                tokens: {
                    accessToken: mockToken,
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
