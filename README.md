# AgroAlerta — Terraform IaC

> Infraestructura como Código para la plataforma de procesamiento agroclimático serverless **AgroAlerta**.  
> Desplegada sobre AWS en us-east-1 con Step Functions, Lambda y EventBridge.

---

## 📐 Arquitectura

```
EventBridge (cron dominical)
        │
        ▼
┌───────────────────────────────────────────────┐
│          Step Functions — Pipeline            │
│                                               │
│  ┌──────────────┐   ┌──────────────────────┐  │
│  │  Lambda 1    │──▶│  Map: por cada PDF   │  │
│  │  Scraper     │   │  ┌────────────────┐  │  │
│  │  (zip)       │   │  │ Lambda 2       │  │  │
│  └──────────────┘   │  │ Downloader(zip)│  │  │
│                     │  └───────┬────────┘  │  │
│                     │          │            │  │
│                     │  ┌───────▼────────┐  │  │
│                     │  │ Lambda 3       │  │  │
│                     │  │ OCR/IA (Image) │  │  │
│                     │  └────────────────┘  │  │
│                     └──────────────────────┘  │
└───────────────────────────────────────────────┘
        │                      │
        ▼                      ▼
    MongoDB Atlas           S3 Bucket
  (metadata / resultados)  (PDFs + scripts)
```

---

## 📁 Estructura del Proyecto

```
agro-alerta/
├── modules/
│   ├── eventbridge/        # Regla cron semanal → Step Functions
│   ├── iam_roles/          # Roles de mínimo privilegio para cada recurso
│   ├── lambda/             # Las 3 funciones Lambda
│   ├── s3/                 # Bucket de recursos + upload de scripts
│   └── step_functions/     # Máquina de estados + template JSON
│       └── templates/
│           └── state_machine.json
├── scripts/
│   ├── webScraping.py      # Lambda 1: Scraper SENAMHI
│   ├── downloader.py       # Lambda 2: Descargador de PDFs a S3
│   └── ocr_ai_processor.py # Lambda 3: OCR + GeoPandas + Gemini AI
├── backend.tf
├── main.tf
├── outputs.tf
├── providers.tf
├── terraform.tfvars        # ← Completar antes de aplicar
└── variables.tf
```

---

## 🏷️ Nomenclatura de Recursos

| Patrón | Ejemplo |
|--------|---------|
| `{env}s3{project}{desc}{region}` | `stgs3agrorecursosue1` |
| `{env}lmb{project}{desc}{region}` | `stglmbagroocrprocessorue1` |
| `{env}sfn{project}{desc}{region}` | `stgsfnagropipelineue1` |
| `{env}iam{project}{desc}{region}` | `stgiamagroscraperue1` |
| `{env}evb{project}{desc}{region}` | `stgevbagroweeklytriggerue1` |

---

## ⚙️ Variables de Entorno por Lambda

### Lambda 1 — Scraper (`webScraping.py`)
| Variable | Descripción |
|----------|-------------|
| `URL_TARGET` | URL del portal SENAMHI |
| `USER_AGENT` | User-Agent HTTP |
| `MONGO_SECRET_NAME` | Nombre del secreto en Secrets Manager |
| `MONGO_DB_NAME` | Base de datos MongoDB |
| `TABLE_METADATA` | Colección de metadatos |
| `CULTIVOS_OBJETIVO` | Lista de cultivos separada por comas |
| `MONTHS_TO_FETCH` | Meses hacia atrás para filtrar boletines |

### Lambda 2 — Downloader (`downloader.py`)
| Variable | Descripción |
|----------|-------------|
| `BUCKET_NAME` | Nombre del bucket S3 destino |
| `S3_BASE_FOLDER` | Prefijo S3 para los PDFs |
| `MONGO_SECRET_NAME` | Secreto MongoDB |
| `MONGO_DB_NAME` | Base de datos MongoDB |
| `TABLE_METADATA` | Colección de metadatos |

