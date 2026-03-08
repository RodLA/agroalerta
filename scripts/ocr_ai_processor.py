import os
import io
import re
import json
import logging
import boto3
import uuid
import urllib.parse
import unicodedata 
from datetime import datetime
from pymongo import MongoClient 

# --- LIBRERÍAS GEOESPACIALES ---
import fitz  # PyMuPDF
from PIL import Image, ImageEnhance
import numpy as np
import cv2
import geopandas as gpd
from rasterio.control import GroundControlPoint
from rasterio.transform import from_gcps
from rasterstats import zonal_stats
from typing import Dict, List, Tuple, Any, Optional

# --- LIBRERÍAS NUEVAS PARA OCR E IA ---
import pytesseract
import google.generativeai as genai

# Forzar la ruta del ejecutable de Tesseract en Amazon Linux
pytesseract.pytesseract.tesseract_cmd = '/usr/bin/tesseract'

# ==============================================================================
# 1. CONFIGURACIÓN Y CONSTANTES
# ==============================================================================
logger = logging.getLogger()
logger.setLevel(logging.INFO)

logging.getLogger('botocore.credentials').setLevel(logging.WARNING)
logging.getLogger('urllib3.connectionpool').setLevel(logging.WARNING)

# --- Variables IA ---
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
MODEL_ID = os.environ.get('MODEL_ID', 'gemini-2.0-flash') 

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    logger.warning("⚠️ No se encontró GEMINI_API_KEY. Se omitirá el análisis IA.")

# --- Variables AWS & Geoespaciales ---
STATE_PROCESSED_GEO = 'PROCESADO_GEOSPACIAL'
STATE_ERROR_GEO     = 'ERROR_GEOSPACIAL'
DEFAULT_URL_NOT_FOUND = "URL_NO_ENCONTRADA"

PROMPT_BUCKET       = os.environ.get('PROMPT_BUCKET')
SHAPEFILE_KEY       = os.environ.get('KEY_ZIP') 

# --- CONFIGURACIÓN MONGODB ---
SECRET_NAME_MONGO   = os.environ.get('SECRET_NAME_MONGO') 
MONGO_DB_NAME       = os.environ.get('MONGO_DB_NAME', 'agroalerta')
TABLE_METADATA_NAME = os.environ.get('TABLE_METADATA', 'metadata') 

MONGO_COLLECTION_NAME = os.environ.get('MONGO_COLLECTION_NAME', 'boletines_resultados')
MONGO_COLLECTION_RECOMMENDATIONS = os.environ.get('MONGO_COLLECTION_RECOMMENDATIONS', 'boletines_recommendations')

MONGO_COLLECTION_CROPS = os.environ.get('MONGO_COLLECTION_CROPS', 'crops')
MONGO_COLLECTION_EVENTS = os.environ.get('MONGO_COLLECTION_EVENTS', 'events')
MONGO_COLLECTION_LOCATIONS = os.environ.get('MONGO_COLLECTION_LOCATIONS', 'locations')
MONGO_COLLECTION_SOURCES = os.environ.get('MONGO_COLLECTION_SOURCES', 'official_sources')
MONGO_COLLECTION_DOMAINS = os.environ.get('MONGO_COLLECTION_DOMAINS', 'domains')

CONFIG_GEO = {
    "crs_objetivo": "epsg:4326",
    "ancho_minimo_img": 400,
    "alto_minimo_img": 400,
    "tmp_pdf": "/tmp/boletin_temporal.pdf",
    "tmp_shape": "/tmp/shapefile_temporal.zip",
    "ancho_forzado": 1257,    
    "alto_forzado": 1777      
}

MESES_DICT = {
    "enero": 1, "febrero": 2, "marzo": 3, "abril": 4, "mayo": 5, "junio": 6, 
    "julio": 7, "agosto": 8, "septiembre": 9, "octubre": 10, "noviembre": 11, "diciembre": 12
}

DICCIONARIO_RIESGO = {1: "Muy Bajo", 2: "Bajo", 3: "Medio", 4: "Alto", 5: "Muy Alto"}

PUNTOS_CONTROL_FIJOS = [
    GroundControlPoint(row=158, col=251, x=-80.0, y=0.0),    
    GroundControlPoint(row=158, col=1051, x=-70.0, y=0.0),    
    GroundControlPoint(row=1358, col=251, x=-80.0, y=-15.0),
    GroundControlPoint(row=1358, col=1051, x=-70.0, y=-15.0) 
]

