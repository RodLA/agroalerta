import os
import json
import requests
import boto3
import pymongo
import urllib.parse 
import uuid 
from bs4 import BeautifulSoup
from botocore.exceptions import ClientError
from datetime import datetime
from dateutil.relativedelta import relativedelta

# ==============================================================================
# 1. CONSTANTES Y ESTADOS (Global Scope)
# ==============================================================================

STATE_DISCOVERED = 'DISCOVERED'
STATE_PROCESSED  = 'PROCESSED'
STATE_FAILED     = 'FAILED'

MESES = {
    "enero": 1, "febrero": 2, "marzo": 3, "abril": 4, "mayo": 5, "junio": 6,
    "julio": 7, "agosto": 8, "septiembre": 9, "octubre": 10, "noviembre": 11, "diciembre": 12
}

# Lista de cultivos por defecto si la variable de entorno está vacía
DEFAULT_CULTIVOS = ["papa", "maíz", "maiz", "arróz", "arroz", "café", "cafe", "cacao"]

# ==============================================================================
# 2. CONFIGURACIÓN DE ENTORNO (Environment Variables)
# ==============================================================================

URL_TARGET          = os.environ.get('URL_TARGET', 'https://www.senamhi.gob.pe/?p=riesgo-agro')
USER_AGENT          = os.environ.get('USER_AGENT', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Monitor-Agro-Bot')
SECRET_NAME         = os.environ.get('MONGO_SECRET_NAME')
DB_NAME             = os.environ.get('MONGO_DB_NAME', 'agroalerta')
TABLE_METADATA      = os.environ.get('TABLE_METADATA', 'metadata')

# Lógica para procesar la lista de cultivos desde el entorno
env_cultivos = os.environ.get('CULTIVOS_OBJETIVO', '').strip()

if env_cultivos:
    CULTIVOS_OBJETIVO = [cultivo.strip().lower() for cultivo in env_cultivos.split(',')]
    print(f"Cultivos cargados desde entorno: {CULTIVOS_OBJETIVO}")
else:
    CULTIVOS_OBJETIVO = DEFAULT_CULTIVOS
    print(f"Usando cultivos por defecto: {CULTIVOS_OBJETIVO}")

try:
    MONTHS_LIMIT = int(os.environ.get('MONTHS_TO_FETCH', 3))
except ValueError:
    print("Advertencia: MONTHS_TO_FETCH no es válido. Usando default: 3")
    MONTHS_LIMIT = 3

# ==============================================================================
# 3. INICIALIZACIÓN DE RECURSOS AWS Y MONGODB (Lazy Loading)
# ==============================================================================

mongo_client = None
metadata_collection = None 

def get_metadata_collection():
    global mongo_client, metadata_collection
    
    if metadata_collection is not None:
        return metadata_collection

    if not SECRET_NAME:
        raise ValueError("Error Crítico: La variable de entorno MONGO_SECRET_NAME no está configurada.")

    try:
        secrets_client = boto3.client('secretsmanager')
        response = secrets_client.get_secret_value(SecretId=SECRET_NAME)
        secret_dict = json.loads(response['SecretString'])
        
        db_user = secret_dict.get('user')
        db_password = secret_dict.get('password')
        db_cluster = secret_dict.get('cluster')

        if not all([db_user, db_password, db_cluster]):
            raise ValueError("El secreto no contiene todas las llaves necesarias ('user', 'password', 'cluster').")

        safe_user = urllib.parse.quote_plus(db_user)
        safe_password = urllib.parse.quote_plus(db_password)

        mongo_uri = f"mongodb+srv://{safe_user}:{safe_password}@{db_cluster}/?retryWrites=true&w=majority"

        mongo_client = pymongo.MongoClient(mongo_uri)
        metadata_collection = mongo_client[DB_NAME][TABLE_METADATA]
        print("Conexión a MongoDB establecida exitosamente.")
        
        return metadata_collection

    except ClientError as e:
        print(f"Error accediendo a Secrets Manager: {e.response['Error']['Message']}")
        raise e
    except Exception as e:
        print(f"Error inicializando MongoDB: {str(e)}")
        raise e

# ==============================================================================
# 4. FUNCIONES DE LÓGICA DE NEGOCIO Y BASE DE DATOS
# ==============================================================================

def get_item_status(url, collection_meta):
    try:
        item = collection_meta.find_one({'url': url}, {'status': 1, '_id': 0})
        return item
    except Exception as e:
        print(f"Error consultando MongoDB: {str(e)}")
        return None

def register_new_url(url, metadata, collection_meta):
    now = datetime.utcnow()
    uii = str(uuid.uuid4())
    
    try:
        result = collection_meta.update_one(
            {'url': url},
            {
                '$set': {
                    'main_title': metadata['main_title'], 
                    'category': metadata['category'],     
                    'link_text': metadata['link_text'],   
                    'status': STATE_DISCOVERED,           
                    'updated_at': now
                },
                '$setOnInsert': {
                    '_id': uii,
                    'key_s3': '',
                    'discovered_at': now,
                    'retries': 0
                }
            },
            upsert=True
        )
        print(f"Metadata registrada/actualizada para URL: {url}")
        
        if result.upserted_id:
            metadata['_id'] = result.upserted_id
            
        return True
    except Exception as e:
        print(f"Error al hacer upsert en MongoDB: {str(e)}")
        return False

def is_within_range(link_text, months_limit):
    try:
        parts = link_text.lower().replace('-', ' ').split()
        if len(parts) < 2: 
            return False
            
        mes_str = parts[0].strip()
        anio = int(parts[1])
        
        mes_num = MESES.get(mes_str)
        if not mes_num: 
            return False
        
        fecha_boletin = datetime(anio, mes_num, 1)
        fecha_actual = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        fecha_limite = fecha_actual - relativedelta(months=(months_limit - 1))
        
        return fecha_boletin >= fecha_limite
    except Exception:
        return False

def parse_senamhi_items(html, months_limit):
    soup = BeautifulSoup(html, 'html.parser')
    extracted_items = []
    
    for h4 in soup.find_all('h4'):
        category = h4.get_text(strip=True)
        category_lower = category.lower()
        
        if not any(cultivo in category_lower for cultivo in CULTIVOS_OBJETIVO):
            continue 
        
        h2_tag = h4.find_previous('h2')
        main_title = h2_tag.get_text(strip=True) if h2_tag else "Sin Título Principal"
        
        curr = h4.next_sibling
        while curr:
            if curr.name in ['h4', 'h2']: 
                break
            
            if hasattr(curr, 'find_all'):
                for a in curr.find_all('a', href=True):
                    link_text = a.get_text(strip=True)
                    
                    if is_within_range(link_text, months_limit):
                        href = a['href']
                        
                        if "../../" in href:
                            href = "https://www.senamhi.gob.pe/" + href.replace('../../', '')
                        elif href.startswith('/'):
                            href = "https://www.senamhi.gob.pe" + href
                        elif not href.startswith('http'):
                            href = "https://www.senamhi.gob.pe/" + href

                        extracted_items.append({
                            "main_title": main_title,
                            "category": category,
                            "link_text": link_text,
                            "url": href
                        })
            curr = curr.next_sibling
            
    return extracted_items

# ==============================================================================
# 5. HANDLER PRINCIPAL (Lambda)
# ==============================================================================

def lambda_handler(event, context):
    months_limit = event.get('months_limit', MONTHS_LIMIT)
    
    print(f"Inicio de Scraper. Configurado para los últimos {months_limit} meses.")

    try:
        metadata_collection = get_metadata_collection()

        response = requests.get(URL_TARGET, headers={"User-Agent": USER_AGENT}, timeout=20)
        response.raise_for_status() 
        
        web_items = parse_senamhi_items(response.text, months_limit)
        
        processed_count = 0
        new_items = []
        
        for item in web_items:
            existing_item = get_item_status(item['url'], metadata_collection)
            should_process = False
            
            if not existing_item:
                should_process = True
            elif existing_item.get('status') not in [STATE_PROCESSED, STATE_FAILED]:
                should_process = True
            
            if should_process:
                if register_new_url(item['url'], item, metadata_collection):
                    new_items.append(item)
                    processed_count += 1
        
        return {
            'new_items_found': processed_count,
            'items': new_items,
            'months_limit_applied': months_limit
        }

    except Exception as e:
        print(f"Error Crítico en ejecución: {str(e)}")
        raise e
