import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    // Mock dashboard stats
    return NextResponse.json({
        success: true,
        data: {
            totalRooms: 50,
            occupiedRooms: 42,
            availableRooms: 5,
            maintenanceRooms: 3,
            occupancyRate: 84,
            monthlyRevenue: 185000,
            monthlyRevenueChange: 12.5,
            annualRevenue: 2200000,
            annualRevenueChange: 8.2,
            totalDue: 15000,
            dueCount: 3
        }
    });
}
