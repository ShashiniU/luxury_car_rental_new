FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Make port 5001 available
EXPOSE 5001

# Use Gunicorn as the production server
CMD ["gunicorn", "--bind", "0.0.0.0:5001", "app:app"]

