from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import mysql.connector
import os
from werkzeug.utils import secure_filename
from datetime import datetime

app = Flask(__name__)
CORS(app)

# MySQL Configuration
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'users_management'
}

# Upload configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'pdf'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_db_connection():
    return mysql.connector.connect(**db_config)

@app.route('/users', methods=['GET'])
def get_users():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT id, nom, prenom, cin, date_naissance, lieu_naissance, 
                   sexe, adresse, nationalite, date_expiration, cin_document 
            FROM users
        """)
        users = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(users)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT id, nom, prenom, cin, date_naissance, lieu_naissance, 
                   sexe, adresse, nationalite, date_expiration, cin_document 
            FROM users
            WHERE id = %s
        """, (user_id,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        return jsonify(user)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/users', methods=['POST'])
def add_user():
    try:
        if 'cin_document' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['cin_document']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if not allowed_file(file.filename):
            return jsonify({"error": "File type not allowed"}), 400

        # Secure the filename and save the file
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{timestamp}_{filename}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        # Get other form data
        data = request.form

        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Insert user data into database
        sql = """
            INSERT INTO users (nom, prenom, cin, date_naissance, lieu_naissance, 
                            sexe, adresse, nationalite, date_expiration, cin_document)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            data.get('Nom'),
            data.get('Prenom'),
            data.get('CIN'),
            data.get('Date_de_naissance'),
            data.get('Lieu_de_naissance'),
            data.get('Sexe'),
            data.get('Adresse'),
            data.get('Nationalite'),
            data.get('Date_Expiration'),
            filepath
        )
        
        cursor.execute(sql, values)
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "User added successfully", "file_path": filepath}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # First, get the file path
        cursor.execute("SELECT cin_document FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        
        if user and user['cin_document']:
            # Delete the file if it exists
            file_path = user['cin_document']
            if os.path.exists(file_path):
                os.remove(file_path)

        # Delete the user record
        cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/uploads/<path:filename>')
def serve_file(filename):
    try:
        return send_file(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    except Exception as e:
        return jsonify({"error": str(e)}), 404
    
@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        data = request.form
        file = request.files.get('cin_document')
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        if file:
            filename = secure_filename(file.filename)
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"{timestamp}_{filename}"
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            # Get old file path to delete
            cursor.execute("SELECT cin_document FROM users WHERE id = %s", (user_id,))
            old_file = cursor.fetchone()
            if old_file and old_file['cin_document']:
                old_path = old_file['cin_document']
                if os.path.exists(old_path):
                    os.remove(old_path)
        else:
            cursor.execute("SELECT cin_document FROM users WHERE id = %s", (user_id,))
            current_file = cursor.fetchone()
            filepath = current_file['cin_document'] if current_file else None

        sql = """
            UPDATE users 
            SET nom = %s, prenom = %s, cin = %s, date_naissance = %s,
                lieu_naissance = %s, sexe = %s, adresse = %s,
                nationalite = %s, date_expiration = %s, cin_document = %s
            WHERE id = %s
        """
        values = (
            data.get('Nom'),
            data.get('Prenom'),
            data.get('CIN'),
            data.get('Date_de_naissance'),
            data.get('Lieu_de_naissance'),
            data.get('Sexe'),
            data.get('Adresse'),
            data.get('Nationalite'),
            data.get('Date_Expiration'),
            filepath,
            user_id
        )
        
        cursor.execute(sql, values)
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "User updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)