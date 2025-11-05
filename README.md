# The Powder Legacy - E-commerce Platform

A modern e-commerce platform for natural powder products built with React and Vite.

## Features

- 🛍️ **Product Catalog**: Browse and search through natural powder products
- 🛒 **Shopping Cart**: Add products to cart with real-time updates
- 💳 **Razorpay Integration**: Secure online payment processing
- 📧 **Email Notifications**: Automated order confirmations and payment updates
- 👨‍💼 **Admin Dashboard**: Manage products, orders, and content
- 📱 **Responsive Design**: Mobile-friendly interface
- 🔐 **Secure Authentication**: Admin access control
- 📦 **Order Management**: Track and manage customer orders

## Tech Stack

- **Frontend**: React 19, React Router, Tailwind CSS v4
- **Backend**: Express.js, Node.js
- **Database**: Supabase (PostgreSQL)
- **Payment**: Razorpay
- **Email**: Nodemailer (Gmail)
- **Build Tool**: Vite
- **Deployment**: Vercel

## Prerequisites

- Node.js 16+ and npm
- Supabase account
- Razorpay account
- Gmail account with App Password

## Installation

1. Clone the repository:
```bash
git clone https://github.com/harshava123/powderlegacy.git
cd powderlegacy
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
# Razorpay Configuration
VITE_RZP_KEY_ID=your_razorpay_key_id
VITE_RZP_SECRET_KEY=your_razorpay_secret_key
VITE_RZP_PAYMENT_PAGE_URL=your_payment_page_url

# Admin Configuration
VITE_ADMIN_KEY=your_admin_password

# Email Configuration
SMTP_USER=your_gmail_address
SMTP_PASS=your_gmail_app_password
GMAIL_USER=your_gmail_address
GMAIL_APP_PASSWORD=your_gmail_app_password
ADMIN_EMAIL=admin_email_address

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Development

Run the development server:
```bash
npm run dev
```

Run the API server (for email functionality):
```bash
npm run server
```

## Production Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Admin Access

Access the admin dashboard at `/admin` and use the configured admin password.

### Admin Features:
- Product management (add, edit, delete)
- Order tracking and management
- Content management (home page, headers)
- Image management
- Stock control

## Project Structure

```
├── api/                    # Serverless API functions
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── admin/        # Admin dashboard components
│   │   ├── footer/       # Footer components
│   │   ├── header/       # Header components
│   │   ├── pages/        # Page components
│   │   └── routers/      # Route configurations
│   ├── contexts/         # React contexts
│   ├── services/         # API services
│   └── lib/              # Third-party integrations
├── server/               # Express server
└── vercel.json          # Vercel deployment config
```

## License

All rights reserved. This project is proprietary software.

## Support

For support, email support@powderlegacy.com
