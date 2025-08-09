# 🏠 RealEstateHub - Modern Real Estate Platform

A comprehensive, production-ready real estate platform built with Next.js, featuring real-time messaging, authentication, and role-based access control.

## ✨ Features

### 🔐 Authentication & Security
- **NextAuth.js** integration with credentials and Google OAuth
- **Role-based access control** (User, Agent, Agency Admin, Admin)
- **Password reset** and email verification flows
- **JWT-based authentication** for real-time features
- **Production-ready security** headers and CORS protection

### 💬 Real-Time Messaging
- **Socket.IO** powered real-time chat system
- **Multi-user conversations** (direct and group chats)
- **Typing indicators** and read receipts
- **Message persistence** with PostgreSQL
- **Participant management** and access control

### 🏢 Real Estate Features
- **Property listings** management (CRUD operations)
- **Lead generation** and tracking system
- **Favorites** and property bookmarking
- **Advanced search** and filtering
- **Agent-client communication** platform

### 🚀 Production Ready
- **Docker containerization** with multi-service setup
- **PostgreSQL** database with Prisma ORM
- **Redis** for session storage and Socket.IO scaling
- **Nginx** reverse proxy with SSL/TLS termination
- **Automated deployment** scripts for VPS
- **Health checks** and monitoring endpoints

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM, NextAuth.js
- **Database**: PostgreSQL (production), SQLite (development)
- **Real-time**: Socket.IO with JWT authentication
- **Caching**: Redis for sessions and Socket.IO scaling
- **Infrastructure**: Docker, Nginx, Let's Encrypt SSL
- **Testing**: Custom API test suite

## 🚀 Quick Start

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/mehowbabula/realestatehub.git
   cd realestatehub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   npm run db:generate
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:5544
   ```

### Production Deployment

For VPS deployment, follow the comprehensive [VPS Deployment Guide](VPS_DEPLOYMENT_GUIDE.md).

**Quick VPS deployment:**
```bash
# On your VPS
git clone https://github.com/mehowbabula/realestatehub.git
cd realestatehub
cp .env.production .env
# Edit .env with your production settings
./scripts/deployment/deploy.sh production
```

## 📚 Documentation

- [VPS Deployment Guide](VPS_DEPLOYMENT_GUIDE.md) - Complete VPS setup instructions
- [Socket.IO Documentation](SOCKET_IO_DOCUMENTATION.md) - Real-time messaging details
- [API Test Guide](TEST_GUIDE.md) - API testing documentation
- [Authentication Documentation](AUTHENTICATION_COMPLETE.md) - Auth flow details

## 🧪 Testing

Run the comprehensive API test suite:
```bash
npm run test:api
```

## 📋 Project Status

### ✅ Completed Features
- [x] Authentication system (NextAuth + Google OAuth)
- [x] Real-time messaging with Socket.IO
- [x] Multi-user conversation support
- [x] Role-based access control
- [x] Property listings and management
- [x] Lead generation system
- [x] Docker containerization
- [x] Production deployment setup
- [x] Comprehensive API test suite
- [x] Security hardening

### 🔄 In Progress
- [ ] File upload support for property images
- [ ] Email notification system
- [ ] Advanced search and filtering
- [ ] Analytics dashboard

### 🎯 Future Enhancements
- [ ] Mobile app (React Native)
- [ ] Video calling integration
- [ ] Property viewing scheduler
- [ ] Payment processing
- [ ] Advanced analytics

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Nginx       │    │   Next.js App   │    │   PostgreSQL    │
│  (Reverse Proxy)│────│   (Frontend +   │────│   (Database)    │
│     + SSL       │    │    Backend)     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                               │
                       ┌─────────────────┐
                       │      Redis      │
                       │   (Sessions +   │
                       │   Socket.IO)    │
                       └─────────────────┘
```

## 🔒 Security Features

- **JWT Authentication** for Socket.IO connections
- **CORS Protection** with environment-specific origins
- **Rate Limiting** for API endpoints
- **SQL Injection Protection** via Prisma ORM
- **XSS Protection** with security headers
- **SSL/TLS Encryption** in production
- **Role-based Authorization** for all endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** team for the amazing framework
- **Prisma** for the excellent ORM
- **Socket.IO** for real-time capabilities
- **shadcn/ui** for beautiful UI components
- **Vercel** for hosting inspiration

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation files
- Review the troubleshooting section in the VPS guide

---

**Built with ❤️ for the real estate industry**
