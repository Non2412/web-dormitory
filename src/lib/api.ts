// API Configuration
// Backend now supports CORS, so we can call it directly
const API_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? '/api' : 'http://localhost:3000/api');

// Types
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: 'ADMIN' | 'STUDENT';
}

export interface AuthResponse {
    success: boolean;
    data: {
        user: User;
        tokens: {
            accessToken: string;
            refreshToken: string;
            tokenType: string;
            expiresIn: string;
        };
    };
}

export interface Room {
    id: string;
    roomNumber: string;
    dormitoryId: string;
    floor: number;
    capacity: number;
    price: number;
    status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
    dormitory?: {
        id: string;
        name: string;
    };
}

export interface Booking {
    id: string;
    roomId: string;
    userId: string;
    startDate: string;
    endDate: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
    room?: Room;
}

export interface Payment {
    id: string;
    bookingId: string;
    amount: number;
    paymentMethod: string;
    status: string;
}

export interface DashboardData {
    totalRooms: number;
    availableRooms: number;
    occupiedRooms: number;
    totalBookings: number;
    pendingBookings: number;
    confirmedBookings: number;
    totalRevenue: number;
    recentBookings: Booking[];
}

export interface DashboardStats {
    bookingsThisMonth: number;
    revenueThisMonth: number;
    occupancyRate: number;
    averageBookingDuration: number;
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
};

// Helper function to handle API errors
const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
            const errorData = await response.json();
            console.error('API Error Response:', errorData);

            // Handle different error formats
            if (errorData.message) {
                errorMessage = errorData.message;
            } else if (errorData.error) {
                errorMessage = errorData.error;
            } else if (errorData.errors && Array.isArray(errorData.errors)) {
                errorMessage = errorData.errors.map((e: unknown) => (e as { message: string }).message || e).join(', ');
            }
        } catch (e) {
            console.error('Failed to parse error response:', e);
        }

        throw new Error(errorMessage);
    }
    return response.json();
};

// API Client
class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const token = getAuthToken();
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        // Merge with existing headers
        if (options.headers) {
            Object.assign(headers, options.headers);
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        console.log('API Request:', {
            url: `${this.baseUrl}${endpoint}`,
            method: options.method || 'GET',
            headers,
            body: options.body,
        });

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers,
        });

        return handleResponse<T>(response);
    }

    // Auth APIs
    async register(data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phone: string;
    }): Promise<AuthResponse> {
        return this.request<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async login(data: {
        email: string;
        password: string;
    }): Promise<AuthResponse> {
        return this.request<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getMe(): Promise<{ success: boolean; data: User }> {
        return this.request<{ success: boolean; data: User }>('/auth/me');
    }

    async logout(): Promise<void> {
        return this.request<void>('/auth/logout', { method: 'POST' });
    }

    async refreshToken(refreshToken: string): Promise<AuthResponse> {
        return this.request<AuthResponse>('/auth/refresh', {
            method: 'POST',
            body: JSON.stringify({ refreshToken }),
        });
    }

    // Rooms APIs
    async getRooms(params?: {
        dormitoryId?: string;
        status?: string;
        page?: number;
        limit?: number;
    }): Promise<{ success: boolean; data: Room[] }> {
        const queryParams = new URLSearchParams();
        if (params?.dormitoryId) queryParams.append('dormitoryId', params.dormitoryId);
        if (params?.status) queryParams.append('status', params.status);
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());

        const query = queryParams.toString();
        return this.request<{ success: boolean; data: Room[] }>(`/rooms${query ? `?${query}` : ''}`);
    }

    async getRoom(id: string): Promise<{ success: boolean; data: Room }> {
        return this.request<{ success: boolean; data: Room }>(`/rooms/${id}`);
    }

    async createRoom(data: {
        roomNumber: string;
        dormitoryId: string;
        floor: number;
        capacity: number;
        price: number;
        status: string;
    }): Promise<{ success: boolean; data: Room }> {
        return this.request<{ success: boolean; data: Room }>('/rooms', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateRoom(id: string, data: Partial<Room>): Promise<{ success: boolean; data: Room }> {
        return this.request<{ success: boolean; data: Room }>(`/rooms/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteRoom(id: string): Promise<void> {
        return this.request<void>(`/rooms/${id}`, { method: 'DELETE' });
    }

    // Bookings APIs
    async getBookings(params?: {
        userId?: string;
        status?: string;
    }): Promise<{ success: boolean; data: Booking[] }> {
        const queryParams = new URLSearchParams();
        if (params?.userId) queryParams.append('userId', params.userId);
        if (params?.status) queryParams.append('status', params.status);

        const query = queryParams.toString();
        return this.request<{ success: boolean; data: Booking[] }>(`/bookings${query ? `?${query}` : ''}`);
    }

    async getBooking(id: string): Promise<{ success: boolean; data: Booking }> {
        return this.request<{ success: boolean; data: Booking }>(`/bookings/${id}`);
    }

    async createBooking(data: {
        roomId: string;
        startDate: string;
        endDate: string;
    }): Promise<{ success: boolean; data: Booking }> {
        return this.request<{ success: boolean; data: Booking }>('/bookings', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateBooking(id: string, data: Partial<Booking>): Promise<{ success: boolean; data: Booking }> {
        return this.request<{ success: boolean; data: Booking }>(`/bookings/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteBooking(id: string): Promise<void> {
        return this.request<void>(`/bookings/${id}`, { method: 'DELETE' });
    }

    // Payments APIs
    async getPayments(): Promise<{ success: boolean; data: Payment[] }> {
        return this.request<{ success: boolean; data: Payment[] }>('/payments');
    }

    async getPayment(id: string): Promise<{ success: boolean; data: Payment }> {
        return this.request<{ success: boolean; data: Payment }>(`/payments/${id}`);
    }

    async createPayment(data: {
        bookingId: string;
        amount: number;
        paymentMethod: string;
    }): Promise<{ success: boolean; data: Payment }> {
        return this.request<{ success: boolean; data: Payment }>('/payments', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Dashboard APIs
    async getDashboard(): Promise<{ success: boolean; data: DashboardData }> {
        return this.request<{ success: boolean; data: DashboardData }>('/dashboard');
    }

    async getDashboardStats(): Promise<{ success: boolean; data: DashboardStats }> {
        return this.request<{ success: boolean; data: DashboardStats }>('/dashboard/stats');
    }
}

// Export singleton instance
export const api = new ApiClient(API_URL);