S3_CLIENT = boto3.client('s3')
SECRETS_CLIENT = boto3.client('secretsmanager')

# ==============================================================================
# 1.5 INICIALIZACIÓN: AWS SECRETS Y MONGODB
# ==============================================================================

def get_secret(secret_name: str) -> dict:
    try:
        response = SECRETS_CLIENT.get_secret_value(SecretId=secret_name)
        return json.loads(response['SecretString'])
    except Exception as e:
        logger.error(f"❌ Error recuperando secreto: {e}")
        raise e

secrets = get_secret(SECRET_NAME_MONGO)
db_user = secrets.get('user')
db_pass = secrets.get('password')
db_cluster = secrets.get('cluster')

safe_user = urllib.parse.quote_plus(db_user)
safe_pass = urllib.parse.quote_plus(db_pass)
MONGO_URI = f"mongodb+srv://{safe_user}:{safe_pass}@{db_cluster}/?retryWrites=true&w=majority"

MONGO_CLIENT = MongoClient(MONGO_URI)
db_global = MONGO_CLIENT[MONGO_DB_NAME]

def normalize_text(text: str) -> str:
    if not text: return ""
    text_str = str(text).strip().lower()
    return unicodedata.normalize('NFKD', text_str).encode('ASCII', 'ignore').decode('utf-8')

logger.info("🔄 [INIT] Iniciando carga de catálogos maestros desde MongoDB en caché...")
try:
    col_domains = db_global[MONGO_COLLECTION_DOMAINS]
    DOMAINS_CACHE = {doc["_id"]: doc["name"] for doc in col_domains.find({"is_active": True})}

    col_crops = db_global[MONGO_COLLECTION_CROPS] 
    KNOWN_CROPS_CACHE = {doc["_id"]: doc["name"] for doc in col_crops.find({"is_active": True})}
    
    col_events = db_global[MONGO_COLLECTION_EVENTS] 
    events_docs = list(col_events.find({"is_active": True}))
    if events_docs:
        EVENTS_PROMPT_IDS = ", ".join([doc["_id"] for doc in events_docs])
        EVENTS_PROMPT_NAMES = ", ".join([doc["name"] for doc in events_docs])
    else:
        EVENTS_PROMPT_IDS = "precipitacion, deficit_hidrico"
        EVENTS_PROMPT_NAMES = "Precipitación, Déficit Hídrico"

    col_locs = db_global[MONGO_COLLECTION_LOCATIONS]
    all_locs = list(col_locs.find({"is_active": True}))
    
    LOCATIONS_DEPS_CACHE = {normalize_text(d["name"]): d.get("ubigeo") for d in all_locs if d.get("type") == "DEPARTAMENTO"}
    
    LOCATIONS_PROVS_CACHE = {
        normalize_text(d["name"]): {
            "id": d.get("ubigeo", 0), 
            "domains": d.get("domains", [])
        } 
        for d in all_locs if d.get("type") == "PROVINCIA"
    }

    col_sources = db_global[MONGO_COLLECTION_SOURCES]
    OFFICIAL_SOURCES_CACHE = list(col_sources.find({"is_active": True}))

    logger.info(f"   ✅ [INIT] Catálogos maestros cargados exitosamente.")
except Exception as e:
    logger.error(f"❌ [INIT] Fallo al cargar catálogos desde Mongo: {e}")
    KNOWN_CROPS_CACHE = {}
    EVENTS_PROMPT_IDS = "otros"
    EVENTS_PROMPT_NAMES = "Otros"
    LOCATIONS_DEPS_CACHE = {}
    LOCATIONS_PROVS_CACHE = {}
    OFFICIAL_SOURCES_CACHE = []
    DOMAINS_CACHE = {}

# ==============================================================================
# 2. FUNCIONES DE MONGODB
# ==============================================================================

def get_pdf_metadata(url: str) -> dict:
    if not url or url == DEFAULT_URL_NOT_FOUND: return {}
    try:
        col = db_global[TABLE_METADATA_NAME]
        doc = col.find_one({"url": url})
        return doc if doc else {}
    except Exception as e:
        logger.error(f"Error consultando metadata en Mongo: {e}")
        return {}

