import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    // Mock payments data
    return NextResponse.json({
        success: true,
        data: [
            {
                id: "1",
                date: "2024-03-25",
                roomNumber: "101",
                tenantName: "สมชาย ใจดี",
                amount: 4500,
                status: "PENDING", // Matches API interface (though frontend might expect 'Pending')
                paymentMethod: "TRANSFER",
                bookingId: "b1",
                slipUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000"
            },
            {
                id: "2",
                date: "2024-03-24",
                roomNumber: "202",
                tenantName: "วิภาดา รักสงบ",
                amount: 5200,
                status: "VERIFIED",
                paymentMethod: "TRANSFER",
                bookingId: "b2",
                slipUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000"
            },
            {
                id: "3",
                date: "2024-03-23",
                roomNumber: "305",
                tenantName: "กานดา มีสุข",
                amount: 4800,
                status: "REJECTED",
                paymentMethod: "CASH",
                bookingId: "b3",
                slipUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000"
            },
            // Add a DUE payment for dashboard display
            {
                id: "4",
                date: "2024-03-28",
                roomNumber: "401",
                tenantName: "มานะ อดทน",
                amount: 4500,
                status: "DUE",
                paymentMethod: "PENDING",
                bookingId: "b4"
            }
        ]
    });
}
