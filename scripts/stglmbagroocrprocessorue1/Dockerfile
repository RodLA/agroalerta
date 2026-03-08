# Nos mantenemos en Python 3.9 (Amazon Linux 2)
FROM public.ecr.aws/lambda/python:3.9

# 1. Instalamos EPEL desde el servidor de archivos históricos oficiales
# 2. Instalamos tesseract y poppler
RUN yum update -y && \
    yum install -y https://archives.fedoraproject.org/pub/archive/epel/7/x86_64/Packages/e/epel-release-7-14.noarch.rpm && \
    yum install -y poppler-utils gcc gcc-c++ tesseract tesseract-langpack-spa && \
    yum clean all

# 3. Copiamos las dependencias de Python
COPY requirements.txt ${LAMBDA_TASK_ROOT}

# 4. Actualizamos pip e instalamos las librerías
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# 5. Copiamos tu código fuente
COPY app.py ${LAMBDA_TASK_ROOT}

# 6. Definimos el comando de inicio 
CMD [ "app.handler" ]