def update_pdf_status(url: str, status: str):
    if not url or url == DEFAULT_URL_NOT_FOUND: return
    try:
        col = db_global[TABLE_METADATA_NAME]
        col.update_one(
            {"url": url},
            {"$set": {"status": status, "updated_at": datetime.utcnow()}}
        )
    except Exception as e:
        logger.error(f"Error actualizando estado a {status}: {e}")

def save_risk_records_batch_mongodb(file_key: str, metadata: dict, grouped_results: list):
    collection = db_global[MONGO_COLLECTION_NAME]
    collection.delete_many({"pdf_key": file_key})
    logger.info(f"   🧹 [DB] Registros previos eliminados en {MONGO_COLLECTION_NAME} para {file_key}")

    document_name = os.path.splitext(os.path.basename(file_key))[0]
    category_title = metadata.get('category', 'Título no disponible')
    original_url = metadata.get('url', DEFAULT_URL_NOT_FOUND)
    discovered_at = metadata.get('discovered_at', 'No disponible')
    
    site_id = "UNKNOWN"
    site_name = "Fuente Desconocida"
    try:
        pdf_domain = urllib.parse.urlparse(original_url).netloc.lower()
        for src in OFFICIAL_SOURCES_CACHE:
            src_domain = urllib.parse.urlparse(src.get('url', '')).netloc.lower()
            if src_domain and src_domain in pdf_domain:
                site_id = src.get('_id')
                site_name = src.get('name')
                break
    except Exception:
        pass

    timestamp = datetime.utcnow().isoformat()
    records_to_insert = []
    
    for item in grouped_results:
        records_to_insert.append({
            "_id": str(uuid.uuid4()), 
            "pdf_key": file_key,
            "title": item.get("title", f"Riesgo Agroclimático - {item['date']}"),
            "description": item.get("description", "Descripción no disponible."),
            "source": {
                "document": document_name,
                "title": category_title,
                "url": original_url,
                "discovered_at": discovered_at,
                "site": site_id,
                "site_name": site_name
            },
            "processed_at": timestamp,
            "risk_date": item["date"],
            "crops": item["crops"], 
            "risk": str(item["risk"]).upper(), 
            "event": item.get("event", {"id": "otros", "name": "Otros"}), 
            "domain_ids": item["domain_ids"],
            "department_ids": item["department_ids"],
            "province_ids": item["province_ids"],
            "departments": item["departments"],
            "summary": item.get("summary", "Resumen no generado.")
        })
    
    if records_to_insert:
        collection.insert_many(records_to_insert)
        logger.info(f"   ✅ [DB] Insertados {len(records_to_insert)} grupos geoespaciales en MongoDB.")

def save_recommendations_mongodb(file_key: str, recommendations: list):
    collection = db_global[MONGO_COLLECTION_RECOMMENDATIONS]
    collection.delete_many({"pdf_key": file_key})

    timestamp = datetime.utcnow().isoformat()
    docs = []
    for rec in recommendations:
        docs.append({
            "_id": str(uuid.uuid4()),
            "pdf_key": file_key, 
            "domain": rec.get("domain", "Desconocido"),
            "technical_text": rec.get("technical_text", ""),
            "colloquial_recommendation": rec.get("colloquial_recommendation", ""),
            "processed_at": timestamp
        })
    
    if docs:
        collection.insert_many(docs)

# ==============================================================================
# 3. FUNCIONES DE IA CON GEMINI
# ==============================================================================

