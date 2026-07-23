FROM python:3.12-slim

# évite les .pyc et force les logs à sortir immédiatement
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /code

# on installe les dépendances d'abord (cache Docker : ne réinstalle
# que si requirements.txt change, pas à chaque modif de code)
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# le reste du code est monté par volume en dev (voir docker-compose),
# mais on le copie aussi pour que l'image soit autonome
COPY . .

EXPOSE 8000

CMD alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
