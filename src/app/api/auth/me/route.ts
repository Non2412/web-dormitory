import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1] || '';

    // Simple mock: check if token contains 'ADMIN'
    const isAdmin = token.includes('ADMIN');
    const role = isAdmin ? 'ADMIN' : 'STUDENT';

    // Mock success response
    return NextResponse.json({
        success: true,
        data: {
            id: '1',
            email: isAdmin ? 'admin@dorm.com' : 'student@dorm.com',
            firstName: isAdmin ? 'Admin' : 'Student',
            lastName: 'User',
            phone: '0812345678',
            role: role
        }
    });
}
