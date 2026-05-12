# AgroAlerta API Lambda

Este proyecto es una API desarrollada con **Spring Cloud Function** diseñada para ser desplegada como una **AWS Lambda**. Proporciona servicios esenciales para el sistema AgroAlerta, permitiendo la gestión de alertas, reportes y datos de ubicación geográfica.

## 🏗️ Estructura del Proyecto

El proyecto sigue los principios de la **Arquitectura Hexagonal**, organizando el código en capas bien definidas para asegurar la mantenibilidad y escalabilidad.

```text
src/main/java/com/utp/agroalerta
├── 🎯 domain                 # Núcleo del negocio (Entidades y Puertos)
│   ├── criteria             # Objetos de búsqueda y filtrado
│   ├── model                # Entidades de dominio pura
│   ├── pagination           # Gestión de paginación y metadatos
│   └── ports                # Interfaces (in: Casos de uso, out: Repositorios)
├── ⚙️ application            # Capa de Aplicación
│   ├── exception            # Excepciones personalizadas de la lógica
│   └── services             # Implementación de los servicios y casos de uso
├── 🔌 infraestructure        # Detalles de implementación
│   ├── adapters             # Implementaciones de puertos (In/Out)
│   ├── config               # Configuración de Spring Beans y CORS
│   ├── persistence          # Acceso a datos (MongoDB Documentos y Repositorios)
│   └── web                  # Capa de entrada (DTOs, Functions, Mappers)
└── 🛠️ shared                # Utilidades comunes (FunctionQuery)
```

---

## 📦 Dependencias del Proyecto

Para este proyecto de **Spring Cloud Function** con destino a **AWS Lambda**, se han utilizado las siguientes dependencias clave:

*   **`spring-cloud-function-web`**: Proporciona el soporte para exponer funciones vía HTTP localmente.
*   **`spring-cloud-function-adapter-aws`**: Adaptador necesario para ejecutar las funciones en el entorno de AWS Lambda.
*   **`spring-boot-starter-data-mongodb`**: Para la persistencia de datos en MongoDB Atlas.
*   **`lombok`**: Para reducir el código repetitivo mediante anotaciones.

### Configuración AWS (Shade & Thin)
Para optimizar el JAR para AWS, se utiliza el plugin **`spring-boot-maven-plugin`** con la dependencia **`spring-boot-thin-layout`**, y el **`maven-shade-plugin`** que añade el clasificador `aws`. Esto genera un artefacto optimizado que excluye dependencias innecesarias del runtime de Lambda, mejorando los tiempos de cold start.

---

## 🔐 Variables de Entorno

La configuración utiliza las siguientes variables definidas en `application.yaml`:

| Variable | Descripción | Valor Ejemplo |
| :--- | :--- | :--- |
| `MONGO_URI` | Cadena de conexión para MongoDB Atlas. | `mongodb+srv://admin:pass@cluster.mongodb.net/agroalerta` |
| `CORS_ORIGIN` | Dominio permitido para CORS. | `http://localhost:3000` |

---

## 💻 Ejecución Local

### Prerrequisitos
*   **JDK 17**.
*   **Maven 3.8+**.
*   **MongoDB** (Local o Atlas).

### Pasos para ejecutar
1.  Configurar las variables de entorno (`MONGO_URI`, `CORS_ORIGIN`).
2.  Ejecutar en la raíz:
    ```bash
    mvn spring-boot:run
    ```
3.  Acceder localmente vía `http://localhost:8080/{beanName}`.

---

## 🚀 Guía de Despliegue en AWS Lambda

El despliegue en AWS requiere que el artefacto esté configurado correctamente como una función ejecutable.

1.  **Generar el JAR**: Ejecuta `mvn package -DskipTests`. En la carpeta `target/`, obtendrás un archivo con el sufijo `-aws.jar`.
2.  **Carga en AWS**: Crea una Lambda en Java 17 y sube este JAR.
3.  **Configuración del Controlador (Handler)**:
    *   Ve a **Configuración** -> **Configuración de la versión ejecutable**.
    *   Haz clic en **Editar** y pon el siguiente controlador:
        `org.springframework.cloud.function.adapter.aws.FunctionInvoker::handleRequest`
