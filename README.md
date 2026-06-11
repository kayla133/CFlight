# CFlight

## 1. Project Description

**What does this site do?**

C Flight is an e-commerce web application for a golf apparel brand that celebrates the "C Flight" golfer — the everyday player who may not shoot par but always shows up in style. The site sells golf clothing featuring golf-themed puns and humor, allowing customers to browse products, leave reviews, and place orders.

**Who is it for?**

C Flight is built for recreational golfers who don't take the game (or themselves) too seriously. It targets casual players, gift shoppers, and anyone who appreciates a good golf pun on a polo. Employees manage inventory and orders, while the owner has full control over the store.

---

## 2. Database Schema

**Entity Relationship Diagram (ERD)**
This feature will be added shortly.

---

## 3. User Roles

### Role 1: Owner (Admin)

The Owner has full control over the entire application.

- Can add, edit, and delete products and product categories
- Can view and manage all user accounts and assign/change roles
- Can view all orders and update order statuses at any stage
- Can view and manage all customer reviews (edit or delete)
- Can view all contact/support messages
- Has access to the full admin dashboard

---

### Role 2: Employee

Employees assist with day-to-day store operations.

- Can edit existing product details (price, description, stock, availability)
- Can view all orders and update order status (Placed → Processing → Shipped → Fulfilled)
- Can add notes to orders
- Can moderate customer reviews (delete inappropriate content)
- Can view contact/support messages
- Cannot add or delete products or categories
- Cannot manage user accounts or roles

---

### Role 3: Customer

Standard registered users who shop on the site.

- Can browse and view all products
- Can add items to cart and complete checkout
- Can view their own order history and current order status
- Can leave, edit, and delete their own product reviews
- Can submit contact/support messages
- Cannot access any admin or employee dashboards

---

## 4. Test Account Credentials


| Role       | Username / Email                  |
|------------|-----------------------------------|
| Owner      | `owner@cflight.com`               |
| Employee   | `employee@cflight.com`            |
| Customer   | `customer@cflight.com`            |

---

## 5. Known Limitations

<!-- Fill this in as you build. Be honest — this shows self-awareness and good engineering practice. -->

- [ ] _No limitations identified yet — project is in early development._

---

_Last updated: June 2026_
