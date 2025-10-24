// Booking Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize booking functionality
    initializeBooking();
});

function initializeBooking() {
    // Set minimum date to today
    setMinimumDates();
    
    // Initialize event listeners
    setupEventListeners();
    
    // Initialize counters
    initializeCounters();
    
    // Initialize room calculation
    initializeRoomCalculation();
    
    // Initialize form validation
    initializeFormValidation();
    
    // Initialize summary updates
    updateBookingSummary();
}

function setMinimumDates() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    
    if (checkInInput) {
        checkInInput.min = formatDate(tomorrow);
    }
    if (checkOutInput) {
        checkOutInput.min = formatDate(tomorrow);
    }
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function setupEventListeners() {
    // Date change listeners
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    
    if (checkInInput) {
        checkInInput.addEventListener('change', handleDateChange);
    }
    if (checkOutInput) {
        checkOutInput.addEventListener('change', handleDateChange);
    }
    
    // Room quantity change listeners
    const roomQuantityInputs = document.querySelectorAll('input[id$="RoomQty"]');
    roomQuantityInputs.forEach(input => {
        input.addEventListener('change', updateBookingSummary);
    });
    
    // Room quantity button listeners
    const roomQuantityButtons = document.querySelectorAll('.qty-btn');
    roomQuantityButtons.forEach(button => {
        button.addEventListener('click', handleRoomQuantityChange);
    });
    
    // Total rooms change listeners
    const totalRoomsInput = document.getElementById('totalRooms');
    if (totalRoomsInput) {
        totalRoomsInput.addEventListener('change', updateRoomLimits);
    }
    
    // Total rooms button listeners
    const totalRoomsButtons = document.querySelectorAll('.total-rooms-btn');
    totalRoomsButtons.forEach(button => {
        button.addEventListener('click', handleTotalRoomsChange);
    });
    
    // Form submission
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleFormSubmission);
    }
    
    // Preview booking button
    const previewBtn = document.getElementById('previewBooking');
    if (previewBtn) {
        previewBtn.addEventListener('click', previewBooking);
    }
    
    // Modal close functionality
    const modal = document.getElementById('bookingModal');
    const modalClose = document.querySelector('.modal-close');
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // Adjust rooms button
    const adjustRoomsBtn = document.getElementById('adjustRooms');
    if (adjustRoomsBtn) {
        adjustRoomsBtn.addEventListener('click', adjustRooms);
    }
}

function initializeCounters() {
    const counterButtons = document.querySelectorAll('.counter-btn');
    
    counterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            const action = this.getAttribute('data-action');
            const input = document.getElementById(target);
            
            if (input) {
                let currentValue = parseInt(input.value) || 0;
                const min = parseInt(input.getAttribute('min')) || 0;
                const max = parseInt(input.getAttribute('max')) || 999;
                
                if (action === 'increase' && currentValue < max) {
                    input.value = currentValue + 1;
                } else if (action === 'decrease' && currentValue > min) {
                    input.value = currentValue - 1;
                }
                
                // Update button states
                updateCounterButtons(target);
                
                // Recalculate rooms and update summary
                calculateRooms();
                updateBookingSummary();
            }
        });
    });
    
    // Initialize button states
    ['adults', 'children', 'elders', 'infants'].forEach(target => {
        updateCounterButtons(target);
    });
    
    // Initialize room quantity button states
    ['ac', 'non-ac', 'private-pool'].forEach(roomType => {
        updateRoomQuantityButtons(roomType);
    });
    
    // Initialize total rooms button states
    updateTotalRoomsButtons();
    
    // Initialize room selection summary
    updateRoomSelectionSummary();
}

function updateCounterButtons(target) {
    const input = document.getElementById(target);
    if (!input) return;
    
    const currentValue = parseInt(input.value) || 0;
    const min = parseInt(input.getAttribute('min')) || 0;
    const max = parseInt(input.getAttribute('max')) || 999;
    
    const decreaseBtn = document.querySelector(`[data-target="${target}"][data-action="decrease"]`);
    const increaseBtn = document.querySelector(`[data-target="${target}"][data-action="increase"]`);
    
    if (decreaseBtn) {
        decreaseBtn.disabled = currentValue <= min;
    }
    if (increaseBtn) {
        increaseBtn.disabled = currentValue >= max;
    }
}

