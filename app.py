from flask import Flask, render_template, request, jsonify
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Configuration
MANAGEMENT_EMAIL = os.getenv('EMAIL_USERNAME')
GOOGLE_REVIEW_URL = "https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID"

# Email config
SMTP_SERVER = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
SMTP_PORT = int(os.getenv('SMTP_PORT', 587))
EMAIL_USERNAME = os.getenv('EMAIL_USERNAME')
EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/submit-review', methods=['POST'])
def submit_review():
    try:
        data = request.get_json()
        
        # Process based on rating
        if int(data['rating']) <= 3:
            # Send email for low ratings
            send_management_email(
                data['name'],
                data['email'],
                data['rating'],
                data['feedback']
            )
        
        return jsonify({"success": True})
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

def send_management_email(name, email, rating, feedback):
    try:
        msg = MIMEMultipart()
        msg['From'] = EMAIL_USERNAME
        msg['To'] = MANAGEMENT_EMAIL
        msg['Subject'] = f"New Customer Feedback ({rating} stars)"
        
        body = f"""
        <h2>New Feedback Received</h2>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Rating:</strong> {rating} stars</p>
        <p><strong>Feedback:</strong></p>
        <p>{feedback}</p>
        """
        
        msg.attach(MIMEText(body, 'html'))
        
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(EMAIL_USERNAME, EMAIL_PASSWORD)
            server.send_message(msg)
            z
    except Exception as e:
        print(f"Email error: {str(e)}")
        raise

if __name__ == '__main__':
    app.run(debug=True)