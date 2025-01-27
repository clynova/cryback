
// Check if the 'users' collection exists
let collectionName = 'users';
let collection = db.getCollection(collectionName);

if (collection) {
  // If the collection exists, drop it
  db.getCollection(collectionName).drop();
  print(`The collection '${collectionName}' has been dropped.`);
} else {
  print(`The collection '${collectionName}' does not exist. Proceeding to create it.`);
}

// Create the 'users' collection
db.createCollection(collectionName);
print(`The collection '${collectionName}' has been created.`);

// Create indexes (optional)
db.getCollection(collectionName).createIndex({ email: 1 }, { unique: true });
print(`Unique index on 'email' created in 'users'.`);

// Insert sample documents
db.getCollection(collectionName).insertMany([
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "encrypted123",
    "address": {
      "street": "123 Fake Street",
      "city": "Example City",
      "state": "Example State",
      "postalCode": "12345",
      "country": "Example Country"
    },
    "phone": "1234567890",
    "roles": ["customer"],
    "registrationDate": ISODate("2023-10-01T00:00:00Z")
  },
  {
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "password": "encrypted456",
    "address": {
      "street": "456 Real Avenue",
      "city": "Another City",
      "state": "Another State",
      "postalCode": "67890",
      "country": "Another Country"
    },
    "phone": "0987654321",
    "roles": ["customer", "admin"],
    "registrationDate": ISODate("2023-10-02T00:00:00Z")
  }
]);
print(`Documents inserted into the '${collectionName}' collection.`);

// Check if the 'products' collection exists
collectionName = 'products';
collection = db.getCollection(collectionName);

if (collection) {
  // If the collection exists, drop it
  db.getCollection(collectionName).drop();
  print(`The collection '${collectionName}' has been dropped.`);
} else {
  print(`The collection '${collectionName}' does not exist. Proceeding to create it.`);
}

// Create the 'products' collection
db.createCollection(collectionName);
print(`The collection '${collectionName}' has been created.`);

// Create indexes (optional)
db.getCollection(collectionName).createIndex({ name: 1 }, { unique: false });
db.getCollection(collectionName).createIndex({ category: 1 }, { unique: false });
print(`Indexes created in 'products'.`);

// Insert sample documents
db.getCollection(collectionName).insertMany([
  {
    "name": "Oil Filter",
    "description": "High-quality oil filter for automobile engines.",
    "price": 15.99,
    "images": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
    "category": "maintenance",
    "stock": 100,
    "brand": "Example Brand",
    "model": "Example Model",
    "creationDate": ISODate("2023-10-01T00:00:00Z"),
    "updateDate": ISODate("2023-10-01T00:00:00Z")
  },
  {
    "name": "Car Battery",
    "description": "Durable and reliable car battery.",
    "price": 89.99,
    "images": ["https://example.com/image3.jpg"],
    "category": "electronics",
    "stock": 50,
    "brand": "Another Brand",
    "model": "Battery Model",
    "creationDate": ISODate("2023-10-03T00:00:00Z"),
    "updateDate": ISODate("2023-10-03T00:00:00Z")
  }
]);
print(`Documents inserted into the '${collectionName}' collection.`);// Check if the 'orders' collection exists
collectionName = 'orders';
collection = db.getCollection(collectionName);

if (collection) {
  // If the collection exists, drop it
  db.getCollection(collectionName).drop();
  print(`The collection '${collectionName}' has been dropped.`);
} else {
  print(`The collection '${collectionName}' does not exist. Proceeding to create it.`);
}

// Create the 'orders' collection
db.createCollection(collectionName);
print(`The collection '${collectionName}' has been created.`);

// Create indexes (optional)
db.getCollection(collectionName).createIndex({ userId: 1 }, { unique: false });
db.getCollection(collectionName).createIndex({ status: 1 }, { unique: false });
print(`Indexes created in 'orders'.`);

// Insert sample documents
db.getCollection(collectionName).insertMany([
  {
    "userId": "user1",
    "orderDate": ISODate("2023-10-05T10:30:00Z"),
    "status": "pending",
    "total": 31.98,
    "shippingAddress": {
      "street": "123 Fake Street",
      "city": "Example City",
      "state": "Example State",
      "postalCode": "12345",
      "country": "Example Country"
    },
    "paymentMethod": "credit card"
  },
  {
    "userId": "user2",
    "orderDate": ISODate("2023-10-06T12:45:00Z"),
    "status": "shipped",
    "total": 105.97,
    "shippingAddress": {
      "street": "456 Real Avenue",
      "city": "Another City",
      "state": "Another State",
      "postalCode": "67890",
      "country": "Another Country"
    },
    "paymentMethod": "paypal"
  }
]);
print(`Documents inserted into the '${collectionName}' collection.`);
// Check if the 'categories' collection exists
collectionName = 'categories';
collection = db.getCollection(collectionName);

if (collection) {
  // If the collection exists, drop it
  db.getCollection(collectionName).drop();
  print(`The collection '${collectionName}' has been dropped.`);
} else {
  print(`The collection '${collectionName}' does not exist. Proceeding to create it.`);
}

// Create the 'categories' collection
db.createCollection(collectionName);
print(`The collection '${collectionName}' has been created.`);

// Create indexes (optional)
db.getCollection(collectionName).createIndex({ name: 1 }, { unique: true });
print(`Unique index on 'name' created in 'categories'.`);

