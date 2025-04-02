# Smart IoT Energy Meter with Payment Integration

A web application for monitoring electricity usage in real-time and making payments via UPI.

## Features

- Real-time monitoring of voltage, current, power, and units
- Automatic cost calculation
- One-click UPI payment integration
- Responsive design
- Secure authentication

## Technologies Used

- Frontend: HTML5, CSS3, JavaScript
- IoT Platform: Blynk Cloud
- Payment: UPI Deep Links

## Setup Instructions

1. Clone this repository
2. Open `index.html` in a browser
3. Login with credentials:
   - User ID: `21beee22`
   - Password: `12345`

## Payment Note

The payment functionality uses UPI deep links which:
- Will auto-populate the payment amount
- May show "Payment Failed" due to UPI app restrictions for unregistered merchants

## Blynk Configuration

Ensure your Blynk device is configured with these virtual pins:
- V0: Voltage
- V1: Current
- V2: Power
- V3: Units (kWh)
- V4: Cost (₹)

## License

MIT License
