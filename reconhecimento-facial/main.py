import cv2
import os
import threading
import time
import numpy as np
from deepface import DeepFace
from flask import Flask, render_template, Response, request, jsonify
from datetime import datetime
import requests  # ← adicione no topo do seu main.py

# ===============================
# CONFIGURAÇÃO PARA EVITAR ERROS CUDA
# ===============================
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

# ===============================
# CONFIGURAÇÕES GERAIS
# ===============================
PASTA_CADASTRADOS = "pessoas_autorizadas"
MODELO = "ArcFace"

os.makedirs(PASTA_CADASTRADOS, exist_ok=True)

app = Flask(__name__)
camera = None
ultimo_frame = None
frame_lock = threading.Lock()

# ===============================
# CLASSE PRINCIPAL
# ===============================
class WhitelistFacialWeb:
    def __init__(self):
        self.ultimo_resultado = {"nome": "Verificando...", "confianca": 0.0, "status": "verificando"}
        self.carregar_cadastros()
        self.detector_face = self.carregar_detector_otimizado()

    def carregar_detector_otimizado(self):
        try:
            proto_path = "deploy.prototxt"
            model_path = "res10_300x300_ssd_iter_140000_fp16.caffemodel"
            if os.path.exists(proto_path) and os.path.exists(model_path):
                detector = cv2.dnn.readNetFromCaffe(proto_path, model_path)
                print("✅ Detector DNN carregado")
                return {"tipo": "dnn", "detector": detector}
            else:
                print("⚠️ Modelo DNN não encontrado, usando Haar Cascade.")
                cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
                return {"tipo": "haar", "detector": cascade}
        except Exception as e:
            print(f"❌ Erro ao carregar detector: {e}")
            cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
            return {"tipo": "haar", "detector": cascade}

    def detectar_rostos(self, frame):
        try:
            if self.detector_face["tipo"] == "dnn":
                return self.detectar_rostos_dnn(frame)
            else:
                return self.detectar_rostos_haar(frame)
        except Exception as e:
            print(f"❌ Erro na detecção: {e}")
            return []

    def detectar_rostos_dnn(self, frame):
        (h, w) = frame.shape[:2]
        blob = cv2.dnn.blobFromImage(cv2.resize(frame, (300, 300)), 1.0, (300, 300), (104.0, 177.0, 123.0))
        self.detector_face["detector"].setInput(blob)
        detections = self.detector_face["detector"].forward()
        rostos = []
        for i in range(0, detections.shape[2]):
            confidence = detections[0, 0, i, 2]
            if confidence > 0.7:
                box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                (startX, startY, endX, endY) = box.astype("int")
                startX, startY = max(0, startX), max(0, startY)
                endX, endY = min(w, endX), min(h, endY)
                rostos.append((startX, startY, endX - startX, endY - startY))
        return rostos

    def detectar_rostos_haar(self, frame):
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        rostos = self.detector_face["detector"].detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(100, 100))
        return rostos

    def carregar_cadastros(self):
        self.cadastros_por_pessoa = {}
        for pessoa in os.listdir(PASTA_CADASTRADOS):
            caminho_pessoa = os.path.join(PASTA_CADASTRADOS, pessoa)
            if os.path.isdir(caminho_pessoa):
                fotos = [os.path.join(caminho_pessoa, f) for f in os.listdir(caminho_pessoa)
                         if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
                if fotos:
                    self.cadastros_por_pessoa[pessoa] = fotos
        total_fotos = sum(len(fotos) for fotos in self.cadastros_por_pessoa.values())
        print(f"✅ {len(self.cadastros_por_pessoa)} pessoas carregadas ({total_fotos} fotos).")


    def verificar_acesso(self, frame):
        """Verifica se o rosto é autorizado"""
        try:
            if not self.cadastros_por_pessoa:
                self.ultimo_resultado = {"nome": "Nenhum cadastrado", "confianca": 0.0, "status": "negado"}
                return

            result = DeepFace.find(
                img_path=frame,
                db_path=PASTA_CADASTRADOS,
                model_name=MODELO,
                enforce_detection=False,
                silent=True
            )

            if len(result) > 0 and not result[0].empty:
                nome_arquivo = result[0].iloc[0]['identity']
                nome_pasta = os.path.basename(os.path.dirname(nome_arquivo))
                distancia = result[0].iloc[0]['distance']
                confianca = max(0, 100 - distancia * 100)

                if confianca > 70:
                    self.ultimo_resultado = {"nome": nome_pasta, "confianca": confianca, "status": "autorizado"}
                    print(f"🟢 {nome_pasta} autorizado ({confianca:.2f}%)")

                    # ==== NOVO: envia sinal para o servidor Node.js ====
                    try:
                        payload = {"username": "admin", "password": "1234"}
                        response = requests.post(
                            "http://localhost:3000/api/auth/login",
                            json=payload,
                            timeout=5
                        )
                        if response.status_code == 200:
                            print("✅ Login enviado com sucesso:", response.json().get("message"))
                        else:
                            print(f"⚠️ Falha ao enviar login: {response.status_code} - {response.text}")
                    except Exception as e:
                        print(f"❌ Erro ao comunicar com servidor Node.js: {e}")
                    # ====================================================

                else:
                    self.ultimo_resultado = {"nome": nome_pasta, "confianca": confianca, "status": "negado"}
            else:
                self.ultimo_resultado = {"nome": "Desconhecido", "confianca": 0.0, "status": "negado"}

        except Exception as e:
            print(f"❌ Erro no reconhecimento facial: {e}")


# ===============================
# FUNÇÕES DE CÂMERA
# ===============================
def get_camera():
    global camera
    if camera is None or not camera.isOpened():
        camera = cv2.VideoCapture(0, cv2.CAP_DSHOW)
        if camera.isOpened():
            print("✅ Webcam inicializada.")
        else:
            print("❌ Erro: nenhuma câmera disponível.")
    return camera

def camera_loop():
    global ultimo_frame
    while True:
        cam = get_camera()
        success, frame = cam.read()
        if success:
            with frame_lock:
                ultimo_frame = frame.copy()
        time.sleep(0.05)

# ===============================
# LOOP DE RECONHECIMENTO
# ===============================
def reconhecimento_continuo():
    global ultimo_frame
    while True:
        with frame_lock:
            frame = None if ultimo_frame is None else ultimo_frame.copy()

        if frame is not None:
            rostos = sistema.detectar_rostos(frame)
            if len(rostos) > 0:
                x, y, w, h = rostos[0]
                rosto = frame[y:y + h, x:x + w]
                sistema.verificar_acesso(rosto)
            else:
                sistema.ultimo_resultado = {"nome": "Nenhuma pessoa", "confianca": 0.0, "status": "verificando"}
        time.sleep(2)

# ===============================
# ROTAS FLASK
# ===============================
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/status')
def status():
    return jsonify(sistema.ultimo_resultado)

@app.route('/cadastrar', methods=['POST'])
def cadastrar():
    global ultimo_frame
    nome = request.form.get('nome')
    if not nome:
        return jsonify({"erro": "Nome é obrigatório"}), 400
    with frame_lock:
        if ultimo_frame is None:
            return jsonify({"erro": "Sem imagem para capturar"}), 400
        frame = ultimo_frame.copy()
    rostos = sistema.detectar_rostos(frame)
    if len(rostos) == 0:
        return jsonify({"erro": "Nenhum rosto detectado"}), 400
    x, y, w, h = rostos[0]
    rosto = frame[y:y + h, x:x + w]
    pasta_pessoa = os.path.join(PASTA_CADASTRADOS, nome)
    os.makedirs(pasta_pessoa, exist_ok=True)
    caminho = os.path.join(pasta_pessoa, f"cadastro_{int(time.time())}.jpg")
    cv2.imwrite(caminho, rosto)
    sistema.carregar_cadastros()
    return jsonify({"mensagem": f"{nome} cadastrado com sucesso!"})

def generate_frames():
    while True:
        with frame_lock:
            frame = np.zeros((480, 640, 3), dtype=np.uint8) if ultimo_frame is None else ultimo_frame.copy()
        ret, buffer = cv2.imencode('.jpg', frame)
        if ret:
            yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
        time.sleep(0.05)

# ===============================
# INICIALIZAÇÃO
# ===============================
if __name__ == '__main__':
    print("🚀 Iniciando Sistema de Reconhecimento Facial...")
    sistema = WhitelistFacialWeb()
    threading.Thread(target=camera_loop, daemon=True).start()
    threading.Thread(target=reconhecimento_continuo, daemon=True).start()
    app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)
