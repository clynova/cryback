let collectionName = 'usuarios';
let collection = db.getCollection(collectionName);

if (collection) {
  // Si la colección existe, elimínala
  db.getCollection(collectionName).drop();
  print(`La colección '${collectionName}' ha sido eliminada.`);
} else {
  print(`La colección '${collectionName}' no existía. Procediendo a crearla.`);
}

// Crea la colección 'usuarios' nuevamente
db.createCollection(collectionName);
print(`La colección '${collectionName}' ha sido creada.`);

// Crear índices (opcional)
db.getCollection(collectionName).createIndex({ correoElectronico: 1 }, { unique: true });
print(`Índice único en 'correoElectronico' creado en 'usuarios'.`);

// Insertar documentos de ejemplo
db.getCollection(collectionName).insertMany([
  {
    "nombre": "Juan",
    "apellido": "Pérez",
    "correoElectronico": "juan.perez@example.com",
    "contraseña": "encriptada123",
    "direccion": {
      "calle": "Calle Falsa 123",
      "ciudad": "Ciudad Ejemplo",
      "estado": "Estado Ejemplo",
      "codigoPostal": "12345",
      "pais": "País Ejemplo"
    },
    "telefono": "1234567890",
    "roles": ["cliente"],
    "fechaRegistro": ISODate("2023-10-01T00:00:00Z")
  },
  {
    "nombre": "María",
    "apellido": "Gómez",
    "correoElectronico": "maria.gomez@example.com",
    "contraseña": "encriptada456",
    "direccion": {
      "calle": "Avenida Siempreviva 742",
      "ciudad": "Springfield",
      "estado": "Estado Ejemplo",
      "codigoPostal": "54321",
      "pais": "País Ejemplo"
    },
    "telefono": "0987654321",
    "roles": ["cliente", "admin"],
    "fechaRegistro": ISODate("2023-10-02T00:00:00Z")
  }
]);
print(`Documentos insertados en la colección '${collectionName}'.`);

collectionName = 'productos';
collection = db.getCollection(collectionName);

if (collection) {
  // Si la colección existe, elimínala
  db.getCollection(collectionName).drop();
  print(`La colección '${collectionName}' ha sido eliminada.`);
} else {
  print(`La colección '${collectionName}' no existía. Procediendo a crearla.`);
}

// Crea la colección 'productos' nuevamente
db.createCollection(collectionName);
print(`La colección '${collectionName}' ha sido creada.`);

// Crear índices (opcional)
db.getCollection(collectionName).createIndex({ nombre: 1 }, { unique: false });
db.getCollection(collectionName).createIndex({ categoria: 1 }, { unique: false });
print(`Índices creados en 'productos'.`);

// Insertar documentos de ejemplo
db.getCollection(collectionName).insertMany([
  {
    "nombre": "Filtro de Aceite",
    "descripcion": "Filtro de aceite de alta calidad para motores de automóviles.",
    "precio": 15.99,
    "imagenes": ["https://ejemplo.com/imagen1.jpg", "https://ejemplo.com/imagen2.jpg"],
    "categoria": "mantenimiento",
    "stock": 100,
    "marca": "Marca Ejemplo",
    "modelo": "Modelo Ejemplo",
    "fechaCreacion": ISODate("2023-10-01T00:00:00Z"),
    "fechaActualizacion": ISODate("2023-10-01T00:00:00Z")
  },
  {
    "nombre": "Batería para Coche",
    "descripcion": "Batería de coche duradera y confiable.",
    "precio": 89.99,
    "imagenes": ["https://ejemplo.com/imagen3.jpg"],
    "categoria": "electrónica",
    "stock": 50,
    "marca": "Otra Marca",
    "modelo": "Modelo Batería",
    "fechaCreacion": ISODate("2023-10-03T00:00:00Z"),
    "fechaActualizacion": ISODate("2023-10-03T00:00:00Z")
  }
]);
print(`Documentos insertados en la colección '${collectionName}'.`);
// Verifica si la colección 'pedidos' existe
collectionName = 'pedidos';
collection = db.getCollection(collectionName);

if (collection) {
  // Si la colección existe, elimínala
  db.getCollection(collectionName).drop();
  print(`La colección '${collectionName}' ha sido eliminada.`);
} else {
  print(`La colección '${collectionName}' no existía. Procediendo a crearla.`);
}

// Crea la colección 'pedidos' nuevamente
db.createCollection(collectionName);
print(`La colección '${collectionName}' ha sido creada.`);

// Crear índices (opcional)
db.getCollection(collectionName).createIndex({ usuarioId: 1 }, { unique: false });
db.getCollection(collectionName).createIndex({ estado: 1 }, { unique: false });
print(`Índices creados en 'pedidos'.`);

// Insertar documentos de ejemplo
db.getCollection(collectionName).insertMany([
  {
    "usuarioId": "user1",
    "fechaPedido": ISODate("2023-10-05T10:30:00Z"),
    "estado": "pendiente",
    "total": 31.98,
    "direccionEnvio": {
      "calle": "Calle Falsa 123",
      "ciudad": "Ciudad Ejemplo",
      "estado": "Estado Ejemplo",
      "codigoPostal": "12345",
      "pais": "País Ejemplo"
    },
    "metodoPago": "tarjeta"
  },
  {
    "usuarioId": "user2",
    "fechaPedido": ISODate("2023-10-06T12:45:00Z"),
    "estado": "enviado",
    "total": 105.97,
    "direccionEnvio": {
      "calle": "Avenida Siempreviva 742",
      "ciudad": "Springfield",
      "estado": "Estado Ejemplo",
      "codigoPostal": "54321",
      "pais": "País Ejemplo"
    },
    "metodoPago": "paypal"
  }
]);
print(`Documentos insertados en la colección '${collectionName}'.`);

