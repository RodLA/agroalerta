# AgroAlerta Web

AgroAlerta Web es una plataforma interactiva diseñada para el monitoreo y visualización de alertas agrícolas en el territorio peruano. La aplicación permite a los usuarios visualizar eventos críticos, filtrar información por regiones y provincias, y acceder a reportes detallados sobre riesgos agrícolas.

## 📂 Estructura del Proyecto

El proyecto sigue la arquitectura de **Next.js App Router**:

```text
utp-component-agroalerta-web/
├── public/                 # Archivos estáticos
├── src/
│   ├── actions/            # Server Actions para llamadas a la API
│   ├── app/                # Rutas y layouts principales
│   ├── components/         # Componentes React (UI, Mapa, etc.)
│   ├── hooks/              # Hooks personalizados (Geolocalización, etc.)
│   ├── lib/                # Utilidades y configuración de librerías
│   ├── schemas/            # Esquemas de validación (Zod)
│   ├── store/              # Gestión de estado (Zustand)
│   └── types/              # Definiciones de tipos TypeScript
├── .env.example            # Ejemplo de variables de entorno
├── components.json         # Configuración de shadcn/ui
├── next.config.ts          # Configuración de Next.js
├── package.json            # Dependencias y scripts
└── tsconfig.json           # Configuración de TypeScript
```

## 📦 Dependencias del Proyecto

Las principales tecnologías utilizadas en este proyecto son:

- **Framework**: [Next.js 15+](https://nextjs.org/)
- **Interfaz**: [React 19](https://react.dev/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Componentes UI**: [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/), [Sonner](https://sonner.steventey.com/)
- **Mapas**: [Leaflet](https://leafletjs.com/) & [React Leaflet](https://react-leaflet.js.org/)
- **Gestión de Estado**: [Zustand](https://docs.pmnd.rs/zustand/)
- **Validación**: [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)

## 🔑 Variables de Entorno

Para que la aplicación funcione correctamente, es necesario configurar las siguientes variables de entorno:

| Variable | Descripción | Valor Ejemplo |
|----------|-------------|---------------|
| `NEXT_PUBLIC_API_URL` | URL base del servicio API (Spring Cloud Function) | `http://localhost:8080` |
| `NEXT_PUBLIC_NOMINATIM_URL` | URL para el servicio de geocodificación inversa | `https://nominatim.openstreetmap.org` |

El archivo `.env.example` contiene estas claves. Se recomienda crear un archivo `.env.local` para el desarrollo local.

## 🚀 Ejecución Local

### 📋 Prerrequisitos
- Tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior).
- El servicio backend (**NEXT_PUBLIC_API_URL**) debe estar en ejecución para que la aplicación pueda consumir los datos.

### 🛠️ Pasos
1. Clonar el repositorio.
2. Instalar las dependencias:
   ```bash
   npm install
   # o
   pnpm install
   # o
   yarn install
   # o
   bun install
   ```
3. Configurar las variables de entorno en un archivo `.env.local`.
4. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   # o pnpm dev / yarn dev / bun dev
   ```
5. Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## ☁️ Guía de Despliegue (Vercel)

El despliegue en Vercel es sencillo siguiendo estos pasos:

1. **Importar el Proyecto**:
   - Ve a [Vercel](https://vercel.com/) y selecciona "New Project".
   - Conecta tu repositorio de GitHub o importa el proyecto localmente usando la CLI de Vercel.

2. **Configurar Variables de Entorno**:
   - Durante el proceso de configuración en Vercel, ve a la sección "Environment Variables".
   - Agrega la variable `NEXT_PUBLIC_API_URL` con la URL de tu API en producción.
   - Agrega `NEXT_PUBLIC_NOMINATIM_URL` (opcional, si es diferente al valor por defecto).

> [!IMPORTANT]
> Es **indispensable** configurar correctamente `NEXT_PUBLIC_API_URL`. Sin esta variable, la aplicación no tendrá acceso a la data y presentará errores de carga.

3. **Desplegar**:
   - Haz clic en "Deploy". Vercel detectará automáticamente que es un proyecto de Next.js y realizará el build.

## 📑 Resumen del Orden de Operaciones

1. Asegurar que el **Backend (API)** esté disponible.
2. Configurar las **Variables de Entorno**.
3. Instalar dependencias con `npm install` (o tu gestor preferido).
4. Ejecutar el build o el entorno de desarrollo.
5. Verificar la conexión con el mapa y la carga de departamentos.