### Lambda 3 — OCR/IA Processor (`ocr_ai_processor.py`)
| Variable | Descripción |
|----------|-------------|
| `GEMINI_API_KEY` | API key de Google Gemini |
| `MODEL_ID` | Modelo Gemini a usar |
| `PROMPT_BUCKET` | Bucket que contiene el shapefile |
| `KEY_ZIP` | Clave S3 del shapefile zip |
| `SECRET_NAME_MONGO` | Secreto MongoDB |
| `MONGO_DB_NAME` | Base de datos MongoDB |
| `MONGO_COLLECTION_NAME` | Colección de resultados geoespaciales |
| `MONGO_COLLECTION_RECOMMENDATIONS` | Colección de recomendaciones IA |
| `MONGO_COLLECTION_CROPS` | Catálogo de cultivos |
| `MONGO_COLLECTION_EVENTS` | Catálogo de eventos climáticos |
| `MONGO_COLLECTION_LOCATIONS` | Catálogo de ubicaciones |
| `MONGO_COLLECTION_SOURCES` | Fuentes oficiales |
| `MONGO_COLLECTION_DOMAINS` | Dominios Senamhi |

---

## 🚀 Guía de Despliegue

### 0. Pre-requisitos

- AWS CLI configurado con credenciales suficientes
- Terraform ≥ 1.5.0
- Docker (para construir y publicar la imagen de Lambda 3)
- Una base de datos MongoDB Atlas con los catálogos cargados
- Un secreto en AWS Secrets Manager con claves `user`, `password`, `cluster`

### 1. Bootstrap del Backend

Ejecutar una sola vez antes del primer `terraform init`. El script crea el bucket S3 para el estado remoto y activa el versionamiento:

```bash
chmod +x scripts/bootstrap.sh
./scripts/bootstrap.sh agro-stg   # pasa el nombre de tu perfil AWS
```

Esto creará únicamente el bucket `stgs3agroterraformstateue1`. **No se requiere DynamoDB** — la gestión de concurrencia se centraliza en MongoDB.

### 2. Construir y Publicar la Imagen de Lambda 3 (OCR/IA)

```bash
# Definir variables
REGION=us-east-1
REPO=stgecragroocrprocessorue1
PROFILE=agro-stg

# Obtener el Account ID usando el perfil específico
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text --profile ${PROFILE})

# Verificar antes de continuar
echo "→ Account: ${ACCOUNT_ID}"   # debe ser 704618570781
echo "→ Repo:    ${REPO}"

# Crear repositorio ECR (saltar si ya existe)
aws ecr create-repository --repository-name ${REPO} --region ${REGION} --profile ${PROFILE}

# Login + build + push
aws ecr get-login-password --region ${REGION} --profile ${PROFILE} | \
  docker login --username AWS --password-stdin ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com

docker build --no-cache --provenance=false --platform linux/amd64 -t ${REPO}:latest .
docker tag ${REPO}:latest ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${REPO}:latest
docker push ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${REPO}:latest
```

Copiar la URI resultante en `terraform.tfvars` como `lambda_ocr_image_uri`.

### 3. Completar `terraform.tfvars`

Editar el archivo y reemplazar todos los valores `<CHANGE_ME>`:

```hcl
scraper_mongo_secret_name  = "agro/mongo/credentials"
lambda_ocr_image_uri       = "123456789.dkr.ecr.us-east-1.amazonaws.com/stgecragroocrprocessorue1:latest""
# ...etc
```

### 4. Aplicar

```bash
terraform init
terraform plan -out=tfplan
terraform apply tfplan
```

---

## 🔐 Seguridad (Principio de Mínimo Privilegio)