function initializeRoomCalculation() {
    updateRoomLimits();
}

function handleTotalRoomsChange(event) {
    const button = event.target;
    const action = button.getAttribute('data-action');
    const input = document.getElementById('totalRooms');
    
    if (input) {
        let currentValue = parseInt(input.value) || 1;
        const min = parseInt(input.getAttribute('min')) || 1;
        const max = parseInt(input.getAttribute('max')) || 12;
        
        if (action === 'increase' && currentValue < max) {
            input.value = currentValue + 1;
        } else if (action === 'decrease' && currentValue > min) {
            input.value = currentValue - 1;
        }
        
        // Update room limits and info
        updateRoomLimits();
        updateTotalRoomsButtons();
    }
}

function updateTotalRoomsButtons() {
    const input = document.getElementById('totalRooms');
    if (!input) return;
    
    const currentValue = parseInt(input.value) || 1;
    const min = parseInt(input.getAttribute('min')) || 1;
    const max = parseInt(input.getAttribute('max')) || 12;
    
    const decreaseBtn = document.querySelector('.total-rooms-btn[data-action="decrease"]');
    const increaseBtn = document.querySelector('.total-rooms-btn[data-action="increase"]');
    
    if (decreaseBtn) {
        decreaseBtn.disabled = currentValue <= min;
    }
    if (increaseBtn) {
        increaseBtn.disabled = currentValue >= max;
    }
}

function updateRoomLimits() {
    const totalRooms = parseInt(document.getElementById('totalRooms').value) || 1;
    const roomsInfo = document.getElementById('roomsInfo');
    
    // Update info text
    if (roomsInfo) {
        roomsInfo.textContent = `Select any ${totalRooms} room${totalRooms !== 1 ? 's' : ''} from available options`;
    }
    
    // Reset all room quantities to 0
    const roomTypes = ['ac', 'non-ac', 'private-pool'];
    roomTypes.forEach(roomType => {
        const roomTypeMap = {
            'ac': 'acRoomQty',
            'non-ac': 'nonAcRoomQty',
            'private-pool': 'privatePoolRoomQty'
        };
        const input = document.getElementById(roomTypeMap[roomType]);
        if (input) {
            input.value = 0;
            updateRoomQuantityButtons(roomType);
        }
    });
    
    // Update room selection summary
    updateRoomSelectionSummary();
    updateBookingSummary();
}

function handleRoomQuantityChange(event) {
    const button = event.target;
    const roomType = button.getAttribute('data-room');
    const action = button.getAttribute('data-action');
    
    // Map room types to actual input IDs
    const roomTypeMap = {
        'ac': 'acRoomQty',
        'non-ac': 'nonAcRoomQty',
        'private-pool': 'privatePoolRoomQty'
    };
    
    const inputId = roomTypeMap[roomType];
    const input = document.getElementById(inputId);
    
    if (input) {
        let currentValue = parseInt(input.value) || 0;
        const min = parseInt(input.getAttribute('min')) || 0;
        const max = parseInt(input.getAttribute('max')) || 10;
        
        // Get total rooms allowed
        const totalRooms = parseInt(document.getElementById('totalRooms').value) || 1;
        
        // Calculate current total selected rooms
        let currentTotalSelected = 0;
        const roomTypes = ['ac', 'non-ac', 'private-pool'];
        roomTypes.forEach(rt => {
            const rtInput = document.getElementById(roomTypeMap[rt]);
            if (rtInput) {
                currentTotalSelected += parseInt(rtInput.value) || 0;
            }
        });
        
        if (action === 'increase' && currentValue < max) {
            // Check if adding this room would exceed total limit
            if (currentTotalSelected < totalRooms) {
                input.value = currentValue + 1;
            } else {
                // Show message that total room limit reached
                showRoomLimitMessage();
                return;
            }
        } else if (action === 'decrease' && currentValue > min) {
            input.value = currentValue - 1;
        }
        
        // Update button states
        updateRoomQuantityButtons(roomType);
        
        // Update room selection summary
        updateRoomSelectionSummary();
        
        // Update booking summary
        updateBookingSummary();
    }
}

