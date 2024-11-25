from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
from werkzeug.security import generate_password_hash, check_password_hash
import re
from datetime import datetime
import random, time
import psycopg2
from flask_mail import Mail, Message
# Initialize Flask app
app = Flask(__name__)

# CORS(app)
CORS(app, origins=["http://localhost:3000"])

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'testing6864@gmail.com'  # Replace with your email
# app.config['MAIL_PASSWORD'] = 'test@6864'   # Replace with your email password
app.config['MAIL_PASSWORD'] = 'gmwn xmep lrlt cenc'
mail = Mail(app)

base_dir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://database_owner:gY3Xv4kBxVyw@ep-little-tooth-a1ohlzy4.ap-southeast-1.aws.neon.tech/database?sslmode=require'

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# Temporary in-memory store for email-verification code mapping
verification_data = {}

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
        hashedPassword = generate_password_hash(password)
        newUser = Credentials(userName=userName, email=email, password= hashedPassword, date=datetime.now())
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

# Route to request change the password
@app.route('/forgotPassword', methods=['POST'])
def forgotPassword():
    data = request.json
    email = data.get('email')

    if not email:
        return jsonify({"message": "Email is required."}), 400

    # Generate a random 6-digit verification code
    verificationCode = f"{random.randint(100000, 999999)}"

    # Save the verification code with a timestamp (valid for 10 minutes)
    verification_data[email] = {
        "code": verificationCode,
        "timestamp": time.time()
    }
    # Check if user exists
    user = Credentials.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "User not exist with this email"}), 404

    # Send email with 6 digit verification code
    try:
        msg = Message("Your Password Reset Code - Team AlgrowBiz", sender="testing6864@gmail.com", recipients=[email])
        msg.body = f"Your verification code is : {verificationCode}. This code is valid for 10 minutes."
        mail.send(msg)
        return jsonify({"message": "Password reset email sent"}), 200
    except Exception as e:
        return jsonify({"message": "Failed to send email", "error": str(e)}), 500

@app.route('/verifyCode', methods=['POST'])
def verifyCode():
    data = request.get_json()
    email = data.get('email')
    code = data.get('verificationCode')

    if not email or not code:
        return jsonify({"message": "Email and verification code are required."}), 400

    # Check if the email exists in the verification data
    if email not in verification_data:
        return jsonify({"message": "Invalid email or verification code."}), 400

    stored_data = verification_data[email]
    stored_code = stored_data.get("code")
    timestamp = stored_data.get("timestamp")

    # Check if the code is valid and not expired (10 minutes)
    if stored_code == code and time.time() - timestamp <= 600:
        # Remove the data after successful verification
        del verification_data[email]
        return jsonify({"message": "Code verified successfully."}), 200
    else:
        return jsonify({"message": "Invalid or expired verification code."}), 400

# Route to reset the password
@app.route('/resetPassword', methods=['POST', 'GET'])
def resetPassword():
    data = request.json
    email = data.get('email')
    newPassword = data.get('newPassword')

    if not re.fullmatch(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$&])[A-Za-z\d@#$&]{6,}$', newPassword):
            return jsonify({
                'message': 'Password must be at least 6 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character (@, #, $, or &).'
            }), 400

    # Find user by email and update password
    user = Credentials.query.filter_by(email = email).first()
    if not user:
        return jsonify({"message": "User not exist with this email"}), 404

    # Hash the password and update user password
    hashedPassword = generate_password_hash(newPassword)
    user.password = hashedPassword
    db.session.commit()
    return jsonify({"message": "Password has been reset successfully"}), 200


if __name__ == '__main__':
    app.run(debug=True)    