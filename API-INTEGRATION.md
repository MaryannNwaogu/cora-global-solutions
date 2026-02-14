# API Integration Guide

## Form Submission Endpoints

### 1. Flight Booking Submission
**Endpoint:** `POST /api/bookings/flight`

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "234-123-4567",
  "departureCity": "Lagos",
  "destinationCity": "London",
  "departureDate": "2026-03-15",
  "returnDate": "2026-03-25",
  "passengers": 2,
  "travelClass": "business",
  "notes": "Need window seats if possible"
}
```

**Response:**
```json
{
  "status": "success",
  "bookingId": "FLIGHT-123456",
  "message": "Booking request received. We'll contact you shortly."
}
```

### 2. Consultation Booking Submission
**Endpoint:** `POST /api/bookings/consultation`

**Request Body:**
```json
{
  "fullName": "Jane Smith",
  "email": "jane@company.com",
  "phone": "234-234-5678",
  "companyName": "Tech Innovations Ltd",
  "serviceType": "data",
  "preferredDate": "2026-02-20",
  "preferredTime": "14:00",
  "message": "We need help with customer analytics..."
}
```

**Response:**
```json
{
  "status": "success",
  "consultationId": "CONSULT-789012",
  "message": "Consultation request received. We'll call you within 24 hours."
}
```

### 3. Chat Message Submission (Optional)
**Endpoint:** `POST /api/chat/message`

**Request Body:**
```json
{
  "userId": "session-id",
  "message": "I want to book a flight",
  "conversationHistory": []
}
```

**Response:**
```json
{
  "status": "success",
  "reply": "Great! I can help you book a flight...",
  "suggestions": ["Option 1", "Option 2"]
}
```

## Implementation Examples

### Node.js/Express Backend
```javascript
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

app.use(express.json());

// Flight booking endpoint
app.post('/api/bookings/flight', async (req, res) => {
  try {
    const data = req.body;
    
    // Validate data
    if (!data.fullName || !data.email) {
      return res.status(400).json({ status: 'error', message: 'Missing required fields' });
    }
    
    // Save to database
    // await FlightBooking.create(data);
    
    // Send email confirmation
    // await sendEmail(data.email, 'Flight Booking Confirmation', emailTemplate);
    
    res.json({
      status: 'success',
      bookingId: `FLIGHT-${Date.now()}`,
      message: 'Booking received!'
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Consultation booking endpoint
app.post('/api/bookings/consultation', async (req, res) => {
  try {
    const data = req.body;
    
    // Save to database
    // await Consultation.create(data);
    
    // Schedule calendar event
    // await scheduleCalendarEvent(data);
    
    res.json({
      status: 'success',
      consultationId: `CONSULT-${Date.now()}`,
      message: 'Consultation scheduled!'
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### Python/Flask Backend
```python
from flask import Flask, request, jsonify
from flask_mail import Mail, Message
from datetime import datetime

app = Flask(__name__)

@app.route('/api/bookings/flight', methods=['POST'])
def flight_booking():
    data = request.json
    
    # Validation
    required_fields = ['fullName', 'email', 'phone', 'departureCity', 'destinationCity', 'departureDate']
    if not all(field in data for field in required_fields):
        return jsonify({'status': 'error', 'message': 'Missing required fields'}), 400
    
    # Save to database
    # booking = FlightBooking(**data)
    # db.session.add(booking)
    # db.session.commit()
    
    # Send email
    # send_confirmation_email(data['email'])
    
    return jsonify({
        'status': 'success',
        'bookingId': f"FLIGHT-{int(datetime.now().timestamp())}",
        'message': 'Booking received!'
    })

@app.route('/api/bookings/consultation', methods=['POST'])
def consultation_booking():
    data = request.json
    
    # Similar implementation
    return jsonify({
        'status': 'success',
        'consultationId': f"CONSULT-{int(datetime.now().timestamp())}",
        'message': 'Consultation scheduled!'
    })

if __name__ == '__main__':
    app.run(debug=True)
```

### Email Template
```html
<h1>Booking Confirmation</h1>
<p>Hello {{fullName}},</p>
<p>Thank you for your booking! Here are your details:</p>
<ul>
  <li>Service: {{serviceType}}</li>
  <li>Email: {{email}}</li>
  <li>Phone: {{phone}}</li>
  <li>Date: {{preferredDate}}</li>
</ul>
<p>We'll be in touch soon.</p>
<p>Best regards,<br>Cora Global Solutions Team</p>
```

## Frontend Integration

Update `form.js` to use your endpoint:

```javascript
submitForm(form, submitButton) {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  
  fetch('/api/bookings/flight', {  // Change to consultation for other form
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => {
    if (result.status === 'success') {
      showNotification('Booking submitted successfully!', 'success');
      form.reset();
    } else {
      showNotification('Error: ' + result.message, 'error');
    }
  })
  .catch(error => {
    showNotification('Error submitting form', 'error');
    console.error('Error:', error);
  })
  .finally(() => {
    submitButton.disabled = false;
    submitButton.textContent = originalText;
  });
}
```

## Database Schema (Optional)

### Flight Bookings Table
```sql
CREATE TABLE flight_bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  booking_id VARCHAR(50) UNIQUE,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  departure_city VARCHAR(100) NOT NULL,
  destination_city VARCHAR(100) NOT NULL,
  departure_date DATE NOT NULL,
  return_date DATE,
  passengers INT NOT NULL,
  travel_class VARCHAR(50),
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (email),
  INDEX (booking_id)
);
```

### Consultations Table
```sql
CREATE TABLE consultations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  consultation_id VARCHAR(50) UNIQUE,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  company_name VARCHAR(100),
  service_type VARCHAR(50) NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time TIME NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (email),
  INDEX (consultation_id)
);
```

## Security Considerations

1. **Validate all input** - Check types, lengths, formats
2. **Sanitize data** - Remove HTML/script tags
3. **Use HTTPS** - Always encrypt data in transit
4. **Rate limiting** - Prevent spam/abuse
5. **CSRF tokens** - Add tokens to forms
6. **API authentication** - Secure your endpoints
7. **Data encryption** - Encrypt sensitive data at rest

## Testing

Use tools like Postman or Thunder Client to test endpoints:

1. Create new POST request
2. Set URL to your endpoint
3. Set headers: `Content-Type: application/json`
4. Add JSON body with test data
5. Send and verify response

## Environment Variables

Store sensitive data in `.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASS=password
DB_NAME=cora_db
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password
API_KEY=your-secret-key
```

## Monitoring & Logging

Log all submissions:
```python
import logging

logging.basicConfig(
    filename='bookings.log',
    level=logging.INFO,
    format='%(asctime)s - %(level)s - %(message)s'
)

logging.info(f"New flight booking: {data.get('email')}")
```

## Webhook Events (Optional)

Send webhook notifications:
```
POST https://your-system.com/webhooks/booking
{
  "event": "booking.created",
  "bookingId": "FLIGHT-123456",
  "timestamp": "2026-02-11T10:00:00Z",
  "data": {...}
}
```

---

For questions or API customization, contact Info@coraglobalsolutions.com
