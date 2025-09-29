import mysql.connector
import json
import numpy as np
from deepface import DeepFace
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import logging


# Set up logging
logging.basicConfig(level=logging.INFO)


# ------------------ Setup ------------------
app = Flask(__name__)
CORS(app)



# ✅ MySQL connection
conn = mysql.connector.connect(
    host="server.rwebservice.in",
    user="face_attadance",
    password="face_attadance",
    database="face_attadance"
)
cursor = conn.cursor()

# ✅ Cosine similarity
def cosine_similarity(vec1, vec2):
    vec1, vec2 = np.array(vec1), np.array(vec2)
    return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))




@app.route("/enroll", methods=["POST"])
def enroll_student():
    try:
        sid = request.form.get("sid")
        image_path = request.form.get("image_path")
        enforce_detection = request.form.get("enforce_detection", "true").lower() == "true"

        if not sid or not image_path:
            return jsonify({"success": False, "message": "Missing sid or image_path"})

        if not os.path.exists(image_path):
            return jsonify({"success": False, "message": f"Image file not found: {image_path}"})

        logging.info(f"Enrolling student {sid} with image: {image_path}")
        logging.info(f"File size: {os.path.getsize(image_path)} bytes")

        try:
            embedding = DeepFace.represent(img_path=image_path, model_name="ArcFace", enforce_detection=enforce_detection)[0]["embedding"]
        except ValueError as ve:
            if enforce_detection:
                logging.warning(f"Face detection failed with enforce_detection=True. Retrying with enforce_detection=False")
                try:
                    embedding = DeepFace.represent(img_path=image_path, model_name="ArcFace", enforce_detection=False)[0]["embedding"]
                except Exception as e:
                    logging.error(f"Face detection failed even with enforce_detection=False: {str(e)}")
                    return jsonify({"success": False, "message": f"Face detection failed: {str(e)}"})
            else:
                logging.error(f"Face detection failed: {str(ve)}")
                return jsonify({"success": False, "message": f"Face detection failed: {str(ve)}"})

        embedding_json = json.dumps(embedding)

        cursor.execute("INSERT INTO student_face (sid, embedding) VALUES (%s, %s)", (sid, embedding_json))
        conn.commit()

        return jsonify({"success": True, "message": f"Stored embedding for student {sid}"})

    except Exception as e:
        logging.exception("Error in enroll_student")
        return jsonify({"success": False, "message": str(e)})




@app.route("/attendance", methods=["POST"])
def attendance():
    try:
        sid = request.form.get("sid")
        image_path = request.form.get("image_path")
        enforce_detection = request.form.get("enforce_detection", "true").lower() == "true"

        if not sid or not image_path:
            return jsonify({"success": False, "message": "Missing sid or image_path"})

        if not os.path.exists(image_path):
            return jsonify({"success": False, "message": f"Image file not found: {image_path}"})

        logging.info(f"Verifying attendance for student {sid} with image: {image_path}")
        logging.info(f"File size: {os.path.getsize(image_path)} bytes")

        try:
            result = verify_and_mark_attendance(sid, image_path)
            return jsonify(result)
        except ValueError as ve:
            logging.error(f"Face detection failed: {str(ve)}")
            return jsonify({"success": False, "message": f"Face detection failed: {str(ve)}"})

    except Exception as e:
        logging.exception("Error in attendance verification")
        return jsonify({"success": False, "message": str(e)})

# Modify the verify_and_mark_attendance function to include enforce_detection
def verify_and_mark_attendance(student_id, input_image, threshold=0.6, enforce_detection=True):
    try:
        input_emb = DeepFace.represent(img_path=input_image, model_name="ArcFace", enforce_detection=enforce_detection)[0]["embedding"]

        cursor.execute("SELECT embedding FROM student_face WHERE sid = %s", (student_id,))
        rows = cursor.fetchall()

        if not rows:
            return {"success": False, "message": f"No stored embedding found for student {student_id}"}

        for row in rows:
            stored_emb = json.loads(row[0])
            similarity = cosine_similarity(input_emb, stored_emb)

            if similarity > (1 - threshold):
                cursor.execute("INSERT INTO face_attendance (sid, status) VALUES (%s, %s)", (student_id, 'P'))
                conn.commit()
                return {"success": True, "message": f"Attendance marked for student {student_id}"}

        return {"success": False, "message": "Face not matched"}

    except Exception as e:
        logging.exception("Error in verify_and_mark_attendance")
        return {"success": False, "message": str(e)}



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
