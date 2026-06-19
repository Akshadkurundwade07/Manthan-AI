from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from dotenv import load_dotenv
import sqlite3
import os
from essay_evaluator import EssayEvaluator
from database import get_supabase_client

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
jwt = JWTManager(app)

# Database setup
DATABASE = 'essay_app.db'

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db() as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                full_name TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.execute('''
            CREATE TABLE IF NOT EXISTS essays (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                language_feedback TEXT,
                language_score INTEGER,
                analysis_feedback TEXT,
                analysis_score INTEGER,
                clarity_feedback TEXT,
                clarity_score INTEGER,
                overall_feedback TEXT,
                overall_score INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        conn.commit()

# Initialize database
init_db()

# Initialize essay evaluator
evaluator = EssayEvaluator()

# Routes
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        full_name = data.get('full_name', '')
        
        if not all([username, email, password]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        password_hash = generate_password_hash(password)
        
        with get_db() as conn:
            try:
                conn.execute(
                    'INSERT INTO users (username, email, password_hash, full_name) VALUES (?, ?, ?, ?)',
                    (username, email, password_hash, full_name)
                )
                conn.commit()
                return jsonify({'message': 'User registered successfully'}), 201
            except sqlite3.IntegrityError:
                return jsonify({'error': 'Username or email already exists'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not all([username, password]):
            return jsonify({'error': 'Missing username or password'}), 400
        
        with get_db() as conn:
            user = conn.execute(
                'SELECT * FROM users WHERE username = ?',
                (username,)
            ).fetchone()
        
        if user and check_password_hash(user['password_hash'], password):
            access_token = create_access_token(identity=str(user['id']))
            return jsonify({
                'access_token': access_token,
                'user': {
                    'id': user['id'],
                    'username': user['username'],
                    'email': user['email'],
                    'full_name': user['full_name']
                }
            }), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        user_id = int(get_jwt_identity())
        
        with get_db() as conn:
            user = conn.execute(
                'SELECT id, username, email, full_name, created_at FROM users WHERE id = ?',
                (user_id,)
            ).fetchone()
            
            if not user:
                return jsonify({'error': 'User not found'}), 404
            
            essay_count = conn.execute(
                'SELECT COUNT(*) as count FROM essays WHERE user_id = ?',
                (user_id,)
            ).fetchone()['count']
            
            avg_score = conn.execute(
                'SELECT AVG(overall_score) as avg FROM essays WHERE user_id = ?',
                (user_id,)
            ).fetchone()['avg']
        
        return jsonify({
            'user': dict(user),
            'stats': {
                'total_essays': essay_count,
                'average_score': round(avg_score, 2) if avg_score else 0
            }
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        
        full_name = data.get('full_name')
        email = data.get('email')
        
        with get_db() as conn:
            if full_name:
                conn.execute(
                    'UPDATE users SET full_name = ? WHERE id = ?',
                    (full_name, user_id)
                )
            if email:
                try:
                    conn.execute(
                        'UPDATE users SET email = ? WHERE id = ?',
                        (email, user_id)
                    )
                except sqlite3.IntegrityError:
                    return jsonify({'error': 'Email already exists'}), 400
            conn.commit()
        
        return jsonify({'message': 'Profile updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/essays/evaluate', methods=['POST'])
@jwt_required()
def evaluate_essay():
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        
        title = data.get('title', 'Untitled Essay')
        content = data.get('content')
        
        if not content:
            return jsonify({'error': 'Essay content is required'}), 400
        
        # Evaluate essay using LangGraph
        result = evaluator.evaluate(content)
        
        # Save to database
        with get_db() as conn:
            cursor = conn.execute('''
                INSERT INTO essays (
                    user_id, title, content,
                    language_feedback, language_score,
                    analysis_feedback, analysis_score,
                    clarity_feedback, clarity_score,
                    overall_feedback, overall_score
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                user_id, title, content,
                result['language_feedback'], result['language_score'],
                result['analysis_feedback'], result['analysis_score'],
                result['clarity_feedback'], result['clarity_score'],
                result['overall_feedback'], result['overall_score']
            ))
            essay_id = cursor.lastrowid
            conn.commit()
        
        return jsonify({
            'essay_id': essay_id,
            'evaluation': result
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/essays', methods=['GET'])
@jwt_required()
def get_essays():
    try:
        user_id = int(get_jwt_identity())
        
        with get_db() as conn:
            essays = conn.execute('''
                SELECT 
                    id, title, content, overall_score, created_at
                FROM essays 
                WHERE user_id = ?
                ORDER BY created_at DESC
            ''', (user_id,)).fetchall()
        
        return jsonify({
            'essays': [dict(essay) for essay in essays]
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/essays/<int:essay_id>', methods=['GET'])
@jwt_required()
def get_essay(essay_id):
    try:
        user_id = int(get_jwt_identity())
        
        with get_db() as conn:
            essay = conn.execute('''
                SELECT * FROM essays 
                WHERE id = ? AND user_id = ?
            ''', (essay_id, user_id)).fetchone()
        
        if not essay:
            return jsonify({'error': 'Essay not found'}), 404
        
        return jsonify({
            'essay': dict(essay)
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/essays/<int:essay_id>', methods=['DELETE'])
@jwt_required()
def delete_essay(essay_id):
    try:
        user_id = int(get_jwt_identity())
        
        with get_db() as conn:
            result = conn.execute(
                'DELETE FROM essays WHERE id = ? AND user_id = ?',
                (essay_id, user_id)
            )
            conn.commit()
            
            if result.rowcount == 0:
                return jsonify({'error': 'Essay not found'}), 404
        
        return jsonify({'message': 'Essay deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