function showRoomLimitMessage() {
    const totalRooms = parseInt(document.getElementById('totalRooms').value) || 1;
    
    // Create or update message
    let messageDiv = document.getElementById('roomLimitMessage');
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.id = 'roomLimitMessage';
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #e74c3c;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 4000;
            font-size: 14px;
            max-width: 300px;
        `;
        document.body.appendChild(messageDiv);
    }
    
    messageDiv.textContent = `You can only select ${totalRooms} room${totalRooms !== 1 ? 's' : ''} total. Please reduce other room selections first.`;
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        if (messageDiv) {
            messageDiv.remove();
        }
    }, 3000);
}

function updateRoomQuantityButtons(roomType) {
    // Map room types to actual input IDs
    const roomTypeMap = {
        'ac': 'acRoomQty',
        'non-ac': 'nonAcRoomQty',
        'private-pool': 'privatePoolRoomQty'
    };
    
    const inputId = roomTypeMap[roomType];
    const input = document.getElementById(inputId);
    if (!input) return;
    
    const currentValue = parseInt(input.value) || 0;
    const min = parseInt(input.getAttribute('min')) || 0;
    const max = parseInt(input.getAttribute('max')) || 10;
    
    // Get total rooms allowed
    const totalRooms = parseInt(document.getElementById('totalRooms').value) || 1;
    
    // Calculate current total selected rooms
    let currentTotalSelected = 0;
    const roomTypes = ['ac', 'non-ac', 'private-pool'];
    roomTypes.forEach(rt => {
        const rtInput = document.getElementById(roomTypeMap[rt]);
        if (rtInput) {
            currentTotalSelected += parseInt(rtInput.value) || 0;
        }
    });
    
    const decreaseBtn = document.querySelector(`[data-room="${roomType}"][data-action="decrease"]`);
    const increaseBtn = document.querySelector(`[data-room="${roomType}"][data-action="increase"]`);
    
    if (decreaseBtn) {
        decreaseBtn.disabled = currentValue <= min;
    }
    if (increaseBtn) {
        // Disable if at max for this room type OR if total rooms limit reached
        increaseBtn.disabled = currentValue >= max || currentTotalSelected >= totalRooms;
    }
}

function updateRoomSelectionSummary() {
    const selectedRoomsDiv = document.getElementById('selectedRooms');
    if (!selectedRoomsDiv) return;
    
    const roomTypes = [
        { id: 'ground-floor', inputId: 'groundFloorRoomQty', name: 'Ground Floor', price: 1250, max: 4 },
        { id: 'first-floor', inputId: 'firstFloorRoomQty', name: 'First Floor', price: 1250, max: 7 },
        { id: 'dormitory', inputId: 'dormitoryRoomQty', name: 'Dormitory', price: 1250, max: 1 }
    ];
    
    let selectedRooms = [];
    let totalRooms = 0;
    
    roomTypes.forEach(roomType => {
        const input = document.getElementById(roomType.inputId);
        const quantity = parseInt(input.value) || 0;
        
        if (quantity > 0) {
            selectedRooms.push({
                name: roomType.name,
                quantity: quantity,
                price: roomType.price
            });
            totalRooms += quantity;
        }
    });
    
    const totalRoomsAllowed = parseInt(document.getElementById('totalRooms').value) || 1;
    
    if (selectedRooms.length === 0) {
        selectedRoomsDiv.innerHTML = `<p>No rooms selected (${totalRooms}/${totalRoomsAllowed} selected)</p>`;
    } else {
        let html = `<div class="room-selection-header">
            <span>Selected: ${totalRooms}/${totalRoomsAllowed} rooms</span>
        </div>`;
        
        selectedRooms.forEach(room => {
            html += `
                <div class="room-item">
                    <span class="room-item-name">${room.name}</span>
                    <span class="room-item-qty">${room.quantity} room${room.quantity !== 1 ? 's' : ''}</span>
                </div>
            `;
        });
        selectedRoomsDiv.innerHTML = html;
    }
}

function handleDateChange() {
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    
    if (checkInInput && checkOutInput) {
        const checkInDate = new Date(checkInInput.value);
        const checkOutDate = new Date(checkOutInput.value);
        
        // Ensure check-out is after check-in
        if (checkOutDate <= checkInDate) {
            const nextDay = new Date(checkInDate);
            nextDay.setDate(nextDay.getDate() + 1);
            checkOutInput.value = formatDate(nextDay);
        }
        
        // Update minimum check-out date
        checkOutInput.min = formatDate(new Date(checkInDate.getTime() + 24 * 60 * 60 * 1000));
        
        // Update nights count
        updateNightsCount();
        updateBookingSummary();
    }
}

function updateNightsCount() {
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    const nightsCountSpan = document.getElementById('nightsCount');
    
    if (checkInInput && checkOutInput && nightsCountSpan) {
        const checkInDate = new Date(checkInInput.value);
        const checkOutDate = new Date(checkOutInput.value);
        
        if (checkInInput.value && checkOutInput.value) {
            const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
            const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
            nightsCountSpan.textContent = `${nights} night${nights !== 1 ? 's' : ''}`;
        } else {
            nightsCountSpan.textContent = '0 nights';
        }
    }
}

function adjustRooms() {
    const totalRoomsInput = document.getElementById('totalRooms');
    const currentRooms = parseInt(totalRoomsInput.value) || 1;
    
    // Simple adjustment - allow user to manually set rooms
    const newRooms = prompt(`Current rooms: ${currentRooms}\nEnter new number of rooms:`, currentRooms);
    
    if (newRooms && !isNaN(newRooms) && newRooms > 0) {
        totalRoomsInput.value = newRooms;
        updateRoomLimits();
        updateBookingSummary();
    }
}

function updateBookingSummary() {
    // Get form values
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;
    const adults = parseInt(document.getElementById('adults').value) || 0;
    const children = parseInt(document.getElementById('children').value) || 0;
    const elders = parseInt(document.getElementById('elders').value) || 0;
    const infants = parseInt(document.getElementById('infants').value) || 0;
    const totalRooms = parseInt(document.getElementById('totalRooms').value) || 0;
    
    // Calculate nights
    let nights = 0;
    if (checkIn && checkOut) {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
        nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    }
    
    // Calculate total guests
    const totalGuests = adults + children + elders + infants;
    
    // Get selected rooms and calculate total
    const roomTypes = [
        { id: 'ground-floor', inputId: 'groundFloorRoomQty', name: 'Ground Floor', price: 1250, max: 4 },
        { id: 'first-floor', inputId: 'firstFloorRoomQty', name: 'First Floor', price: 1250, max: 7 },
        { id: 'dormitory', inputId: 'dormitoryRoomQty', name: 'Dormitory', price: 1250, max: 1 }
    ];
    
    let selectedRoomsText = '-';
    let totalAmount = 0;
    let totalSelectedRooms = 0;
    
    const selectedRooms = [];
    roomTypes.forEach(roomType => {
        const input = document.getElementById(roomType.inputId);
        const quantity = parseInt(input.value) || 0;
        
        if (quantity > 0) {
            selectedRooms.push(`${roomType.name} (${quantity})`);
            totalAmount += roomType.price * quantity * nights;
            totalSelectedRooms += quantity;
        }
    });
    
    if (selectedRooms.length > 0) {
        selectedRoomsText = selectedRooms.join(', ');
    }
    
    // Update summary elements
    updateSummaryElement('summaryCheckIn', checkIn ? formatDisplayDate(checkIn) : '-');
    updateSummaryElement('summaryCheckOut', checkOut ? formatDisplayDate(checkOut) : '-');
    updateSummaryElement('summaryNights', nights);
    updateSummaryElement('summaryGuests', totalGuests > 0 ? `${totalGuests} guest${totalGuests !== 1 ? 's' : ''}` : '-');
    updateSummaryElement('summaryRooms', totalSelectedRooms > 0 ? totalSelectedRooms : '-');
    updateSummaryElement('summaryRoomTypes', selectedRoomsText);
    updateSummaryElement('summaryTotal', `₹${totalAmount.toLocaleString()}`);
}

function updateSummaryElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

function formatDisplayDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function initializeFormValidation() {
    const form = document.getElementById('bookingForm');
    if (!form) return;
    
    // Real-time validation
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', validateField);
        field.addEventListener('input', clearFieldError);
    });
    
    // Email validation
    const emailField = document.getElementById('email');
    if (emailField) {
        emailField.addEventListener('blur', validateEmail);
    }
    
    // Phone validation
    const phoneField = document.getElementById('phone');
    if (phoneField) {
        phoneField.addEventListener('blur', validatePhone);
    }
}

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    
    clearFieldError(event);
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    return true;
}

function validateEmail(event) {
    const field = event.target;
    const value = field.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    clearFieldError(event);
    
    if (value && !emailRegex.test(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }
    
    return true;
}

function validatePhone(event) {
    const field = event.target;
    const value = field.value.trim();
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    
    clearFieldError(event);
    
    if (value && !phoneRegex.test(value)) {
        showFieldError(field, 'Please enter a valid phone number');
        return false;
    }
    
    return true;
}

function showFieldError(field, message) {
    clearFieldError({ target: field });
    
    field.style.borderColor = '#e74c3c';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '4px';
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(event) {
    const field = event.target;
    field.style.borderColor = '';
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}


function validateForm() {
    const form = document.getElementById('bookingForm');
    if (!form) return false;
    
    let isValid = true;
    
    // Clear all previous errors
    const errorElements = form.querySelectorAll('.field-error');
    errorElements.forEach(error => error.remove());
    
    // Validate required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    // Validate email
    const emailField = document.getElementById('email');
    if (emailField && !validateEmail({ target: emailField })) {
        isValid = false;
    }
    
    // Validate phone
    const phoneField = document.getElementById('phone');
    if (phoneField && !validatePhone({ target: phoneField })) {
        isValid = false;
    }
    
    // Validate dates
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;
    
    if (!checkIn || !checkOut) {
        isValid = false;
        showFieldError(document.getElementById('checkIn'), 'Please select both check-in and check-out dates');
    } else {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (checkInDate < today) {
            isValid = false;
            showFieldError(document.getElementById('checkIn'), 'Check-in date cannot be in the past');
        }
        
        if (checkOutDate <= checkInDate) {
            isValid = false;
            showFieldError(document.getElementById('checkOut'), 'Check-out date must be after check-in date');
        }
    }
    
    // Validate room selection
    const roomTypes = [
        { id: 'ac', inputId: 'acRoomQty', max: 4 },
        { id: 'non-ac', inputId: 'nonAcRoomQty', max: 7 },
        { id: 'private-pool', inputId: 'privatePoolRoomQty', max: 1 }
    ];
    let totalSelectedRooms = 0;
    
    roomTypes.forEach(roomType => {
        const input = document.getElementById(roomType.inputId);
        const quantity = parseInt(input.value) || 0;
        totalSelectedRooms += quantity;
    });
    
    if (totalSelectedRooms === 0) {
        isValid = false;
        const roomTypesSection = document.querySelector('.room-types');
        if (roomTypesSection) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = 'Please select at least one room';
            errorDiv.style.color = '#e74c3c';
            errorDiv.style.fontSize = '12px';
            errorDiv.style.marginTop = '8px';
            roomTypesSection.appendChild(errorDiv);
        }
    }
    
    // Validate terms acceptance
    const termsAccepted = document.getElementById('termsAccepted').checked;
    if (!termsAccepted) {
        isValid = false;
        showFieldError(document.getElementById('termsAccepted'), 'Please accept the terms and conditions');
    }
    
    return isValid;
}

function previewBooking() {
    // Validate form first
    if (!validateForm()) {
        return;
    }
    
    // Generate booking reference
    const bookingRef = generateBookingReference();
    
    // Get form data
    const formData = getFormData();
    
    // Show preview modal (same as confirmation but with different title)
    showPreviewModal(bookingRef, formData);
}

function showPreviewModal(bookingRef, formData) {
    const modal = document.getElementById('bookingModal');
    if (!modal) return;
    
    // Update modal content for preview
    document.querySelector('.modal-header h2').textContent = 'Booking Preview';
    document.getElementById('bookingReference').textContent = bookingRef;
    document.getElementById('confirmationName').textContent = `${formData.get('firstName')} ${formData.get('lastName')}`;
    document.getElementById('confirmationEmail').textContent = formData.get('email');
    document.getElementById('confirmationPhone').textContent = formData.get('phone');
    document.getElementById('confirmationCheckIn').textContent = formatDisplayDate(formData.get('checkIn'));
    document.getElementById('confirmationCheckOut').textContent = formatDisplayDate(formData.get('checkOut'));
    
    // Calculate and display total
    const roomTypes = [
        { id: 'ground-floor', inputId: 'groundFloorRoomQty', name: 'Ground Floor', price: 1250, max: 4 },
        { id: 'first-floor', inputId: 'firstFloorRoomQty', name: 'First Floor', price: 1250, max: 7 },
        { id: 'dormitory', inputId: 'dormitoryRoomQty', name: 'Dormitory', price: 1250, max: 1 }
    ];
    
    let totalAmount = 0;
    const nights = parseInt(formData.get('nights')) || 0;
    
    roomTypes.forEach(roomType => {
        const input = document.getElementById(roomType.inputId);
        const quantity = parseInt(input.value) || 0;
        if (quantity > 0) {
            totalAmount += roomType.price * quantity * nights;
        }
    });
    
    document.getElementById('confirmationTotal').textContent = `₹${totalAmount.toLocaleString()}`;
    
    // Update confirmation message for preview
    document.querySelector('.confirmation-message').innerHTML = `
        <p>Please review your booking details below.</p>
        <p>Click "Confirm Booking" to proceed with the reservation.</p>
    `;
    
    // Update footer button
    document.querySelector('.modal-footer').innerHTML = `
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="confirmBookingFromPreview()">Confirm Booking</button>
    `;
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function handleFormSubmission(event) {
    event.preventDefault();
    
    if (validateForm()) {
        // Generate booking reference
        const bookingRef = generateBookingReference();
        
        // Get form data
        const formData = getFormData();
        
        // Show confirmation modal
        showConfirmationModal();
        
        // In a real application, you would send this data to a server
        console.log('Booking submitted:', formData);
    }
}

function generateBookingReference() {
    const prefix = 'NIR';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefix}${timestamp}${random}`;
}