def procesar_con_gemini(texto_pdf: str, grupos_geospatiales: list) -> dict:
    if not GEMINI_API_KEY: return {}

    grupos_simplificados = []
    for g in grupos_geospatiales:
        deps_info = []
        for d in g["departments"]:
            provs_info = []
            for p in d["provinces"]:
                dom_names = [dom["name"] for dom in p.get("domains", [])]
                provs_info.append({"name": p["name"], "domains": dom_names})
            deps_info.append({"name": d["name"], "provinces": provs_info})
            
        grupos_simplificados.append({
            "id": g["id"], 
            "date": g["date"], 
            "risk": g["risk"], 
            "crops": [c["name"] for c in g["crops"]], 
            "departments": deps_info
        })

    prompt = f"""
    Eres un ingeniero agrónomo experto. Traduce este boletín técnico a información clara y útil para nuestra base de datos.
    
    INFORMACIÓN GEOGRÁFICA CLAVE: Se han incluido los "domains" (Dominios de Senamhi, ej. Sierra Central, Costa Norte) a los que pertenece cada provincia. Utiliza activamente esta información para identificar a qué región climática específica se refiere el boletín y hacer un análisis mucho más preciso.

    TEXTO DEL BOLETÍN:
    {texto_pdf}
    
    GRUPOS DE RIESGO GEOSPACIAL:
    {json.dumps(grupos_simplificados, ensure_ascii=False)}
    
    Debes devolver un JSON estrictamente válido con la siguiente estructura:
    {{
        "event": {{
            "id": "<Identifica el evento meteorológico o biológico principal. Obligatorio usar un ID de estos: {EVENTS_PROMPT_IDS}. Si no aplica, usa 'otros'>",
            "name": "<Nombre legible del evento. Ej: {EVENTS_PROMPT_NAMES}, Otros>"
        }},
        "enriched_data": [
            {{
                "id": <id_del_grupo_recibido>,
                "title": "<Crea un título corto. Estructura: [Nivel de Riesgo] + [Evento] en [Región/Dominio principal] para el mes de [Mes]>",
                "description": "<Un resumen analítico y detallado del contexto del boletín respecto a los departamentos, provincias y dominios listados.>",
                "summary": "<Un párrafo neutral (máx 3 oraciones) dirigiéndose al agricultor.>"
            }}
        ],
        "recommendations": [
            {{
                "domain": "<Nombre de la zona o dominio (ej. SELVA NORTE)>",
                "technical_text": "<El texto técnico original>",
                "colloquial_recommendation": "<Recomendación como un consejo claro y directo al agricultor.>"
            }}
        ]
    }}
    """
    try:
        model = genai.GenerativeModel(MODEL_ID)
        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(response_mime_type="application/json", temperature=0.4)
        )
        return json.loads(response.text)
    except Exception as e:
        logger.error(f"❌ Error en la generación de Gemini: {e}")
        return {}

# ==============================================================================
# 4. FUNCIONES GEOESPACIALES Y OCR
# ==============================================================================

def detectar_fecha_por_ocr(image_pil: Image) -> Tuple[Optional[int], Optional[int]]:
    img_gray = image_pil.convert('L')
    enhancer = ImageEnhance.Contrast(img_gray)
    img_gray = enhancer.enhance(3.0)
    img_bw = img_gray.point(lambda p: 255 if p > 120 else 0)
    
    custom_config = r'--oem 3 --psm 11'
    texto_extraido = pytesseract.image_to_string(img_bw, lang='spa', config=custom_config).lower()
    
    mes_encontrado, anio_encontrado = None, None
    for mes_nombre, num in MESES_DICT.items():
        patrones = [rf"\b{mes_nombre}\b"]
        if len(mes_nombre) > 3: patrones.append(rf"\b{mes_nombre[1:]}\b") 
        if len(mes_nombre) > 4: patrones.append(rf"\b{mes_nombre[2:]}\b") 
        if re.search("|".join(patrones), texto_extraido):
            mes_encontrado = num
            break
    
    match_anio = re.search(r"202\d", texto_extraido)
    if match_anio: anio_encontrado = int(match_anio.group())
    return mes_encontrado, anio_encontrado

def extraer_metadatos_base(doc: fitz.Document) -> Tuple[int, int, List[str]]:
    texto = doc[0].get_text() + (doc[1].get_text() if len(doc) > 1 else "")
    patron_fecha = r"(?i)(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\s+(\d{4})"
    coincidencia_fecha = re.search(patron_fecha, texto)
    
    if coincidencia_fecha:
        mes_base_num = MESES_DICT[coincidencia_fecha.group(1).lower()]
        anio_base = int(coincidencia_fecha.group(2))
    else:
        anio_base, mes_base_num = 2025, 12 

    patron_cultivos = r"(?i)CULTIVO:\s*(.+)"
    coincidencia_cultivo = re.search(patron_cultivos, texto)
    cultivos_lista = ["Desconocido"]
    if coincidencia_cultivo:
        cultivos_crudos = coincidencia_cultivo.group(1).strip()
        separadores = r" y | o |,"
        cultivos_limpios = [c.strip().capitalize() for c in re.split(separadores, cultivos_crudos) if c.strip()]
        if cultivos_limpios: cultivos_lista = cultivos_limpios
    return anio_base, mes_base_num, cultivos_lista

