# 🛒 Project 5 – Products Management  

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)  
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)  
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)  
![AWS S3](https://img.shields.io/badge/AWS%20S3-569A31?style=for-the-badge&logo=amazons3&logoColor=white)  
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)  
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)  


---

## ✨ Key Highlights  
- 👤 **User Management** – Register, Login, Profile CRUD with S3 image upload & encrypted password  
- 📦 **Product Management** – Add, Update, Delete & Filter products (with image uploads to S3)  
- 🛒 **Cart Management** – Add/remove products, update quantities, and calculate totals  
- 📑 **Order Management** – Place & update orders with cancellable status  
- 🔒 **Authentication & Authorization** – JWT Bearer tokens in `Authorization` header  
- ⚡ Feature-wise workflow: Model → API → Testing → Deployment → Integration  

---

## 🏗 Tech Stack  
- **Node.js** – JavaScript runtime  
- **Express.js** – Backend framework  
- **MongoDB + Mongoose** – NoSQL database  
- **JWT** – Secure authentication  
- **AWS S3** – File storage (profile & product images)  
- **Bcrypt** – Password encryption  
- **Postman** – API testing  

---


---

## 🔑 Features & APIs  

### 👤 User APIs  
- **POST** `/register` → Create user (with encrypted password + S3 image upload)  
- **POST** `/login` → Login & get JWT + userId  
- **GET** `/user/:userId/profile` → Get profile (Auth required)  
- **PUT** `/user/:userId/profile` → Update profile (Auth required)  

### 📦 Product APIs  
- **POST** `/products` → Create product (with S3 image upload)  
- **GET** `/products` → Fetch products (filters: size, name, price range, sort)  
- **GET** `/products/:productId` → Fetch product by ID  
- **PUT** `/products/:productId` → Update product  
- **DELETE** `/products/:productId` → Soft delete product  

### 🛒 Cart APIs (Auth required)  
- **POST** `/users/:userId/cart` → Add to cart / create cart  
- **PUT** `/users/:userId/cart` → Update cart (remove/decrement product)  
- **GET** `/users/:userId/cart` → Get user cart  
- **DELETE** `/users/:userId/cart` → Clear cart  

### 📑 Order APIs (Auth required)  
- **POST** `/users/:userId/orders` → Create order from cart  
- **PUT** `/users/:userId/orders` → Update order status  

---

## ✅ Testing Instructions  
1. Clone repo & run `npm install`  
2. Setup `.env` with MongoDB, AWS S3 credentials, JWT secret  
3. Start server → `npm start`  
4. Import Postman collection (**Project 5 Shopping Cart**) & test APIs  

---

## 📌 Response Structure  

### ✅ Success  
```yaml
{
  status: true,
  message: "Success",
  data: { }
}

