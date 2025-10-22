import os
from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- Initialize Flask App ---
app = Flask(__name__, template_folder='templates')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# --- Database Models ---
class Registration(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    dob = db.Column(db.String(20))
    location = db.Column(db.String(100), nullable=False)
    how_heard = db.Column(db.String(50))
    message = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Registration {self.full_name}>"

# --- Create Database on First Run ---
with app.app_context():
    db.create_all()

# --- Routes ---
@app.route('/')
def index():
    # Render the homepage
    return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        # Retrieve form data
        full_name = request.form.get('fullName')
        email = request.form.get('email')
        phone = request.form.get('phone')
        dob = request.form.get('dob')
        location = request.form.get('location')
        how_heard = request.form.get('howHeard')
        message = request.form.get('message')
        terms = request.form.get('terms')

        # Basic server-side validation
        if not all([full_name, email, location, terms]):
            flash('All required fields must be filled.', 'error')
            return redirect(url_for('register'))

        try:
            # Check for existing email to prevent duplicates
            if Registration.query.filter_by(email=email).first():
                flash('An account with this email already exists.', 'error')
                return redirect(url_for('register'))

            # Create a new registration record
            new_registration = Registration(
                full_name=full_name,
                email=email,
                phone=phone,
                dob=dob,
                location=location,
                how_heard=how_heard,
                message=message
            )
            db.session.add(new_registration)
            db.session.commit()
            flash('Registration successful! We will be in touch shortly.', 'success')
            return redirect(url_for('register'))
        except Exception as e:
            db.session.rollback()
            flash(f'An error occurred: {str(e)}', 'error')
            return redirect(url_for('register'))

    return render_template('register.html')

@app.route('/contact', methods=['POST'])
def contact():
    # In a production environment, you would send an actual email here.
    # For now, we'll just simulate it.
    
    # Retrieve form data from the homepage contact form
    name = request.form.get('name')
    email = request.form.get('email')
    message = request.form.get('message')

    if not all([name, email, message]):
        flash('Please fill out all fields of the contact form.', 'error')
    else:
        # Simulate sending an email
        print(f"New contact message from {name} ({email}): {message}")
        flash('Thank you for your message! We will get back to you soon.', 'success')
    
    return redirect(url_for('index'))

@app.route('/terms')
def terms():
    return render_template('terms.html')

# --- Run the App ---
if __name__ == '__main__':
    app.run(debug=True)