function getFormData() {
    const form = document.getElementById('bookingForm');
    const formData = new FormData(form);
    
    // Add calculated values
    const adults = parseInt(document.getElementById('adults').value) || 0;
    const children = parseInt(document.getElementById('children').value) || 0;
    const elders = parseInt(document.getElementById('elders').value) || 0;
    const infants = parseInt(document.getElementById('infants').value) || 0;
    const totalRooms = parseInt(document.getElementById('totalRooms').value) || 0;
    
    formData.append('totalGuests', adults + children + elders + infants);
    formData.append('totalRooms', totalRooms);
    
    // Calculate nights
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;
    if (checkIn && checkOut) {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
        formData.append('nights', nights);
    }
    
    return formData;
}

function confirmBookingFromPreview() {
    // Close the preview modal
    closeModal();
    
    // Save the booking to the system
    saveBookingToSystem();
    
    // Show success message
    setTimeout(() => {
        showConfirmationModal();
    }, 300);
}

function saveBookingToSystem() {
    // Get form data
    const formData = getFormData();
    
    // Calculate total amount
    const roomTypes = [
        { id: 'ground-floor', inputId: 'groundFloorRoomQty', name: 'Ground Floor', price: 1250, max: 4 },
        { id: 'first-floor', inputId: 'firstFloorRoomQty', name: 'First Floor', price: 1250, max: 7 },
        { id: 'dormitory', inputId: 'dormitoryRoomQty', name: 'Dormitory', price: 1250, max: 1 }
    ];
    
    let totalAmount = 0;
    const nights = parseInt(formData.get('nights')) || 0;
    const selectedRooms = [];
    
    roomTypes.forEach(roomType => {
        const input = document.getElementById(roomType.inputId);
        const quantity = parseInt(input.value) || 0;
        if (quantity > 0) {
            selectedRooms.push({
                type: roomType.name,
                quantity: quantity,
                price: roomType.price
            });
            totalAmount += roomType.price * quantity * nights;
        }
    });
    
    // Prepare booking data
    const bookingData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        checkIn: formData.get('checkIn'),
        checkOut: formData.get('checkOut'),
        nights: nights,
        adults: parseInt(formData.get('adults')) || 0,
        children: parseInt(formData.get('children')) || 0,
        elders: parseInt(formData.get('elders')) || 0,
        infants: parseInt(formData.get('infants')) || 0,
        totalGuests: parseInt(formData.get('totalGuests')) || 0,
        totalRooms: parseInt(formData.get('totalRooms')) || 0,
        selectedRooms: selectedRooms,
        totalAmount: totalAmount,
        specialRequests: formData.get('specialRequests') || '',
        paymentMethod: 'On Property',
        bookingSource: 'Website'
    };
    
    // Save to booking manager
    if (window.bookingManager) {
        const booking = window.bookingManager.addBooking(bookingData);
        console.log('Booking saved:', booking);
        
        // Store booking reference for confirmation modal
        window.currentBookingRef = booking.id;
    } else {
        console.error('Booking manager not available');
    }
}