// Insert sample documents
db.getCollection(collectionName).insertMany([
  {
    "name": "maintenance",
    "description": "Products for regular automobile maintenance.",
    "createdAt": ISODate("2023-10-01T00:00:00Z")
  },
  {
    "name": "electronics",
    "description": "Electronic components for automobiles.",
    "createdAt": ISODate("2023-10-02T00:00:00Z")
  }
]);
print(`Documents inserted into the '${collectionName}' collection.`);// Check if the 'carts' collection exists
collectionName = 'carts';
collection = db.getCollection(collectionName);

if (collection) {
  // If the collection exists, drop it
  db.getCollection(collectionName).drop();
  print(`The collection '${collectionName}' has been dropped.`);
} else {
  print(`The collection '${collectionName}' does not exist. Proceeding to create it.`);
}

// Create the 'carts' collection
db.createCollection(collectionName);
print(`The collection '${collectionName}' has been created.`);

// Create indexes (optional)
db.getCollection(collectionName).createIndex({ userId: 1 }, { unique: false });
print(`Index on 'userId' created in 'carts'.`);

// Insert sample documents
db.getCollection(collectionName).insertMany([
  {
    "userId": "user1",
    "products": [
      {
        "productId": "product1",
        "quantity": 2
      }
    ],
    "updatedAt": ISODate("2023-10-05T10:30:00Z")
  },
  {
    "userId": "user2",
    "products": [
      {
        "productId": "product2",
        "quantity": 1
      }
    ],
    "updatedAt": ISODate("2023-10-06T12:45:00Z")
  }
]);
print(`Documents inserted into the '${collectionName}' collection.`);// Check if the 'reviews' collection exists
collectionName = 'reviews';
collection = db.getCollection(collectionName);

if (collection) {
  // If the collection exists, drop it
  db.getCollection(collectionName).drop();
  print(`The collection '${collectionName}' has been dropped.`);
} else {
  print(`The collection '${collectionName}' does not exist. Proceeding to create it.`);
}

// Create the 'reviews' collection
db.createCollection(collectionName);
print(`The collection '${collectionName}' has been created.`);

// Create indexes (optional)
db.getCollection(collectionName).createIndex({ productId: 1, userId: 1 }, { unique: true });
print(`Composite index on 'productId' and 'userId' created in 'reviews'.`);

// Insert sample documents
db.getCollection(collectionName).insertMany([
  {
    "productId": "product1",
    "userId": "user1",
    "rating": 5,
    "comment": "Excellent product, meets all expectations.",
    "createdAt": ISODate("2023-10-07T08:20:00Z")
  },
  {
    "productId": "product2",
    "userId": "user2",
    "rating": 4,
    "comment": "Good quality, but a bit pricey.",
    "createdAt": ISODate("2023-10-08T09:15:00Z")
  }
]);
print(`Documents inserted into the '${collectionName}' collection.`)
// Check if the 'reviews' collection exists
collectionName = 'reviews';
collection = db.getCollection(collectionName);

if (collection) {
  // If the collection exists, drop it
  db.getCollection(collectionName).drop();
  print(`The collection '${collectionName}' has been dropped.`);
} else {
  print(`The collection '${collectionName}' does not exist. Proceeding to create it.`);
}

// Create the 'reviews' collection
db.createCollection(collectionName);
print(`The collection '${collectionName}' has been created.`);

// Create indexes (optional)
db.getCollection(collectionName).createIndex({ productId: 1, userId: 1 }, { unique: true });
print(`Composite index on 'productId' and 'userId' created in 'reviews'.`);

// Insert sample documents
db.getCollection(collectionName).insertMany([
  {
    "productId": "product1",
    "userId": "user1",
    "rating": 5,
    "comment": "Excellent product, meets all expectations.",
    "createdAt": ISODate("2023-10-07T08:20:00Z")
  },
  {
    "productId": "product2",
    "userId": "user2",
    "rating": 4,
    "comment": "Good quality, but a bit pricey.",
    "createdAt": ISODate("2023-10-08T09:15:00Z")
  }
]);
print(`Documents inserted into the '${collectionName}' collection.`);





// Verifica si la colección 'orderDetails' existe
collectionName = 'orderDetails';
collection = db.getCollection(collectionName);

if (collection) {
  // Si la colección existe, elimínala
  db.getCollection(collectionName).drop();
  print(`La colección '${collectionName}' ha sido eliminada.`);
} else {
  print(`La colección '${collectionName}' no existía. Procediendo a crearla.`);
}

// Crea la colección 'orderDetails' nuevamente
db.createCollection(collectionName);
print(`La colección '${collectionName}' ha sido creada.`);

// Crear índices (opcional)
db.getCollection(collectionName).createIndex({ orderId: 1, productId: 1 }, { unique: true });
print(`Índice compuesto en 'orderId' y 'productId' creado en 'orderDetails'.`);

// Insertar documentos de ejemplo
db.getCollection(collectionName).insertMany([
  {
    "orderId": "order1",
    "productId": "product1",
    "quantity": 2,
    "price": 15.99
  },
  {
    "orderId": "order1",
    "productId": "product2",
    "quantity": 1,
    "price": 89.99
  },
  {
    "orderId": "order2",
    "productId": "product3",
    "quantity": 1,
    "price": 49.99
  }
]);
print(`Documentos insertados en la colección '${collectionName}'.`);