| Rol | Permisos concedidos |
|-----|---------------------|
| `stgiamagroscraperue1` | CloudWatch Logs · Secrets Manager (leer secreto Mongo) |
| `stgiamagrodowloaderue1` | CloudWatch Logs · `s3:PutObject` en `/resource/pdf/*` · Secrets Manager |
| `stgiamaocrprocessorue1` | CloudWatch Logs · `s3:GetObject/PutObject` · Secrets Manager · ECR pull |
| `stgiamagrostepfunctionsue1` | `lambda:InvokeFunction` sobre las 3 funciones |
| `stgiamagroeventbridgeue1` | `states:StartExecution` sobre la state machine |

---

## 📤 Outputs Principales

| Output | Descripción |
|--------|-------------|
| `resources_bucket_name` | Nombre del bucket S3 |
| `lambda_scraper_arn` | ARN Lambda Scraper |
| `lambda_downloader_arn` | ARN Lambda Downloader |
| `lambda_ocr_processor_arn` | ARN Lambda OCR/IA |
| `state_machine_arn` | ARN Step Functions |
| `eventbridge_rule_arn` | ARN regla EventBridge |

---

## 🗓️ Trigger Automático

La regla EventBridge ejecuta el pipeline **todos los domingos a la 01:00 AM UTC**:

```
cron(0 1 ? * SUN *)
```

Para cambiar la frecuencia, editar `eventbridge_schedule` en `terraform.tfvars`.

---

## 🚀 Guía de Despliegue (Deployment Workflow)

El despliegue de AgroAlerta **no es un simple `terraform apply`**. La arquitectura combina contenedores Docker y gestión segura de secretos que requieren pasos manuales obligatorios. Seguir este orden es crítico.

---

### Paso 1 — ⚠️ PRE-REQUISITO: Crear el ECR y hacer Push de la Imagen

> **¿Por qué es obligatorio?**  
> AWS Lambda **no puede crear una función con `package_type = "Image"` si la imagen no existe físicamente en ECR en el momento del `terraform apply`**. Si ejecutas Terraform antes de este paso, el despliegue fallará con un error de imagen no encontrada.

**1.0 Configurar el perfil de AWS nombrado** (si aún no existe en tu máquina):

```bash
aws configure --profile agro-stg
# AWS Access Key ID:     <tu_access_key>
# AWS Secret Access Key: <tu_secret_key>
# Default region name:   us-east-1
# Default output format: json
```

> 🔑 Usar un perfil nombrado (`--profile agro-stg`) garantiza que todos los comandos apunten a la **cuenta de staging correcta** y no a la cuenta personal por defecto del desarrollador. Un error aquí podría subir la imagen o crear recursos en la cuenta equivocada.

**1.1 Crear el repositorio ECR** con el nombre exacto de la nomenclatura del proyecto:

```bash
# Definir variables
REGION=us-east-1
REPO=stgecragroocrprocessorue1
PROFILE=agro-stg

# Obtener el Account ID usando el perfil específico
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text --profile $PROFILE)

# Crear repositorio ECR usando el perfil específico
aws ecr create-repository --repository-name $REPO --region $REGION --profile $PROFILE
```

**1.2 Autenticarse, compilar y hacer push de la imagen Docker:**

```bash
# Login al registry ECR — el flag --profile asegura autenticación en la cuenta correcta
aws ecr get-login-password --region ${REGION} --profile ${PROFILE} | \
  docker login --username AWS --password-stdin ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com

# Construir la imagen para arquitectura amd64 (requerido por Lambda)
docker build --no-cache --provenance=false --platform linux/amd64 -t ${REPO}:latest .

# Etiquetar y hacer push al registry ECR
docker tag ${REPO}:latest ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${REPO}:latest
docker push ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${REPO}:latest
```

> ⚠️ **Multi-cuenta:** Omitir `--profile agro-stg` haría que Docker se autenticara con las credenciales por defecto del sistema, potencialmente subiendo la imagen a una cuenta de AWS diferente (ej. tu cuenta personal). El `profile` especificado en Terraform (`var.aws_profile = "agro-stg"`) y el perfil usado en la CLI **deben coincidir**.

**1.3 Copiar la URI completa** de la imagen resultante. Se verá así:

