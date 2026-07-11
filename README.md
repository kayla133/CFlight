# CFlight

## 1. Project Description

**What does this site do?**

C Flight is an e-commerce web application for a golf apparel brand that celebrates the "C Flight" golfer — the everyday player who may not shoot par but always shows up in style. The site sells golf clothing featuring golf-themed puns and humor, allowing customers to browse products, leave reviews, and place orders.

**Who is it for?**

C Flight is built for recreational golfers who don't take the game (or themselves) too seriously. It targets casual players, gift shoppers, and anyone who appreciates a good golf pun on a polo. Employees manage inventory and orders, while the owner has full control over the store.

---

## 2. Database Schema

**Entity Relationship Diagram (ERD)**
<img width="407" height="845" alt="image" src="https://github.com/user-attachments/assets/661a7205-cb27-4ea0-84d7-ddeba57e49b7" />


---

## 3. User Roles

### Role 1: Admin

The Owner has full control over the entire application.

- Can add, edit, and delete products
- Can view and manage all user accounts and assign/change roles
- Can view, delete, and respond all contact/support messages
- Has access to the full admin dashboard

---

### Role 2: Employee

Employees assist with day-to-day store operations.

- Can edit existing product details
- Can view and respond contact/support messages
- Cannot manage user accounts or roles

---

### Role 3: Customer

Standard registered users who shop on the site.

- Can browse and view all products
- Can add items to cart and complete checkout
- Can submit, edit, and delete contact/support messages
- Cannot access any admin or employee dashboards

---

## 4. Test Account Credentials


| Role       | Username / Email                  |
|------------|-----------------------------------|
| Admin      | `admin@example.com`               |
| Employee   | `employee@example.com`            |
| Customer   | `customer@example.com`            |

---

## 5. Known Limitations

- No way of tracking orders
- No product to sell at the moment
- Checkout is a mock flow with no payment processes
- Cart is logged-in only
- No product reviews system yet
- No email notifications
- Images need to be updated when actually products are built
- No admin UI for adding products
---

_Last updated: June 2026_
