from flask import Flask, request, jsonify
import firebase_admin
import os
from firebase_admin import credentials, db
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


cred = credentials.Certificate('healthcare-chatbot-442806-firebase-adminsdk-rwvcp-99d1360088.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://healthcare-chatbot-442806-default-rtdb.firebaseio.com'
})

@app.route("/", methods=["GET"])
def get_appointments():
    print("Fetching Appointments")
    try:
        ref = db.reference('patients')
        appointments = ref.get()
        return jsonify(appointments)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/", methods=["POST"])
def book_appointment():
    data = request.json
    appointment_id = data.get('id')
    ref = db.reference(f'appointments/{appointment_id}')
    appointment = ref.get()
    if appointment and appointment['available']:
        ref.update({'available': False})
        return jsonify({"message": "Appointment booked successfully!"})
    return jsonify({"message": "Appointment not available"}), 400

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)


