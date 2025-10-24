// Booking Data Management System
class BookingManager {
    constructor() {
        this.storageKey = 'nirvanica_bookings';
        this.bookings = this.loadBookings();
        this.listeners = [];
    }

    // Load bookings from localStorage
    loadBookings() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading bookings:', error);
            return [];
        }
    }

    // Save bookings to localStorage
    saveBookings() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.bookings));
            this.notifyListeners();
        } catch (error) {
            console.error('Error saving bookings:', error);
        }
    }

    // Add a new booking
    addBooking(bookingData) {
        const booking = {
            id: this.generateBookingId(),
            ...bookingData,
            status: 'confirmed',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.bookings.push(booking);
        this.saveBookings();
        
        // Show notification
        this.showBookingNotification(booking);
        
        return booking;
    }

    // Update booking status
    updateBookingStatus(bookingId, newStatus) {
        const booking = this.bookings.find(b => b.id === bookingId);
        if (booking) {
            booking.status = newStatus;
            booking.updatedAt = new Date().toISOString();
            this.saveBookings();
            return booking;
        }
        return null;
    }

    // Update booking details
    updateBooking(bookingId, updates) {
        const booking = this.bookings.find(b => b.id === bookingId);
        if (booking) {
            Object.assign(booking, updates);
            booking.updatedAt = new Date().toISOString();
            this.saveBookings();
            return booking;
        }
        return null;
    }

    // Delete booking
    deleteBooking(bookingId) {
        const index = this.bookings.findIndex(b => b.id === bookingId);
        if (index !== -1) {
            const deleted = this.bookings.splice(index, 1)[0];
            this.saveBookings();
            return deleted;
        }
        return null;
    }

    // Get all bookings
    getAllBookings() {
        return [...this.bookings];
    }

    // Get bookings by status
    getBookingsByStatus(status) {
        return this.bookings.filter(b => b.status === status);
    }

    // Get today's arrivals
    getTodayArrivals() {
        const today = new Date().toISOString().split('T')[0];
        return this.bookings.filter(b => 
            b.checkIn === today && (b.status === 'confirmed' || b.status === 'checked-in')
        );
    }

    // Get today's checkouts
    getTodayCheckouts() {
        const today = new Date().toISOString().split('T')[0];
        return this.bookings.filter(b => 
            b.checkOut === today && b.status === 'checked-in'
        );
    }

    // Get current guests (checked-in)
    getCurrentGuests() {
        return this.bookings.filter(b => b.status === 'checked-in');
    }

    // Generate unique booking ID
    generateBookingId() {
        const prefix = 'NIR';
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.random().toString(36).substr(2, 4).toUpperCase();
        return `${prefix}${timestamp}${random}`;
    }

    // Subscribe to booking changes
    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            const index = this.listeners.indexOf(callback);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }

    // Notify listeners of changes
    notifyListeners() {
        this.listeners.forEach(callback => {
            try {
                callback(this.bookings);
            } catch (error) {
                console.error('Error in booking listener:', error);
            }
        });
    }

    // Show booking notification
    showBookingNotification(booking) {
        const notification = document.createElement('div');
        notification.className = 'booking-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">📅</div>
                <div class="notification-text">
                    <strong>New Booking!</strong><br>
                    ${booking.firstName} ${booking.lastName}<br>
                    ${booking.checkIn} - ${booking.checkOut}
                </div>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            max-width: 300px;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);

        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    // Get dashboard statistics
    getDashboardStats() {
        const today = new Date().toISOString().split('T')[0];
        const todayArrivals = this.getTodayArrivals().length;
        const todayCheckouts = this.getTodayCheckouts().length;
        const currentGuests = this.getCurrentGuests().length;
        
        // Calculate today's revenue
        const todayRevenue = this.bookings
            .filter(b => b.checkIn === today && b.status === 'confirmed')
            .reduce((total, b) => total + (b.totalAmount || 0), 0);

        return {
            totalRooms: 12,
            todayArrivals,
            todayCheckouts,
            todayRevenue,
            currentGuests,
            occupancyRate: Math.round((currentGuests / 12) * 100)
        };
    }

    // Export bookings to CSV
    exportBookings() {
        const headers = [
            'Booking ID', 'Guest Name', 'Email', 'Phone', 'Check-in', 'Check-out', 
            'Room Type', 'Guests', 'Status', 'Total Amount', 'Created At'
        ];
        
        const csvContent = [
            headers.join(','),
            ...this.bookings.map(booking => [
                booking.id,
                `"${booking.firstName} ${booking.lastName}"`,
                booking.email,
                booking.phone,
                booking.checkIn,
                booking.checkOut,
                booking.roomType || 'Mixed',
                booking.totalGuests || 0,
                booking.status,
                booking.totalAmount || 0,
                booking.createdAt
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }
}

// Initialize global booking manager
window.bookingManager = new BookingManager();

// Add CSS for notifications
const notificationStyles = `
@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 10px;
}

.notification-icon {
    font-size: 24px;
}

.notification-text {
    flex: 1;
    font-size: 14px;
    line-height: 1.4;
}

.notification-close {
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.notification-close:hover {
    background: rgba(255,255,255,0.2);
    border-radius: 50%;
}
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

