const apiEndpoints = {
    'Usuarios': [
        { method: 'GET', path: '/api/user', description: 'Obtener todos los usuarios' },
        { method: 'POST', path: '/api/user/register', description: 'Registrar nuevo usuario' },
        { method: 'POST', path: '/api/user/login', description: 'Iniciar sesión' },
        { method: 'GET', path: '/api/user/profile', description: 'Obtener perfil del usuario' }
    ],
    'Categorías': [
        { method: 'GET', path: '/api/category', description: 'Obtener todas las categorías' },
        { method: 'POST', path: '/api/category', description: 'Crear nueva categoría' },
        { method: 'PUT', path: '/api/category/:id', description: 'Actualizar categoría' },
        { method: 'DELETE', path: '/api/category/:id', description: 'Eliminar categoría' }
    ],
    'Productos': [
        { method: 'GET', path: '/api/product', description: 'Obtener todos los productos' },
        { method: 'GET', path: '/api/product/:id', description: 'Obtener producto por ID' },
        { method: 'POST', path: '/api/product', description: 'Crear nuevo producto' },
        { method: 'PUT', path: '/api/product/:id', description: 'Actualizar producto' },
        { method: 'DELETE', path: '/api/product/:id', description: 'Eliminar producto' }
    ],
    'Carrito': [
        { method: 'GET', path: '/api/cart', description: 'Ver carrito actual' },
        { method: 'POST', path: '/api/cart/add', description: 'Añadir producto al carrito' },
        { method: 'PUT', path: '/api/cart/:itemId', description: 'Actualizar cantidad de producto' },
        { method: 'DELETE', path: '/api/cart/:itemId', description: 'Eliminar producto del carrito' }
    ],
    'Pedidos': [
        { method: 'GET', path: '/api/order', description: 'Ver todos los pedidos' },
        { method: 'POST', path: '/api/order', description: 'Crear nuevo pedido' },
        { method: 'GET', path: '/api/order/:id', description: 'Ver detalles de un pedido' }
    ],
    'Reseñas': [
        { method: 'GET', path: '/api/review/product/:id', description: 'Ver reseñas de un producto' },
        { method: 'POST', path: '/api/review', description: 'Crear nueva reseña' },
        { method: 'PUT', path: '/api/review/:id', description: 'Actualizar reseña' },
        { method: 'DELETE', path: '/api/review/:id', description: 'Eliminar reseña' }
    ]
};

export const getApiDocs = () => {
    return Object.entries(apiEndpoints).map(([section, endpoints]) => `
        <h2>${section}</h2>
        ${endpoints.map(endpoint => `
            <div class="endpoint">
                <span class="method ${endpoint.method.toLowerCase()}">${endpoint.method}</span>
                <code>${endpoint.path}</code>
                <div class="description">${endpoint.description}</div>
            </div>
        `).join('')}
    `).join('');
};
