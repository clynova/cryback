const apiEndpoints = {
    'Usuarios': [
        { 
            method: 'POST', 
            path: '/api/user/registrar', 
            description: 'Registrar nuevo usuario',
            info: 'Envia un JSON con name, email y password.',
            params: {
                firstName: { type: 'string', required: true, desc: 'Nombre del usuario' },
                lastName: { type: 'string', required: true, desc: 'Apellido del usuario' },
                email: { type: 'string', required: true, desc: 'Correo electrónico' },
                password: { type: 'string', required: true, desc: 'Contraseña (mín. 8 caracteres)' },
                repPassword: { type: 'string', required: true, desc: 'Confirmación de contraseña' }
            }
        },
        { 
            method: 'GET', 
            path: '/api/user/confirmar/:token', 
            description: 'Confirmar cuenta de usuario',
            info: 'Requiere token recibido en email.'
        },
        { 
            method: 'POST', 
            path: '/api/user/autenticar', 
            description: 'Iniciar sesión',
            info: 'Envia un JSON con email y password.',
            params: {
                email: { type: 'string', required: true, desc: 'Correo electrónico' },
                password: { type: 'string', required: true, desc: 'Contraseña' }
            }
        },
        { 
            method: 'POST', 
            path: '/api/user/reset-password', 
            description: 'Solicitar restablecimiento de contraseña',
            info: 'Envia email con instrucciones.',
            params: {
                email: { type: 'string', required: true, desc: 'Correo electrónico registrado' }
            }
        },
        { 
            method: 'GET', 
            path: '/api/user/reset-password/:token', 
            description: 'Verificar token de restablecimiento',
            info: 'Requiere token válido recibido por correo.'
        },
        { 
            method: 'POST', 
            path: '/api/user/reset-password/:token', 
            description: 'Establecer nueva contraseña',
            info: 'Envia un JSON con la nueva contraseña.'
        },
        { 
            method: 'GET', 
            path: '/api/user/perfil', 
            description: 'Obtener perfil del usuario autenticado',
            info: 'Requiere token de autenticación.'
        },
        { 
            method: 'GET', 
            path: '/api/user/perfil/:userId', 
            description: 'Obtener perfil de un usuario específico',
            info: 'Ruta exclusiva para administradores.'
        },
        { 
            method: 'PUT', 
            path: '/api/user/perfil', 
            description: 'Actualizar perfil del usuario autenticado',
            info: 'Envia un JSON con los campos a actualizar.'
        },
        { 
            method: 'PUT', 
            path: '/api/user/change-password', 
            description: 'Cambiar contraseña del usuario autenticado',
            info: 'Envia un JSON con contraseña actual y nueva.'
        },
        { 
            method: 'DELETE', 
            path: '/api/user/delete-account/:userId', 
            description: 'Eliminar cuenta de usuario',
            info: 'Elimina la cuenta propia o de otro usuario si es admin.'
        },
        { 
            method: 'GET', 
            path: '/api/user/all', 
            description: 'Obtener todos los usuarios',
            info: 'Ruta protegida para administradores.'
        },
        { 
            method: 'POST', 
            path: '/api/user/logout', 
            description: 'Cerrar sesión',
            info: 'Invalidar token de autenticación.'
        }
    ],
    'Categorías': [
        { 
            method: 'GET', 
            path: '/api/category', 
            description: 'Obtener todas las categorías',
            info: 'No requiere parámetros.'
        },
        { 
            method: 'POST', 
            path: '/api/category', 
            description: 'Crear nueva categoría',
            info: 'Envia un JSON con name y descripción opcional.',
            params: {
                name: { type: 'string', required: true, desc: 'Nombre de la categoría' },
                description: { type: 'string', required: false, desc: 'Descripción de la categoría' }
            }
        },
        { 
            method: 'GET', 
            path: '/api/category/:id', 
            description: 'Obtener detalle de una categoría',
            info: 'Requiere el id de la categoría en la URL.'
        },
        { 
            method: 'PUT', 
            path: '/api/category/:id', 
            description: 'Actualizar categoría',
            info: 'Requiere el id en la URL y JSON con campos a actualizar.'
        },
        { 
            method: 'DELETE', 
            path: '/api/category/:id', 
            description: 'Eliminar categoría',
            info: 'Requiere el id en la URL.'
        }
    ],
    'Productos': [
        { 
            method: 'GET', 
            path: '/api/product', 
            description: 'Obtener todos los productos',
            info: 'Soporta filtros opcionales por query parameters.'
        },
        { 
            method: 'GET', 
            path: '/api/product/:id', 
            description: 'Obtener producto por ID',
            info: 'Requiere el id en la URL.'
        },
        { 
            method: 'GET', 
            path: '/api/product/search', 
            description: 'Buscar productos',
            info: 'Utiliza query parameters para filtrar por nombre, categoría, etc.'
        },
        { 
            method: 'POST', 
            path: '/api/product', 
            description: 'Crear nuevo producto',
            info: 'Envia un JSON con name, price, description, etc.',
            params: {
                name: { type: 'string', required: true, desc: 'Nombre del producto' },
                price: { type: 'number', required: true, desc: 'Precio del producto' },
                description: { type: 'string', required: true, desc: 'Descripción del producto' },
                categoryId: { type: 'string', required: true, desc: 'ID de la categoría' },
                stock: { type: 'number', required: true, desc: 'Cantidad disponible' },
                images: { type: 'array', required: false, desc: 'URLs de las imágenes' }
            }
        },
        { 
            method: 'PUT', 
            path: '/api/product/:id', 
            description: 'Actualizar producto',
            info: 'Requiere el id en la URL y JSON con campos a actualizar.'
        },
        { 
            method: 'DELETE', 
            path: '/api/product/:id', 
            description: 'Eliminar producto',
            info: 'Requiere el id en la URL.'
        }
    ],
    'Carrito': [
        { 
            method: 'GET', 
            path: '/api/cart', 
            description: 'Ver carrito actual',
            info: 'Requiere token de autenticación.'
        },
        { 
            method: 'POST', 
            path: '/api/cart/add', 
            description: 'Añadir producto al carrito',
            info: 'Envia JSON con id de producto y cantidad.',
            params: {
                productId: { type: 'string', required: true, desc: 'ID del producto' },
                quantity: { type: 'number', required: true, desc: 'Cantidad a agregar' }
            }
        },
        { 
            method: 'PUT', 
            path: '/api/cart/:itemId', 
            description: 'Actualizar cantidad de producto',
            info: 'Requiere el itemId en la URL y cantidad nueva en el JSON.'
        },
        { 
            method: 'DELETE', 
            path: '/api/cart/:itemId', 
            description: 'Eliminar producto del carrito',
            info: 'Requiere el itemId en la URL.'
        },
        { 
            method: 'DELETE', 
            path: '/api/cart', 
            description: 'Vaciar carrito completo',
            info: 'Elimina todos los productos del carrito.'
        }
    ],
    'Pedidos': [
        { 
            method: 'GET', 
            path: '/api/order', 
            description: 'Ver todos los pedidos',
            info: 'Requiere autenticación; puede filtrar por status.'
        },
        { 
            method: 'POST', 
            path: '/api/order', 
            description: 'Crear nuevo pedido',
            info: 'Envia JSON con id de usuario, productos y dirección.',
            params: {
                products: { 
                    type: 'array', 
                    required: true, 
                    desc: 'Array de productos [{productId, quantity}]' 
                },
                shippingAddress: { 
                    type: 'object', 
                    required: true, 
                    desc: 'Dirección de envío {street, city, state, zipCode}'
                },
                paymentMethod: { type: 'string', required: true, desc: 'Método de pago' }
            }
        },
        { 
            method: 'GET', 
            path: '/api/order/:id', 
            description: 'Ver detalles de un pedido',
            info: 'Requiere el id del pedido en la URL.'
        },
        { 
            method: 'PUT', 
            path: '/api/order/:id/status', 
            description: 'Actualizar estado de un pedido',
            info: 'Requiere el id del pedido y nuevo estado en el JSON.'
        },
        { 
            method: 'DELETE', 
            path: '/api/order/:id', 
            description: 'Cancelar pedido',
            info: 'Requiere el id del pedido; puede estar sujeto a restricciones.'
        }
    ],
    'Reseñas': [
        { 
            method: 'GET', 
            path: '/api/review/product/:id', 
            description: 'Ver reseñas de un producto',
            info: 'Requiere el id del producto en la URL.'
        },
        { 
            method: 'POST', 
            path: '/api/review', 
            description: 'Crear nueva reseña',
            info: 'Envia JSON con id de producto, rating y comentario.',
            params: {
                productId: { type: 'string', required: true, desc: 'ID del producto' },
                rating: { type: 'number', required: true, desc: 'Calificación (1-5)' },
                comment: { type: 'string', required: true, desc: 'Comentario de la reseña' }
            }
        },
        { 
            method: 'PUT', 
            path: '/api/review/:id', 
            description: 'Actualizar reseña',
            info: 'Requiere el id de la reseña y JSON con campos a actualizar.'
        },
        { 
            method: 'DELETE', 
            path: '/api/review/:id', 
            description: 'Eliminar reseña',
            info: 'Requiere el id de la reseña en la URL.'
        },
        { 
            method: 'GET', 
            path: '/api/review/user/:userId', 
            description: 'Obtener reseñas de un usuario',
            info: 'Requiere el id del usuario en la URL.'
        }
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
                ${endpoint.info ? `<div class="info">${endpoint.info}</div>` : ''}
                ${endpoint.params ? `
                    <div class="params">
                        <h4>Parámetros:</h4>
                        <ul>
                            ${Object.entries(endpoint.params).map(([paramName, paramDetails]) => `
                                <li>
                                    <code>${paramName}</code> (${paramDetails.type})
                                    ${paramDetails.required ? '<span class="required">*</span>' : ''}
                                    - ${paramDetails.desc}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `).join('')}
    `).join('');
};
