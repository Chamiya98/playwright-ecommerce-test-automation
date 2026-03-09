# Playwright E-Commerce Test Automation

## 📌 Project Overview

This project contains automated end-to-end UI tests for an eCommerce web application using **Playwright**.
The test framework follows the **Page Object Model (POM)** design pattern to improve code maintainability, reusability, and readability.

## 🚀 Technologies Used

* Playwright
* TypeScript
* Node.js
* Page Object Model (POM)
* GitHub

## 📂 Project Structure

```
project-root
│
├── pages/                # Page Object classes
│   ├── HomePage.ts
│   ├── SearchResultsPage.ts
│   └── ProductPage.ts
│
├── tests/                # Test files
│   └── test.spec.ts
│
├── test-data/            # Test data
│   └── productData.json
│
├── playwright.config.ts
└── package.json
```

## ✅ Test Scenarios

* Verify related products section is displayed
* Verify maximum number of related products
* Verify Add to Cart from related product
* Verify price range of similar products
* Verify similar products belong to same category
* Verify main product is not shown in similar product list
* Verify main product is not shown in similar products
* Verify navigation when clicking similar product
* Verify 'See All' link


## 📊 Features

* Page Object Model structure
* Reusable test methods
* Clean and maintainable code
* Automated UI testing with Playwright

## 👨‍💻 Author

Jayashan Chamika

