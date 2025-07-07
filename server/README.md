# Finance Tracker Backend - Clean Architecture

## 🎯 Current Structure

### 📊 Database Models
- **User.js** - User authentication and profile
- **Category.js** - Income/Expense categories with icons
- **Transaction.js** - Individual financial transactions
- **Budget.js** - Budget management per category
- **Goal.js** - Financial goal tracking

### 🎮 Controllers
- **addDataV2.js** - Add income and expense transactions
- **getDataV2.js** - Retrieve income and expense data
- **allTransectionsV2.js** - Get all user transactions
- **category.js** - Full CRUD operations for categories
- **transaction.js** - Advanced transaction management
- **budget.js** - Budget management with analytics
- **goal.js** - Goal tracking with progress monitoring

### 🛣️ Routes
- **addDataV2.js** - `/v2/api/addData/*` routes
- **getDataV2.js** - `/v2/api/getData/*` routes  
- **allTransectionsV2.js** - `/v2/api/getAllTransactions` route
- **category.js** - `/v2/categories/*` routes
- **transaction.js** - `/v2/transactions/*` routes
- **budget.js** - `/v2/budgets/*` routes
- **goal.js** - `/v2/goals/*` routes

## 🚀 Available API Endpoints

### V2 Compatibility Routes (Legacy API Structure)
```
POST /v2/api/addData/income      - Add income transaction
POST /v2/api/addData/expense     - Add expense transaction
POST /v2/api/getData/income      - Get income data
POST /v2/api/getData/expense     - Get expense data
POST /v2/api/getAllTransactions  - Get all transactions
```

### V2 Advanced Routes (Modern API Structure)
```
# Categories
GET    /v2/categories/:userId     - Get user categories
POST   /v2/categories            - Create category
PUT    /v2/categories/:categoryId - Update category
DELETE /v2/categories/:categoryId - Delete category

# Transactions
GET    /v2/transactions/:userId           - Get transactions (with filters)
GET    /v2/transactions/:userId/summary   - Get transaction summary
POST   /v2/transactions                   - Create transaction
PUT    /v2/transactions/:transactionId    - Update transaction
DELETE /v2/transactions/:transactionId    - Delete transaction

# Budgets
GET    /v2/budgets/:userId          - Get user budgets
GET    /v2/budgets/:userId/overview - Get budget overview
POST   /v2/budgets                  - Create budget
PUT    /v2/budgets/:budgetId        - Update budget
DELETE /v2/budgets/:budgetId        - Delete budget

# Goals
GET    /v2/goals/:userId           - Get user goals
GET    /v2/goals/:userId/summary   - Get goals summary
POST   /v2/goals                   - Create goal
PUT    /v2/goals/:goalId           - Update goal
PATCH  /v2/goals/:goalId/progress  - Update goal progress
DELETE /v2/goals/:goalId           - Delete goal
```

## ✨ Key Features

### 🏗️ Clean Architecture
- **Normalized Database**: Proper relationships, no embedded arrays
- **ES Modules**: Modern JavaScript import/export syntax
- **Separation of Concerns**: Clear separation between routes, controllers, and models
- **Consistent Error Handling**: Standardized error responses

### 💡 Core Functionality
- **Income/Expense Tracking**: Record and categorize financial transactions
- **Category Management**: Custom categories with icons
- **Budget Management**: Set spending limits and track progress
- **Goal Setting**: Financial goals with progress monitoring
- **Data Analytics**: Summary and overview endpoints

### 📈 Advanced Features
- **Filtering & Pagination**: Advanced query options for large datasets
- **Budget Analytics**: Spending analysis and overspend detection
- **Goal Progress**: Automatic progress calculation and deadlines
- **Data Validation**: Comprehensive input validation and sanitization

## 🔧 Technical Details

### Database Schema
All models use MongoDB ObjectId relationships:
- Users have many Categories, Transactions, Budgets, Goals
- Transactions belong to User and Category
- Budgets belong to User and Category
- Goals belong to User

### Response Format
```javascript
{
  "message": "Success message",
  "data": {
    // Response data
  }
}
```

### Error Handling
```javascript
{
  "error": "Error description"
}
```

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Configure your environment variables
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Start Production Server**
   ```bash
   npm start
   ```

## 📝 Usage Examples

### Create a Category
```javascript
POST /v2/categories
{
  "userId": "user123",
  "name": "Groceries", 
  "type": "expense",
  "icon": "🛒"
}
```

### Add an Expense
```javascript
POST /v2/api/addData/expense
{
  "userId": "user123",
  "expense": {
    "name": "Weekly shopping",
    "amount": 75.50,
    "category": "Groceries",
    "date": "2025-07-04"
  }
}
```

### Set a Budget
```javascript
POST /v2/budgets
{
  "userId": "user123",
  "categoryId": "cat456",
  "amount": 400,
  "startDate": "2025-07-01",
  "endDate": "2025-07-31"
}
```

### Create a Goal
```javascript
POST /v2/goals
{
  "userId": "user123",
  "title": "Emergency Fund",
  "targetAmount": 5000,
  "currentAmount": 1200,
  "deadline": "2025-12-31"
}
```

## 🎉 Benefits

- **Modern Architecture**: Built with current best practices
- **Type Safety**: Comprehensive validation and error handling
- **Scalable**: Designed to handle growth in users and data
- **Maintainable**: Clean code structure for easy updates
- **Feature Rich**: Advanced financial tracking capabilities
- **API Flexibility**: Two API styles for different use cases

This clean, modern backend provides a solid foundation for any financial tracking application! 🏆
