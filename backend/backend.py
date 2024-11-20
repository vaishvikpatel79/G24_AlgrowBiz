from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
from werkzeug.security import generate_password_hash, check_password_hash
import re
from datetime import datetime

# Initialize Flask app
app = Flask(__name__)

# CORS(app)
CORS(app, origins=["http://localhost:3000"])

base_dir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(base_dir, 'databases/database.db')

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# Define databases
class Credentials(db.Model):
    __tablename__ = "Credentials"
    userId = db.Column('userId', db.Integer, primary_key = True, autoincrement = True)
    userName = db.Column('userName', db.Text, nullable = False) 
    email = db.Column('email', db.Text, nullable = False)  
    password = db.Column('password', db.Text, nullable = False)  
    date = db.Column('date',db.String(12), nullable = False)

# Signup route for creating a new user
@app.route('/signup', methods=['POST','GET'])
def signup():
    try:
        data = request.json
        userName = data.get('userName')
        email = data.get('email')
        password = data.get('password')

        # Check if the email already exists
        existing_user = Credentials.query.filter_by(email=email).first()
        if existing_user:
            app.logger.debug(f"Email already in use: {email}")
            return jsonify({'message': 'Email already in use.'}), 400

        if len(password) < 6 or len(password) > 12:
            return jsonify({"message": "Password must be between 6 to 12 characters"}), 400

        if not re.fullmatch(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$&])[A-Za-z\d@#$&]{6,}$', password):
            return jsonify({
                'message': 'Password must be at least 6 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character (@, #, $, or &).'
            }), 400    
        
        # Hash the password and create a new user
        hashed_password = generate_password_hash(password)
        newUser = Credentials(userName=userName, email=email, password= hashed_password, date=datetime.now())
        # Add the new user to the database
        db.session.add(newUser)
        db.session.commit()
        user = Credentials.query.filter_by(email=email).first()

        # Return success response
        # app.logger.debug(f"New user created: {userName}, {email}")
        return jsonify({'message': 'User created successfully!','userId' : user.userId}), 200

    except Exception as e:
        db.session.rollback()  # Rollback if there's an error
        app.logger.error(f"Error during signup: {str(e)}")
        return jsonify({'message': 'Internal server error'}), 500
    
# Route to handle login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    # Here we find user by email from database
    user = Credentials.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        # User login successful
        # app.logger.info(f"User login: {user.userName}, {user.email}")
        return jsonify({"message": "Login successfully", "username": user.userName, "email": user.email,  "userId" : user.userId}), 200
    else:
        # Invalid credentials
        return jsonify({"message": "Invalid email or password"}), 400
    
if __name__ == '__main__':
    app.run(debug=True)    