// Verifica si la colección 'categorias' existe
collectionName = 'categorias';
collection = db.getCollection(collectionName);

if (collection) {
  // Si la colección existe, elimínala
  db.getCollection(collectionName).drop();
  print(`La colección '${collectionName}' ha sido eliminada.`);
} else {
  print(`La colección '${collectionName}' no existía. Procediendo a crearla.`);
}

// Crea la colección 'categorias' nuevamente
db.createCollection(collectionName);
print(`La colección '${collectionName}' ha sido creada.`);

// Crear índices (opcional)
db.getCollection(collectionName).createIndex({ nombre: 1 }, { unique: true });
print(`Índice único en 'nombre' creado en 'categorias'.`);

// Insertar documentos de ejemplo
db.getCollection(collectionName).insertMany([
  {
    "nombre": "mantenimiento",
    "descripcion": "Productos para el mantenimiento regular del automóvil.",
    "createdAt": ISODate("2023-10-01T00:00:00Z")
  },
  {
    "nombre": "electrónica",
    "descripcion": "Componentes electrónicos para automóviles.",
    "createdAt": ISODate("2023-10-02T00:00:00Z")
  }
]);
print(`Documentos insertados en la colección '${collectionName}'.`);

// Verifica si la colección 'carritos' existe
collectionName = 'carritos';
collection = db.getCollection(collectionName);

if (collection) {
  // Si la colección existe, elimínala
  db.getCollection(collectionName).drop();
  print(`La colección '${collectionName}' ha sido eliminada.`);
} else {
  print(`La colección '${collectionName}' no existía. Procediendo a crearla.`);
}

// Crea la colección 'carritos' nuevamente
db.createCollection(collectionName);
print(`La colección '${collectionName}' ha sido creada.`);

// Crear índices (opcional)
db.getCollection(collectionName).createIndex({ usuarioId: 1 }, { unique: false });
print(`Índice en 'usuarioId' creado en 'carritos'.`);

// Insertar documentos de ejemplo
db.getCollection(collectionName).insertMany([
  {
    "usuarioId": "user1",
    "productos": [
      {
        "productoId": "producto1",
        "cantidad": 2
      }
    ],
    "updatedAt": ISODate("2023-10-05T10:30:00Z")
  },
  {
    "usuarioId": "user2",
    "productos": [
      {
        "productoId": "producto2",
        "cantidad": 1
      }
    ],
    "updatedAt": ISODate("2023-10-06T12:45:00Z")
  }
]);
print(`Documentos insertados en la colección '${collectionName}'.`);

// Verifica si la colección 'reseñas' existe
collectionName = 'reseñas';
collection = db.getCollection(collectionName);

if (collection) {
  // Si la colección existe, elimínala
  db.getCollection(collectionName).drop();
  print(`La colección '${collectionName}' ha sido eliminada.`);
} else {
  print(`La colección '${collectionName}' no existía. Procediendo a crearla.`);
}

// Crea la colección 'reseñas' nuevamente
db.createCollection(collectionName);
print(`La colección '${collectionName}' ha sido creada.`);

// Crear índices (opcional)
db.getCollection(collectionName).createIndex({ productoId: 1, usuarioId: 1 }, { unique: true });
print(`Índice compuesto en 'productoId' y 'usuarioId' creado en 'reseñas'.`);

// Insertar documentos de ejemplo
db.getCollection(collectionName).insertMany([
  {
    "productoId": "producto1",
    "usuarioId": "user1",
    "rating": 5,
    "comment": "Excelente producto, cumple con todas las expectativas.",
    "createdAt": ISODate("2023-10-07T08:20:00Z")
  },
  {
    "productoId": "producto2",
    "usuarioId": "user2",
    "rating": 4,
    "comment": "Buena calidad, pero un poco caro.",
    "createdAt": ISODate("2023-10-08T09:15:00Z")
  }
]);
print(`Documentos insertados en la colección '${collectionName}'.`);

// Verifica si la colección 'reseñas' existe
collectionName = 'reseñas';
collection = db.getCollection(collectionName);

if (collection) {
  // Si la colección existe, elimínala
  db.getCollection(collectionName).drop();
  print(`La colección '${collectionName}' ha sido eliminada.`);
} else {
  print(`La colección '${collectionName}' no existía. Procediendo a crearla.`);
}

// Crea la colección 'reseñas' nuevamente
db.createCollection(collectionName);
print(`La colección '${collectionName}' ha sido creada.`);

// Crear índices (opcional)
db.getCollection(collectionName).createIndex({ productoId: 1, usuarioId: 1 }, { unique: true });
print(`Índice compuesto en 'productoId' y 'usuarioId' creado en 'reseñas'.`);

// Insertar documentos de ejemplo
db.getCollection(collectionName).insertMany([
  {
    "productoId": "producto1",
    "usuarioId": "user1",
    "rating": 5,
    "comment": "Excelente producto, cumple con todas las expectativas.",
    "createdAt": ISODate("2023-10-07T08:20:00Z")
  },
  {
    "productoId": "producto2",
    "usuarioId": "user2",
    "rating": 4,
    "comment": "Buena calidad, pero un poco caro.",
    "createdAt": ISODate("2023-10-08T09:15:00Z")
  }
]);
print(`Documentos insertados en la colección '${collectionName}'.`);
