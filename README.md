# HelpDesk Admin Frontend

A professional admin dashboard for managing products and support tickets in a helpdesk system. Built with React, TypeScript, and shadcn/ui.

## Features

### 🎯 Core Features
- **Product Management**: Add, edit, delete, and view products
- **Dashboard**: Overview with key metrics and recent activity
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS

### 🚀 Planned Features
- **Ticket Management**: View, assign, and manage support tickets
- **Knowledge Base**: Create and manage help articles
- **User Management**: Assign admins and manage user permissions
- **Analytics**: Product-specific metrics and reporting
- **Authentication**: JWT-based login system
- **Real-time Updates**: WebSocket integration for live updates

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **UI Library**: shadcn/ui components
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Forms**: React Hook Form + Yup validation

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:3001/api
```

## Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── table.tsx
│   └── layout/       # Layout components
│       ├── Layout.tsx
│       ├── Sidebar.tsx
│       └── Header.tsx
├── pages/            # Page components
│   ├── Dashboard.tsx
│   └── Products.tsx
├── services/         # API services
│   └── api.ts
├── types/            # TypeScript interfaces
│   └── index.ts
├── lib/              # Utility functions
│   └── utils.ts
└── App.tsx           # Main app component
```

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## API Integration

The frontend is designed to work with a RESTful API. The API service layer is already set up in `src/services/api.ts` with the following endpoints:

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user

### Tickets
- `GET /api/tickets` - Get all tickets
- `POST /api/tickets` - Create new ticket
- `PUT /api/tickets/:id` - Update ticket

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

## Component Usage

### Using shadcn/ui Components

```tsx
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Card</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  );
}
```

### Adding New Pages

1. Create a new component in `src/pages/`
2. Add the route in `src/App.tsx`
3. Add navigation item in `src/components/layout/Sidebar.tsx`

## Styling

The project uses Tailwind CSS with shadcn/ui design tokens. Custom styles can be added in `src/index.css`.

### Color Scheme
- Primary: Blue (`blue-600`)
- Secondary: Gray (`gray-600`)
- Success: Green (`green-600`)
- Warning: Orange (`orange-600`)
- Error: Red (`red-600`)

## Development

### Adding New shadcn/ui Components

```bash
npx shadcn@latest add [component-name]
```

### Code Style
- Use TypeScript for all components
- Follow React functional component patterns
- Use React Query for data fetching
- Implement proper error handling
- Add loading states for better UX

## Deployment

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

### Environment Setup

Make sure to set the correct `REACT_APP_API_URL` for your production environment.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
