import os
import json
import boto3
import requests
import pymongo
import urllib.parse
import unicodedata 
from datetime import datetime
from botocore.exceptions import ClientError

# ==============================================================================
# 1. CONSTANTES Y CONFIGURACIÓN GLOBAL
# ==============================================================================

STATE_PROCESSED = 'PROCESSED'
STATE_FAILED    = 'FAILED'
STATE_NOT_FOUND = 'NOTFOUND'

RESP_SUCCESS    = 'success'
RESP_NOT_FOUND  = 'not_found'

BUCKET_NAME    = os.environ.get('BUCKET_NAME', "stgs3agrorecursosue1")
S3_BASE_FOLDER = os.environ.get('S3_BASE_FOLDER', 'resource/pdf/senamhi')

SECRET_NAME         = os.environ.get('MONGO_SECRET_NAME')
DB_NAME             = os.environ.get('MONGO_DB_NAME', 'agroalerta')
TABLE_METADATA      = os.environ.get('TABLE_METADATA', 'metadata')

S3_CLIENT = boto3.client('s3')

mongo_client = None
metadata_collection = None

# ==============================================================================
# 2. INICIALIZACIÓN DE MONGODB
# ==============================================================================

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
# 3. FUNCIONES AUXILIARES
# ==============================================================================

def update_db(url, status, collection, s3_key=None):
    now = datetime.utcnow()
    
    update_fields = {
        'status': status,
        'updated_at': now
    }
    
    if s3_key:
        update_fields['key_s3'] = s3_key

    try:
        collection.update_one(
            {'url': url},
            {'$set': update_fields}
        )
    except Exception as e:
        print(f"Error crítico actualizando DB para {url}: {e}")

# ==============================================================================
# 4. HANDLER PRINCIPAL
# ==============================================================================

def lambda_handler(event, context):
    url = event.get('url')
    category = event.get('category', 'General')
    
    if not url:
        return {"status": "error", "message": "URL missing"}

    filename = url.split('/')[-1]
    collection = get_metadata_collection()

    try:
        response = requests.get(url, timeout=20)
        
        if response.status_code == 404:
            update_db(url, STATE_NOT_FOUND, collection)
            return {"status": RESP_NOT_FOUND, "url": url}
            
        response.raise_for_status() 
        
        base_folder = S3_BASE_FOLDER.strip('/')
        
        category_clean = category.replace(' ', '_').lower()
        category_clean = unicodedata.normalize('NFKD', category_clean).encode('ASCII', 'ignore').decode('utf-8')
        
        s3_key = f"{base_folder}/{category_clean}/{filename}"
        
        S3_CLIENT.put_object(
            Bucket=BUCKET_NAME,
            Key=s3_key,
            Body=response.content,
            ContentType='application/pdf'
        )
        
        update_db(url, STATE_PROCESSED, collection, s3_key=s3_key)
        
        return {
            "status": RESP_SUCCESS, 
            "url": url,
            "bucket": BUCKET_NAME,
            "s3_key": s3_key,
            "s3_uri": f"s3://{BUCKET_NAME}/{s3_key}" 
        }

    except requests.exceptions.HTTPError as e:
        update_db(url, STATE_FAILED, collection)
        raise e 

    except Exception as e:
        update_db(url, STATE_FAILED, collection)
        raise e
