from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import cv2
import numpy as np
import base64

app = FastAPI()

# Konfigurasi CORS: Mengizinkan React (Frontend) untuk mengambil data dari Python (Backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Memuat model YOLO. Pastikan nama filenya sama persis!
model = YOLO('YOLO11SEGE100.pt')

@app.post("/predict")
async def predict_image(file: UploadFile = File(...)):
    try:
        # 1. Membaca gambar yang dikirim dari React
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            return {"error": "Gambar tidak dapat dibaca"}

        # 2. Menjalankan proses segmentasi dengan YOLO
        results = model(img)
        
        # 3. Mengambil gambar hasil yang sudah ada masking/kotaknya
        result_img = results[0].plot()

        # 4. Mengubah gambar ke format teks (Base64) agar bisa dikirim lewat internet ke React
        _, buffer = cv2.imencode('.jpg', result_img)
        img_base64 = base64.b64encode(buffer).decode('utf-8')

        return {"result_image": img_base64}
        
    except Exception as e:
        return {"error": str(e)}