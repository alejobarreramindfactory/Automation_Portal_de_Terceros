Módulo de Convenios - Especificaciones y Reglas de Negocio
Este documento contiene el contexto de negocio y criterios de aceptación para la automatización de pruebas del módulo Convenios.

📌 Contexto General
El módulo de Convenios permite consultar las entidades/organismos emisores, listar sus convenios asociados y auditar los registros de recaudación diaria correspondientes.


🔑 Flujos Principales a Automatizar
1. Consulta de Organismos Habilitados
Criterios de Aceptación:
Debe listar únicamente los organismos activos o registrados en el sistema.
La respuesta debe requerir autenticación mediante token Bearer válido.
Si la petición se realiza sin credenciales, debe retornar un código de error 401 Unauthorized.

2. Listado de Convenios por Organismo
Criterios de Aceptación:
El parámetro organismoId es obligatorio para realizar la búsqueda.
Si se omite el organismoId, el sistema debe responder con un error de validación 400 Bad Request.
La consulta debe retornar la lista de convenios vinculados al organismo consultado.

3. Consulta de Recaudación Diaria
Criterios de Aceptación:
Requiere como datos obligatorios: idConvenio, fechaDesde y fechaHasta en formato ISO (yyyy-MM-dd).
Permite paginación mediante pageNumber y pageSize.
Permite exportación completa enviando el indicador all: true.
Si falta alguno de los campos obligatorios, debe responder con 400 Bad Request.


⚙️ Mapeo de Endpoints (Referencia OpenAPI)
HTTP
GET  /api/convenios/organismos
GET  /api/convenios?organismoId={organismoId}
POST /api/recaudacion/diaria

