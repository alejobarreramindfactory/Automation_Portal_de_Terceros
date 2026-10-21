Módulo de Recaudación - Especificaciones y Reglas de Negocio

Este documento contiene el contexto de negocio, reglas de validación y criterios de aceptación para la automatización de pruebas del módulo Recaudación (Recaudación Diaria, Recaudación Acumulada y Consulta por Filtros).


📌 Contexto General
El módulo de Recaudación del Portal de Terceros permite a los usuarios autorizados (Externos, DGR y Administradores):
Consultar la recaudación diaria distribuida por DGR para un organismo y convenio determinado.
Generar y descargar reportes acumulados en formato Excel con columnas dinámicas por convenio.
Buscar operaciones de pago puntuales mediante filtros específicos y exportar grillas de resultados.


🔑 Flujos Principales a Automatizar
1. Recaudación Diaria (HU-RC-01)
Criterios de Aceptación:
Carga Inicial y Navegación:
Al ingresar a la pestaña, no debe ejecutar búsquedas automáticas ni mostrar resultados previos.
Debe precargar un rango por defecto correspondiente a los últimos 31 días.
Al abandonar la pantalla y reingresar, se limpian filtros y resultados obtenidos.
Visibilidad de Filtros por Rol:
Usuario Externo con único organismo: El filtro Organismo se oculta y se aplica automáticamente.
Usuario Externo con múltiples organismos / Usuario DGR / Administrador: El filtro Organismo es visible y obligatorio.
Dependencia y Selección:
El filtro Convenio es obligatorio y depende del Organismo seleccionado (sólo muestra convenios del organismo).
Al cambiar de Organismo, se limpia el Convenio seleccionado y se recarga la lista.
Grilla de Resultados y Paginación:
Al presionar Buscar, muestra la cantidad total de registros y la columna Organismo siempre visible.
Los resultados deben ordenarse por Fecha de Distribución descendente y paginarse de a 10 registros por página.
Cada registro debe permitir descargar su comprobante PDF asociado.
Exportaciones (CSV / XLSM):
Permite exportar a CSV y XLSM incluyendo todos los registros de la consulta respetando los filtros.
Formato de Nombre de Archivo: [ORGANISMO][FECHADESDE][FECHAHASTA].[EXTENSION] (donde Organismo son los primeros 10 caracteres sin espacios, y fechas en formato ddmmaaaa).
Validaciones y Mensajes de Error:
Bloquear la búsqueda si falta Organismo, Convenio, o si el rango entre Fecha Desde y Fecha Hasta es mayor a 31 días o la fecha desde es posterior a la hasta.
Si no existen registros, mostrar: "No se encontraron registros para los criterios seleccionados".

2. Recaudación Acumulada - Exportación Excel (HU-RC-02)
Criterios de Aceptación:
Preselección Inteligente:
Si el usuario o el ámbito tiene un único Organismo, debe preseleccionarse.
Si el Organismo posee un único Convenio disponible, debe preseleccionarse.
Validaciones de Rango de Fechas:
Fecha Desde y Fecha Hasta son obligatorias.
No se permiten fechas futuras.
El rango máximo permitido es de 60 días corridos.
Fecha Hasta debe ser mayor o igual a Fecha Desde.
Estructura e Inclusión de Datos:
Si existen registros revertidos en el período, deben incluirse en el archivo Excel.
Si la consulta no devuelve registros, se debe generar un archivo Excel con encabezados pero sin datos.
Columnas Dinámicas por Convenio:
El archivo Excel contiene exactamente dos columnas dinámicas (ubicadas en la posición 7 y 8).
Si el convenio no tiene configuración, se utilizan los valores por defecto: Período y Cuota.
Ejemplos de mapeo dinámico:
Fondo de Recupero: Factura / Hospital


Multas Camineras: Nro Acta / Juzgado


Banco de la Gente: Préstamo / Cuota


Convenios Municipales: Período / Cuota


Formato del Nombre del Archivo Generado:
Formato: RecaudacionAcumulada_[Organismo(10)][DDMMAAAA][DDMMAAAA].xlsx


Ejemplo: RecaudacionAcumulada_MUNICIPALI_01012026_31012026.xlsx


3. Consulta de Recaudación por Filtros (HU-RC-03)
Criterios de Aceptación:
Filtros Obligatorios y Habilitantes:
Organismo y Convenio son obligatorios.
Para ejecutar la búsqueda se debe completar al menos uno de los siguientes filtros habilitantes: CUIT, Objeto, Número de Boleta, Obligación o Fecha de Pago.
Fecha Desde y Fecha Hasta son opcionales.
Validaciones de Formato y Reglas de Coincidencia:
El CUIT requiere exactamente 11 dígitos numéricos (sin guiones).
Coincidencia exacta requerida para CUIT, Objeto, Boleta, Obligación y Fecha de Pago.
Fecha Hasta sólo permite seleccionar fechas iguales o posteriores a Fecha Desde.
Comportamiento de Grilla y Visualización:
Muestra la cantidad total de resultados encontrados y paginación de a 10 registros por página.
Permite ordenamiento por columnas (no afecta el orden original de las exportaciones).
Permite scroll horizontal manteniendo fijas las primeras 3 columnas (CUIT, Nro Boleta, Boleta Cuota).
Al cambiar de pestaña no se deben conservar ni persistir los filtros ingresados.
Exportaciones (Excel y CSV):
Permite exportar a Excel y CSV la totalidad de los resultados obtenidos (incluso si son múltiples páginas).
Mensajes del Sistema:
Si la consulta no tiene resultados: "Sin resultados para la consulta. Revisa los filtros ingresados y vuelve a intentar".
Si falla el servicio: "Ha ocurrido un error. Por favor espere unos minutos e intente nuevamente".
⚙️ Mapeo de Endpoints (Referencia OpenAPI)



HTTP
POST /api/recaudacion/diaria
GET  /api/convenios/organismos
GET  /api/convenios?organismoId={organismoId}
GET  /api/tributario/{entidadOrigen}/{procedimientoOrigen}
POST /api/archivos/reportes
GET  /api/archivos/reportes/{requestId}
GET  /api/archivos/documentos/{nombreConfig}/{nombreArchivo}
