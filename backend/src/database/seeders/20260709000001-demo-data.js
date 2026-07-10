const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface) => {
    // Generate salt and hash for admin password "admin123"
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Insert Admin User
    await queryInterface.bulkInsert("users", [
      {
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        role: "ADMIN",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Insert Products
    await queryInterface.bulkInsert("products", [
      {
        name: "Wireless Mouse",
        sku: "PROD-MSE-001",
        description: "Ergonomic 2.4GHz wireless mouse with optical sensor.",
        price: 25.99,
        quantity: 120,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Mechanical Keyboard",
        sku: "PROD-KBD-002",
        description: "RGB backlit mechanical keyboard with blue switches.",
        price: 89.99,
        quantity: 45,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "27-inch IPS Monitor",
        sku: "PROD-MON-003",
        description: "1440p 144Hz IPS monitor with ultra-thin bezels.",
        price: 299.99,
        quantity: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "USB-C Hub Multiport Adapter",
        sku: "PROD-HUB-004",
        description: "8-in-1 USB-C hub with HDMI, Ethernet, and SD card reader.",
        price: 39.99,
        quantity: 80,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Noise Cancelling Headphones",
        sku: "PROD-HP-005",
        description: "Over-ear Bluetooth headphones with active noise cancellation.",
        price: 199.99,
        quantity: 5, // Low stock product
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Insert Customers
    await queryInterface.bulkInsert("customers", [
      {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+15551234567",
        address: "123 Main St, New York, NY 10001",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "+15559876543",
        address: "456 Oak Ave, San Francisco, CA 94102",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Acme Corporation",
        email: "info@acme.com",
        phone: "+15558889999",
        address: "789 Industrial Pkwy, Chicago, IL 60607",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("users", null, {});
    await queryInterface.bulkDelete("products", null, {});
    await queryInterface.bulkDelete("customers", null, {});
  },
};
