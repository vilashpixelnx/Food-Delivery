# AGENT.md

## Project Name

Smart Pani Puri Cart Management System

## Project Type

Full Stack MERN Application

## Objective

Build a production-ready Pani Puri Cart Management System that manages orders, stock, billing, customers, multiple carts, expenses, WhatsApp billing, thermal printing, online payments, analytics, and VPS deployment.

The agent must generate clean, scalable, and maintainable code following MERN architecture.

---

# Tech Stack

Frontend

* React
* Axios
* React Router
* Chart.js
* Pure CSS (No Tailwind)

Backend

* Node.js
* Express.js

Database

* MongoDB
* Mongoose

Integrations

* Razorpay (Online Payment)
* WhatsApp API
* Thermal Printer ESC/POS
* PDF Generator
* CSV Export

Deployment

* Ubuntu VPS
* Nginx
* PM2
* MongoDB Atlas

---

# Project Structure

client/
components/
pages/
services/
utils/
styles/

server/
controllers/
models/
routes/
middleware/
config/
services/

---

# Agent Responsibilities

The agent must:

1. Analyze full project structure
2. Generate scalable MERN architecture
3. Create backend APIs
4. Create frontend dashboard
5. Connect APIs
6. Implement authentication
7. Implement billing system
8. Implement stock system
9. Implement WhatsApp billing
10. Implement thermal printing
11. Implement online payment
12. Implement expense tracking
13. Implement analytics
14. Prepare VPS deployment

Agent must work step by step and not generate random code.

---

# Development Rules

1. Use clean folder structure
2. Use MVC architecture
3. Use REST APIs
4. Use reusable components
5. Use proper naming
6. Use environment variables
7. Use error handling
8. Use validation
9. Use secure authentication
10. Write readable code

Do not break architecture.

---

# Authentication Rules

Use JWT authentication.

Admin login required.

Protected routes:

Dashboard
Orders
Stock
Customers
Reports
Expenses

Unauthorized users must be blocked.

---

# Billing Rules

Each order must generate:

Bill Number
Customer Name
Cart Name
Item List
Quantity
Price
Total
GST Optional
Discount
Date

PDF bill must be generated.

Thermal print supported.

WhatsApp bill sending supported.

---

# Stock Rules

Stock must be:

Cart-wise
Product-wise
Trackable
Editable

Low stock alert required.

Stock history required.

---

# Order Rules

Order must include:

Cart
Customer
Items
Quantity
Price
Total
Payment Status
Date

Order history must be saved.

---

# Expense Rules

Daily expense tracking:

Gas
Water
Material
Salary
Rent
Electricity
Other

Daily and monthly report required.

---

# Payment Rules

UPI payment
QR code
Razorpay integration
Payment history
Payment status

---

# WhatsApp Rules

Send bill PDF
Send order summary
Send payment link

---

# Analytics Rules

Sales Graph
Expense Graph
Profit Graph
Cart Performance
Monthly Reports

Use Chart.js.

---

# API Structure

/api/auth
/api/carts
/api/customers
/api/products
/api/orders
/api/bills
/api/stock
/api/expenses
/api/payments
/api/reports

---

# Database Models

User
Cart
Customer
Product
Order
Bill
Stock
Expense
Payment

---

# UI Rules

Responsive
Clean dashboard
Sidebar
Topbar
Mobile friendly
Pure CSS

No Tailwind.

---

# Deployment Rules

Ubuntu VPS
Nginx
PM2
MongoDB Atlas
SSL HTTPS

Provide deployment steps.

---

# Code Generation Strategy

Step 1: Setup Backend
Step 2: Setup Database
Step 3: Create Models
Step 4: Create Controllers
Step 5: Create Routes
Step 6: Setup Authentication
Step 7: Setup Frontend
Step 8: Dashboard UI
Step 9: API Integration
Step 10: Billing System
Step 11: Stock System
Step 12: Payment System
Step 13: WhatsApp Integration
Step 14: Thermal Printer
Step 15: Reports
Step 16: Deployment

Agent must follow this order strictly.

---

# Important Instructions

Do not skip steps.

Do not mix frontend and backend code randomly.

Always explain before generating code.

Generate files in proper folders.

Maintain project structure.

Follow production-level standards.

---

# Final Output

Working MERN Project

Clean Code

Deployment Guide

README

Environment Variables Example

Fully functional Pani Puri Cart System

---

# Phase Tracker

> Legend:
> ✅ = Completed
> ⏳ = In Progress / Current Phase
> 🔲 = Not Started Yet

| Phase | Module | Status |
|-------|--------|--------|
| Phase 1 | Project Setup + Backend Foundation | ✅ Completed |
| Phase 2 | Authentication (JWT) | ✅ Completed |
| Phase 3 | Cart, Product, Customer APIs | ✅ Completed |
| Phase 4 | Order + Stock APIs | ✅ Completed |
| Phase 5 | Billing System + PDF | ✅ Completed |
| Phase 6 | Expense Tracking API | ⏳ Next to Build |
| Phase 7 | Payment System (Razorpay) | 🔲 Not Started |
| Phase 8 | Reports & Analytics API | 🔲 Not Started |
| Phase 9 | React Frontend Setup + Dashboard UI | 🔲 Not Started |
| Phase 10 | Frontend Auth + Protected Routes | 🔲 Not Started |
| Phase 11 | Frontend: Orders + Customers + Carts Pages | 🔲 Not Started |
| Phase 12 | Frontend: Stock Management Page | 🔲 Not Started |
| Phase 13 | Frontend: Billing Page + PDF Download | 🔲 Not Started |
| Phase 14 | Frontend: Expense + Payment Pages | 🔲 Not Started |
| Phase 15 | Frontend: Analytics & Reports (Chart.js) | 🔲 Not Started |
| Phase 16 | WhatsApp Integration | 🔲 Not Started |
| Phase 17 | Thermal Printer Integration | 🔲 Not Started |
| Phase 18 | VPS Deployment | 🔲 Not Started |

---

> Agent Rule: Jab bhi ek phase complete ho, uski status ✅ kar do aur next phase ko ⏳ mark karo.
> Kabhi bhi do phases ek saath mat banao. Ek phase = Ek conversation.