def extraer_mapas_a_memoria(doc: fitz.Document, anio_base: int, mes_base_num: int, cultivos: List[str]) -> List[Dict[str, Any]]:
    mapas_en_memoria = []
    contador_secuencial = 0 
    
    for page_index in range(len(doc)):
        page = doc[page_index]
        image_list = page.get_images(full=True)
        
        for img in image_list:
            xref = img[0]
            base_image = doc.extract_image(xref)
            image = Image.open(io.BytesIO(base_image["image"]))
            original_width, original_height = image.size
            
            if original_width > CONFIG_GEO["ancho_minimo_img"] and original_height > CONFIG_GEO["alto_minimo_img"]:
                mes_ocr, anio_ocr = detectar_fecha_por_ocr(image)
                
                if mes_ocr:
                    mes_final = mes_ocr
                    anio_final = anio_ocr if anio_ocr else anio_base
                else:
                    mes_final = (mes_base_num - 1 + contador_secuencial) % 12 + 1
                    anio_final = anio_base + ((mes_base_num - 1 + contador_secuencial) // 12)
                
                fecha_form = f"{anio_final}-{mes_final:02d}"
                image_final = image.resize((CONFIG_GEO["ancho_forzado"], CONFIG_GEO["alto_forzado"]), Image.LANCZOS)
                img_cv2 = cv2.cvtColor(np.array(image_final), cv2.COLOR_RGB2BGR)
                
                mapas_en_memoria.append({"img_matriz": img_cv2, "fecha": fecha_form, "cultivos": cultivos})
                contador_secuencial += 1
                
    return mapas_en_memoria

def georreferenciar_matriz(img_cv2: np.ndarray) -> np.ndarray:
    img_hsv = cv2.cvtColor(img_cv2, cv2.COLOR_BGR2HSV)
    raster_riesgo = np.zeros(img_hsv.shape[:2], dtype=np.uint8)

    mask_muy_bajo = cv2.inRange(img_hsv, np.array([46, 50, 50]), np.array([85, 255, 255]))
    raster_riesgo[mask_muy_bajo > 0] = 1
    mask_bajo = cv2.inRange(img_hsv, np.array([33, 50, 50]), np.array([45, 255, 255]))
    raster_riesgo[mask_bajo > 0] = 2
    mask_medio = cv2.inRange(img_hsv, np.array([22, 100, 100]), np.array([32, 255, 255]))
    raster_riesgo[mask_medio > 0] = 3
    mask_alto = cv2.inRange(img_hsv, np.array([11, 100, 100]), np.array([21, 255, 255]))
    raster_riesgo[mask_alto > 0] = 4
    mask_rojo1 = cv2.inRange(img_hsv, np.array([0, 100, 100]), np.array([10, 255, 255]))
    mask_rojo2 = cv2.inRange(img_hsv, np.array([160, 100, 100]), np.array([179, 255, 255]))
    raster_riesgo[(mask_rojo1 > 0) | (mask_rojo2 > 0)] = 5
    return raster_riesgo

def procesar_zonal_stats(gdf: gpd.GeoDataFrame, raster_riesgo: np.ndarray, fecha: str, cultivos: List[str], col_dep: str, col_prov: str) -> List[Dict[str, Any]]:
    transformacion = from_gcps(PUNTOS_CONTROL_FIJOS)
    estadisticas = zonal_stats(gdf, raster_riesgo, affine=transformacion, stats="majority", nodata=0)

    resultados_planos = []
    for i, prov in gdf.iterrows():
        valor_num = estadisticas[i]['majority'] 
        if valor_num is not None and valor_num > 0:
            nivel_texto = DICCIONARIO_RIESGO.get(int(valor_num), "Desconocido")
            
            dep_name_shp = str(prov.get(col_dep, "Desconocido")).strip().title()
            prov_name_shp = str(prov.get(col_prov, f"Provincia_{i}")).strip().title()
            
            id_d_secuencial = LOCATIONS_DEPS_CACHE.get(normalize_text(dep_name_shp), 0)
            
            prov_data = LOCATIONS_PROVS_CACHE.get(normalize_text(prov_name_shp), {"id": 0, "domains": []})
            id_p_secuencial = prov_data["id"]
            p_domains = prov_data["domains"]

            resultados_planos.append({
                "fecha": fecha, 
                "cultivos": cultivos, 
                "departamento": dep_name_shp,
                "departamento_id": id_d_secuencial,
                "provincia": prov_name_shp,
                "provincia_id": id_p_secuencial,
                "provincia_domains": p_domains,
                "riesgo": nivel_texto
            })
    return resultados_planos

def agrupar_info(resultados_planos: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    agrupado = {}

    for fila in resultados_planos:
        llave = (fila["fecha"], tuple(sorted(fila["cultivos"])), fila["riesgo"].lower())
        if llave not in agrupado:
            agrupado[llave] = {
                "date": fila["fecha"], 
                "crops": fila["cultivos"], 
                "risk": fila["riesgo"],
                "deps_map": {} 
            }

        dep_id = fila["departamento_id"]
        prov_id = fila["provincia_id"]
        
        if dep_id not in agrupado[llave]["deps_map"]:
            agrupado[llave]["deps_map"][dep_id] = {
                "id": dep_id,
                "name": fila["departamento"],
                "provinces_map": {}
            }
            
        agrupado[llave]["deps_map"][dep_id]["provinces_map"][prov_id] = {
            "id": prov_id,
            "name": fila["provincia"],
            "domains": fila["provincia_domains"] 
        }
    
    resultados_finales = []
    
    for idx, valor in enumerate(agrupado.values()):
        group_domain_ids = set()
        department_ids = []
        province_ids = []
        departments_list = []
        
        for d_id in sorted(valor["deps_map"].keys()):
            if d_id != 0: department_ids.append(d_id)
            dep_data = valor["deps_map"][d_id]
            provs_list = []
            
            for p_id in sorted(dep_data["provinces_map"].keys()):
                if p_id != 0: province_ids.append(p_id)
                prov_info = dep_data["provinces_map"][p_id]
                
                prov_domains_enriched = []
                for dom_id in prov_info["domains"]:
                    group_domain_ids.add(dom_id)
                    prov_domains_enriched.append({
                        "id": dom_id,
                        "name": DOMAINS_CACHE.get(dom_id, "Desconocido")
                    })
                    
                provs_list.append({
                    "id": p_id,
                    "name": prov_info["name"],
                    "domains": prov_domains_enriched
                })
                
            departments_list.append({
                "id": d_id,
                "name": dep_data["name"],
                "provinces": provs_list
            })
            
        formatted_crops = []
        for c in valor["crops"]:
            c_id = normalize_text(c).replace(' ', '_')
            if c_id in KNOWN_CROPS_CACHE:
                formatted_crops.append({"id": c_id, "name": KNOWN_CROPS_CACHE[c_id]})
            else:
                formatted_crops.append({"id": "otros", "name": "Otros"})
        formatted_crops = [dict(t) for t in {tuple(d.items()) for d in formatted_crops}]
        
        resultados_finales.append({
            "id": idx,
            "date": valor["date"],
            "crops": formatted_crops,
            "risk": valor["risk"],
            "domain_ids": list(group_domain_ids),
            "department_ids": department_ids, 
            "province_ids": province_ids,     
            "departments": departments_list  
        })
        
    resultados_finales = sorted(resultados_finales, key=lambda x: (x["date"], x["crops"][0]["id"] if x["crops"] else "", x["risk"]))
    for i, item in enumerate(resultados_finales):
        item["id"] = i
        
    return resultados_finales

# ==============================================================================
# 5. HANDLER PRINCIPAL (LAMBDA)
# ==============================================================================

def handler(event, context):
    logger.info("🚀 [INICIO] Arrancando Lambda de Procesamiento Híbrido...")
    
    pdf_bucket = event.get('bucket')
    file_key = event.get('s3_key')
    file_url = event.get('url', DEFAULT_URL_NOT_FOUND)
    
    if not pdf_bucket or not file_key:
        error_msg = "❌ Evento inválido: Falta 'bucket' o 's3_key' en el payload."
        logger.error(error_msg)
        return {'statusCode': 400, 'body': json.dumps({'message': error_msg})}
    
    try:
        logger.info(f"📥 [ETAPA 1] Descargando {file_key} de S3...")
        S3_CLIENT.download_file(pdf_bucket, file_key, CONFIG_GEO["tmp_pdf"])
        S3_CLIENT.download_file(PROMPT_BUCKET, SHAPEFILE_KEY, CONFIG_GEO["tmp_shape"])

        logger.info("🔍 [ETAPA 2] Consultando metadatos en MongoDB...")
        metadata = get_pdf_metadata(file_url)

        logger.info("🗺️ [ETAPA 3] Cargando Shapefile del INEI en memoria (GeoPandas)...")
        gdf_provincias = gpd.read_file(f"zip://{CONFIG_GEO['tmp_shape']}").to_crs(CONFIG_GEO["crs_objetivo"])
        cols = gdf_provincias.columns.tolist()
        col_dep = 'NOMBDEP' if 'NOMBDEP' in cols else ('NOMBDEDP' if 'NOMBDEDP' in cols else 'DEPARTAMEN')
        col_prov = 'NOMBPROV' if 'NOMBPROV' in cols else 'PROVINCIA'

        logger.info("📄 [ETAPA 4] Abriendo PDF para extraer texto e imágenes...")
        doc = fitz.open(CONFIG_GEO["tmp_pdf"])
        texto_completo_pdf = "\n".join([page.get_text() for page in doc])
        anio_base, mes_base_num, cultivos = extraer_metadatos_base(doc)
        
        logger.info("🖼️ [ETAPA 5] Iniciando escaneo de mapas y detección de fechas (OCR)...")
        mapas_ram = extraer_mapas_a_memoria(doc, anio_base, mes_base_num, cultivos)
        doc.close()

        logger.info(f"🌐 [ETAPA 6] Cruzando polígonos INEI (Zonal Stats)...")
        resultados_globales = []
        for mapa in mapas_ram:
            matriz_riesgo = georreferenciar_matriz(mapa['img_matriz'])
            datos_extraidos = procesar_zonal_stats(gdf_provincias, matriz_riesgo, mapa['fecha'], mapa['cultivos'], col_dep, col_prov)
            resultados_globales.extend(datos_extraidos)

        if resultados_globales:
            logger.info("📊 [ETAPA 7] Agrupando datos, cruzando ID de Cultivos, Dominios y Localizaciones...")
            json_final = agrupar_info(resultados_globales)
            
            logger.info("🧠 [ETAPA 8] Solicitando resúmenes y títulos enriquecidos a Gemini 2.0...")
            ia_results = procesar_con_gemini(texto_completo_pdf, json_final)
            
            main_event = ia_results.get("event", {"id": "otros", "name": "Otros"})
            enrichments_dict = {item["id"]: item for item in ia_results.get("enriched_data", [])}
            
            for item in json_final:
                enrichment = enrichments_dict.get(item["id"], {})
                item["title"] = enrichment.get("title", f"Riesgo Agroclimático - {item['date']}")
                item["description"] = enrichment.get("description", "Descripción no disponible.")
                item["summary"] = enrichment.get("summary", "Resumen no disponible por el momento.")
                item["event"] = main_event
                del item["id"]
                
            logger.info("💾 [ETAPA 9] Guardando resultados finales en MongoDB...")
            save_risk_records_batch_mongodb(file_key, metadata, json_final)
            
            recommendations = ia_results.get("recommendations", [])
            if recommendations:
                save_recommendations_mongodb(file_key, recommendations)

            logger.info("🔄 [ETAPA 10] Actualizando estado final en MongoDB...")
            update_pdf_status(file_url, STATE_PROCESSED_GEO)
            
            logger.info("✅ [FIN] Proceso completado exitosamente.")
            return {
                'statusCode': 200, 
                'body': json.dumps({'message': 'Proceso Híbrido completado', 'registros': len(json_final)})
            }
        else:
            return {'statusCode': 204, 'body': json.dumps({'message': 'Sin datos extraídos.'})}
    except Exception as e:
        logger.error(f"❌ [ERROR CRÍTICO] Fallo general en Handler: {str(e)}")
        if file_url != DEFAULT_URL_NOT_FOUND:
            update_pdf_status(file_url, STATE_ERROR_GEO)
        raise e
    finally:
        for path in [CONFIG_GEO["tmp_pdf"], CONFIG_GEO["tmp_shape"]]:
            if os.path.exists(path):
                try: os.remove(path)
                except OSError: pass
