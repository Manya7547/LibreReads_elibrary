# ELibrary

A comprehensive electronic library management system for organizing, managing, and accessing digital resources.

## Features

- User authentication and authorization
- Book management (CRUD operations)
- File uploads for book covers and PDF files
- Cloud storage integration with Cloudinary
- RESTful API architecture
- TypeScript implementation

## Prerequisites

- Node.js (>=16.20.1)
- MongoDB
- Cloudinary account

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd elibrary
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
PORT=3000
MONGO_CONNECTION_STRING=your_mongodb_connection_string
NODE_ENV=development
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FRONTEND_DOMAIN=http://localhost:3000
```

## Running the Application

Development mode:

```bash
npm run dev
```

## API Endpoints

### Users

- POST `/api/users` - Register a new user
- POST `/api/users/login` - User login

### Books

- GET `/api/books` - List all books
- GET `/api/books/:bookId` - Get a single book
- POST `/api/books` - Create a new book (authenticated)
- PATCH `/api/books/:bookId` - Update a book (authenticated)
- DELETE `/api/books/:bookId` - Delete a book (authenticated)

## Tech Stack

- Express.js - Web framework
- TypeScript - Programming language
- MongoDB - Database
- Mongoose - ODM
- JWT - Authentication
- Multer - File upload handling
- Cloudinary - Cloud storage
- CORS - Cross-origin resource sharing

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Manya S <manya7547@gmail.com>