4.  **Variables**: Agrega `MONGO_URI` y `CORS_ORIGIN` en el apartado de configuración de la Lambda.

---

## 🌐 Configuración de API Gateway

Para exponer la Lambda y gestionar el tráfico de forma segura, se utiliza **Amazon API Gateway** (de tipo **API REST**) con la siguiente configuración:

1.  **Creación de Recurso**: Se crea un recurso de tipo **Proxy Resource** con la ruta `/{proxy+}`.
2.  **Método ANY**: Dentro del recurso proxy, se configura el método `ANY` con **Integración Lambda**, apuntando a la función creada anteriormente.
3.  **Configuración de CORS**:
    *   Se crea el método **OPTIONS** dentro del recurso `/{proxy+}`.
    *   En la configuración de CORS, se agrega el **Origin** correspondiente a la web desplegada en **Vercel**.
4.  **Headers obligatorios**: Asegurarse de que el gateway permita el paso del header `spring.cloud.function.definition`.
5.  **Despliegue**: Se crea una etapa denominada **Stage** para poder implementar y activar el API.

---

## 🛡️ Seguridad y Control de Tráfico

Se ha implementado un esquema de seguridad y limitación de peticiones mediante **Usage Plans** y **API Keys**:

1.  **Plan de Uso**:
    *   **Tasa (Rate)**: 10 peticiones por segundo.
    *   **Ampliación (Burst)**: 20 peticiones.
2.  **API Key**:
    *   Se genera una **API Key** única.
    *   Se asocia la API Key al **Plan de Uso**.
    *   Se asocia el Plan de Uso a la etapa **Stage** creada anteriormente.

---

## 🔗 Endpoints

Para invocar las funciones a través del API Gateway, es **obligatorio** incluir los siguientes headers en la petición:

### Headers Requeridos
*   **`spring.cloud.function.definition`**: Nombre de la función a ejecutar (ej: `getSummary`).
*   **`x-api-key`**: La llave de API autorizada para el Plan de Uso.

### URL de Invocación
La URL base sigue el formato:
`https://{api-id}.execute-api.{region}.amazonaws.com/Stage/{functionName}`

### Detalle de Funciones

| Función | Método | Header | Parámetros (Body/Query) | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| **`getSummary`** | GET | `getSummary` | Ninguno | Obtiene resumen estadístico global. |
| **`getDepartments`** | GET | `getDepartments` | Ninguno | Lista todos los departamentos. |
| **`getProvinces`** | POST | `getProvinces` | **Body (text/plain)**: `departmentId` | Lista provincias de un departamento. |
| **`findAlertById`** | POST | `findAlertById` | **Body (text/plain)**: `alertId` | Detalle completo de una alerta. |
| **`searchAlerts`** | GET | `searchAlerts` | **Query**: `page`, `size`, `start`, `end`, `department`, `province`, `risk`, `event` | Búsqueda paginada de alertas. |
| **`getReport`** | GET | `getReport` | **Query**: `start`, `end`, `department` | Obtiene datos para reportes. |

> [!TIP]
> Para los parámetros de fecha (`start`, `end`), usa el formato `yyyy-MM-dd`.

---

## 📜 Resumen del Orden de Operaciones

1.  **Codificación**: Desarrollar bajo capas de dominio, aplicación e infraestructura.
2.  **Packaging**: Generar JAR con perfil `-aws`.
3.  **Lambda Setup**: Subir JAR y configurar el Handler `FunctionInvoker`.
4.  **API Gateway**: Configurar recurso proxy `/{proxy+}`, habilitar CORS (Vercel) y asociar Plan de Uso con API Key.
5.  **Consumo**: Enviar peticiones HTTP al endpoint del API Gateway en la etapa `Stage`, incluyendo los headers `spring.cloud.function.definition` y `x-api-key`.
