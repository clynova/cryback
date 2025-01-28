
// Crear la colección USERS
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["firstName", "lastName", "email", "password", "createdAt"],
      properties: {
        firstName: { bsonType: "string" },
        lastName: { bsonType: "string" },
        email: { bsonType: "string" },
        password: { bsonType: "string" },
        address: {
          bsonType: "object",
          properties: {
            street: { bsonType: "string" },
            city: { bsonType: "string" },
            state: { bsonType: "string" },
            zipCode: { bsonType: "string" },
            country: { bsonType: "string" },
          },
        },
        phone: { bsonType: "string" },
        roles: { bsonType: "array", items: { bsonType: "string" } },
        createdAt: { bsonType: "date" },
      },
    },
  },
});

// Insertar un usuario de ejemplo
db.users.insertOne({
  firstName: "Juan",
  lastName: "Pérez",
  email: "juan@example.com",
  password: "$2b$10$examplehashedpassword", // Contraseña hasheada
  address: {
    street: "Calle Falsa 123",
    city: "Ciudad de México",
    state: "CDMX",
    zipCode: "12345",
    country: "México",
  },
  phone: "555-123-4567",
  roles: ["user"],
  createdAt: new Date(),
});

// Crear la colección CATEGORIES
db.createCollection("categories", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "createdAt"],
      properties: {
        name: { bsonType: "string" },
        description: { bsonType: "string" },
        createdAt: { bsonType: "date" },
      },
    },
  },
});

// Insertar una categoría de ejemplo
db.categories.insertOne({
  name: "Interior",
  description: "Accesorios para el interior del automóvil.",
  createdAt: new Date(),
});

// Crear la colección PRODUCTS
db.createCollection("products", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "description", "price", "categoryId", "createdAt"],
      properties: {
        name: { bsonType: "string" },
        description: { bsonType: "string" },
        price: { bsonType: "number" },
        images: { bsonType: "array", items: { bsonType: "string" } },
        categoryId: { bsonType: "objectId" },
        stock: { bsonType: "number" },
        brandId: { bsonType: "objectId" },
        modelId: { bsonType: "objectId" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
      },
    },
  },
});

// Insertar un producto de ejemplo
db.products.insertOne({
  name: "Volante Deportivo",
  description: "Volante de cuero con detalles en aluminio.",
  price: 150,
  images: ["volante1.jpg", "volante2.jpg"],
  categoryId: ObjectId("654d4b5e4f1a2b3c4d5e6f7a"), // Reemplaza con un ID válido
  stock: 10,
  brandId: ObjectId("654d4b5e4f1a2b3c4d5e6f7b"), // Reemplaza con un ID válido
  modelId: ObjectId("654d4b5e4f1a2b3c4d5e6f7c"), // Reemplaza con un ID válido
  createdAt: new Date(),
  updatedAt: new Date(),
});

// Crear la colección ORDERS
db.createCollection("orders", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "orderDate", "status", "total", "paymentMethod"],
      properties: {
        userId: { bsonType: "objectId" },
        orderDate: { bsonType: "date" },
        status: { bsonType: "string" },
        total: { bsonType: "number" },
        shippingAddress: {
          bsonType: "object",
          properties: {
            street: { bsonType: "string" },
            city: { bsonType: "string" },
            state: { bsonType: "string" },
            zipCode: { bsonType: "string" },
            country: { bsonType: "string" },
          },
        },
        paymentMethod: { bsonType: "string" },
      },
    },
  },
});

// Insertar un pedido de ejemplo
db.orders.insertOne({
  userId: ObjectId("654d4b5e4f1a2b3c4d5e6f7d"), // Reemplaza con un ID válido
  orderDate: new Date(),
  status: "pending",
  total: 300,
  shippingAddress: {
    street: "Avenida Siempre Viva 742",
    city: "Springfield",
    state: "IL",
    zipCode: "62704",
    country: "USA",
  },
  paymentMethod: "credit_card",
});

// Crear la colección ORDER_DETAILS
db.createCollection("order_details", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["orderId", "productId", "quantity", "price"],
      properties: {
        orderId: { bsonType: "objectId" },
        productId: { bsonType: "objectId" },
        quantity: { bsonType: "number" },
        price: { bsonType: "number" },
      },
    },
  },
});

// Insertar un detalle de pedido de ejemplo
db.order_details.insertOne({
  orderId: ObjectId("654d4b5e4f1a2b3c4d5e6f7e"), // Reemplaza con un ID válido
  productId: ObjectId("654d4b5e4f1a2b3c4d5e6f7f"), // Reemplaza con un ID válido
  quantity: 2,
  price: 150,
});

// Crear la colección CARTS
db.createCollection("carts", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "products", "updatedAt"],
      properties: {
        userId: { bsonType: "objectId" },
        products: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              productId: { bsonType: "objectId" },
              quantity: { bsonType: "number" },
              price: { bsonType: "number" },
            },
          },
        },
        updatedAt: { bsonType: "date" },
      },
    },
  },
});

// Insertar un carrito de ejemplo
db.carts.insertOne({
  userId: ObjectId("654d4b5e4f1a2b3c4d5e6f7d"), // Reemplaza con un ID válido
  products: [
    {
      productId: ObjectId("654d4b5e4f1a2b3c4d5e6f7f"), // Reemplaza con un ID válido
      quantity: 1,
      price: 150,
    },
  ],
  updatedAt: new Date(),
});

// Crear la colección REVIEWS
db.createCollection("reviews", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["productId", "userId", "rating", "createdAt"],
      properties: {
        productId: { bsonType: "objectId" },
        userId: { bsonType: "objectId" },
        rating: { bsonType: "number", minimum: 1, maximum: 5 },
        comment: { bsonType: "string" },
        createdAt: { bsonType: "date" },
      },
    },
  },
});

// Insertar una reseña de ejemplo
db.reviews.insertOne({
  productId: ObjectId("654d4b5e4f1a2b3c4d5e6f7f"), // Reemplaza con un ID válido
  userId: ObjectId("654d4b5e4f1a2b3c4d5e6f7d"), // Reemplaza con un ID válido
  rating: 5,
  comment: "Excelente producto, muy buena calidad.",
  createdAt: new Date(),
});