function showConfirmationModal() {
    const modal = document.getElementById('bookingModal');
    if (!modal) return;
    
    // Update modal content for confirmation
    document.querySelector('.modal-header h2').textContent = 'Booking Confirmed!';
    
    // Show booking reference if available
    const bookingRef = window.currentBookingRef || 'N/A';
    document.getElementById('bookingReference').textContent = bookingRef;
    
    // Update confirmation message
    document.querySelector('.confirmation-message').innerHTML = `
        <p>Thank you for choosing Banasura Lake View! Your booking has been confirmed.</p>
        <p><strong>Booking Reference:</strong> ${bookingRef}</p>
        <p>We will send you a confirmation email shortly with all the details.</p>
        <p>Please keep your booking reference number for future correspondence.</p>
    `;
    
    // Update footer button
    document.querySelector('.modal-footer').innerHTML = `
        <button class="btn btn-primary" onclick="closeModal()">Close</button>
    `;
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Test function to debug booking issues
function testBooking() {
    console.log('Testing booking functionality...');
    
    // Check if modal exists
    const modal = document.getElementById('bookingModal');
    console.log('Modal element:', modal);
    
    // Check if form exists
    const form = document.getElementById('bookingForm');
    console.log('Form element:', form);
    
    // Check if preview button exists
    const previewBtn = document.getElementById('previewBooking');
    console.log('Preview button:', previewBtn);
    
    // Test modal display
    if (modal) {
        modal.style.display = 'block';
        console.log('Modal should be visible now');
        setTimeout(() => {
            modal.style.display = 'none';
            console.log('Modal hidden after 3 seconds');
        }, 3000);
    }
}

// Make test function available globally
window.testBooking = testBooking;