```
123456789012.dkr.ecr.us-east-1.amazonaws.com/stgecragroocrprocessorue1:latest
```

> 🔖 **Guarda esta URI** — la necesitarás en el siguiente paso.


---

### Paso 2 — 🏗️ DESPLIEGUE: Terraform Apply

**2.1 Pegar la URI de la imagen** en el archivo `terraform.tfvars`:

```hcl
# terraform.tfvars
lambda_ocr_image_uri = "123456789012.dkr.ecr.us-east-1.amazonaws.com/stgecragroocrprocessorue1:latest"
```

**2.2 Ejecutar la secuencia estándar de Terraform:**

```bash
# Inicializar providers y módulos (incluye el nuevo módulo secrets_manager)
terraform init

# Revisar el plan antes de aplicar — leer con atención los recursos a crear
terraform plan -out=tfplan

# Aplicar la infraestructura
terraform apply tfplan
```

> ✅ Al finalizar, Terraform habrá creado todos los recursos de AWS **incluyendo los secretos con valores dummy**. Las Lambdas 1, 2 y 3 estarán desplegadas pero **no funcionales** hasta completar el Paso 3.

---

### Paso 3 — 🔐 POST-DESPLIEGUE: Inyección Manual de Secretos (DevSecOps)

> **¿Por qué no están las credenciales en Terraform?**  
> Siguiendo las mejores prácticas de **DevSecOps**, Terraform **nunca almacena credenciales reales** en el código fuente ni en el estado remoto. Los secretos se crean con valores dummy y el bloque `lifecycle { ignore_changes = [secret_string] }` garantiza que Terraform **nunca sobrescriba** los valores reales que introduzcas manualmente.

**3.1 Ir a AWS Secrets Manager** en la consola web:

```
https://us-east-1.console.aws.amazon.com/secretsmanager/
```

**3.2 Actualizar el secreto de MongoDB** → buscar `stgsecagromongoue1`:

Hacer clic en **"Retrieve secret value"** → **"Edit"** y reemplazar el JSON dummy con las credenciales reales de tu clúster MongoDB Atlas:

```json
{
  "user":     "tu_usuario_real",
  "password": "tu_password_real",
  "cluster":  "cluster0.xxxxx.mongodb.net",
  "db_name":  "agroalerta"
}
```

**3.3 Actualizar el secreto de Gemini** → buscar `stgsecagrogeminiue1`:

Hacer clic en **"Retrieve secret value"** → **"Edit"** y reemplazar con tu API Key real de Google Gemini:

```json
{
  "api_key": "AIzaSy_TU_CLAVE_REAL_DE_GEMINI"
}
```

> 🔒 **Importante de seguridad:**  
> Estos valores **nunca aparecen en `terraform.tfvars`**, en el plan de Terraform, ni en el repositorio Git. La Lambda 3 (OCR/IA) lee ambos secretos en tiempo de ejecución a través de los nombres de secreto inyectados como variables de entorno (`SECRET_NAME_MONGO`, `SECRET_NAME_GEMINI`).

---

### Resumen del Orden de Operaciones

```
┌─────────────────────────────────────────────────────────────┐
│  PASO 1 (Manual - CLI/Consola)                              │
│  ► Crear repositorio ECR: stgecragroocrprocessorue1         │
│  ► docker build + docker push → copiar URI                  │
├─────────────────────────────────────────────────────────────┤
│  PASO 2 (Terraform)                                         │
│  ► Pegar URI en terraform.tfvars                            │
│  ► terraform init → terraform plan → terraform apply        │
├─────────────────────────────────────────────────────────────┤
│  PASO 3 (Manual - Consola AWS)                              │
│  ► Secrets Manager → stgsecagromongoue1 → credenciales real │
│  ► Secrets Manager → stgsecagrogeminiue1 → API Key real     │
│                                                             │
│  ✅ Pipeline listo para ejecutarse el próximo domingo       │
└─────────────────────────────────────────────────────────────┘
```

