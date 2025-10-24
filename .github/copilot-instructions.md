# DGDA Project Copilot Instructions

## Project Overview
The Die Gewinner Debate Academie (DGDA) is a Flask-based web application for a Togolese debate academy. The project follows a traditional Flask structure with some specific patterns and integrations.

## Architecture & Components

### Application Structure
```
├── app.py                 # Main Flask application
├── database.db            # SQLite database
├── .env                   # Environment configuration
├── assets/
│   └── resources/         # PDF resources and guides
├── static/
│   ├── images/           # Gallery and site images
│   ├── script.js         # Client-side functionality
│   └── style.css         # Global styles
└── templates/
    ├── index.html        # Landing page
    ├── register.html     # Registration form
    └── terms.html        # Terms and conditions
```

### Backend Architecture (`app.py`)

#### Flask Configuration
```python
app = Flask(__name__, template_folder='templates')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
```

#### Database Models
```python
class Registration(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    location = db.Column(db.String(100), nullable=False)
    # ... other fields
```

#### Route Organization
- Landing page (`/`): Main site content and gallery
- Registration (`/register`): Member signup with validation
- Terms (`/terms`): Legal documentation
- Contact (`/contact`): Form processing endpoint

### Frontend Architecture

#### Template Structure
- Base layout components in `index.html`
- Reusable sections:
  ```html
  <!-- Section Structure -->
  <section id="section-name">
      <h2>Section Title</h2>
      <div class="content-block">
          <!-- Section content -->
      </div>
  </section>
  ```

#### JavaScript Architecture (`script.js`)
1. Event Handling
   ```javascript
   document.addEventListener('DOMContentLoaded', () => {
       // Component initialization
   });
   ```

2. Component Organization
   - Gallery Lightbox: Image viewer with navigation
   - Event Calendar: Dynamic event display
   - Form Validation: Client-side input checking

3. State Management
   ```javascript
   // Example: Gallery state
   let currentIndex = 0;
   const galleryItems = document.querySelectorAll('.gallery-item img');
   ```

### Data Flow Architecture

1. Form Submission Flow:
   ```
   Client Form -> Client Validation -> Server Route
   -> Model Validation -> Database -> Flash Message
   ```

2. Resource Serving:
   ```
   Static Assets: Direct from /static
   PDF Resources: Served from /assets/resources
   Dynamic Content: Rendered via Templates
   ```

### Integration Points

1. Database Integration
   - SQLAlchemy ORM for data operations
   - Automatic schema creation on startup
   - Transaction management with rollbacks

2. External Services
   - PDF document serving
   - Contact form email handling (simulated)
   - Social media links in footer

### Asset Management

1. Image Organization
   - Gallery images in `/static/images/`
   - Systematic naming convention
   - Alt text and captions required

2. Document Management
   - Debate resources in `/assets/resources/`
   - PDF format for downloadable content
   - Version tracking through filenames

## Key Patterns & Conventions

### Route Handling
```python
@app.route('/endpoint', methods=['GET', 'POST'])
def handler():
    if request.method == 'POST':
        # Form handling with flash messages
        flash('message', 'category')
        return redirect(url_for('route_name'))
    return render_template('template.html')
```

### Form Validation
- Server-side: Required fields checked before database operations
- Client-side: JavaScript validation in registration form
- Duplicate prevention: Email uniqueness checked before registration

### User Feedback
- Flash messages used consistently for success/error states
- Categories: 'success' or 'error' for styling

### Image Gallery Implementation
- Lightbox pattern with keyboard navigation
- Images stored in `/static/images/`
- Captions maintained in HTML structure

## Development Workflow

### Environment Setup
1. Create and activate virtual environment
2. Install dependencies: `pip install flask flask-sqlalchemy python-dotenv`
3. Create `.env` file with `SECRET_KEY`
4. Initialize database: Application creates SQLite DB on first run

### Database Operations
- Models defined in `app.py`
- Tables auto-created via `db.create_all()`
- Manual migrations not implemented - modify models and restart app

### Error Handling Patterns

#### Backend Error Handling
- Database operations wrapped in try-except blocks:
```python
try:
    db.session.add(new_record)
    db.session.commit()
    flash('Success message', 'success')
except Exception as e:
    db.session.rollback()
    flash(f'An error occurred: {str(e)}', 'error')
```

##### Database Error Recovery
- Automatic rollback on transaction failures
- Session cleanup after errors
- Unique constraint handling for email field:
```python
if Registration.query.filter_by(email=email).first():
    flash('An account with this email already exists.', 'error')
    return redirect(url_for('register'))
```

#### Form Validation Patterns

##### Server-Side Validation
- Required fields check:
```python
if not all([full_name, email, location, terms]):
    flash('All required fields must be filled.', 'error')
    return redirect(url_for('register'))
```

##### Client-Side Validation
- Real-time field validation:
```javascript
// Email pattern validation
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailPattern.test(email.value)) {
    document.getElementById('email-error').textContent = 'Please enter a valid email address.';
    document.getElementById('email-error').style.display = 'block';
    isValid = false;
}
```

- Error display structure:
```html
<input type="email" id="email" name="email">
<span id="email-error" class="error-message"></span>
```

#### Flash Message System

##### Categories and Usage
- 'success': Successful operations
  ```python
  flash('Registration successful! We will be in touch shortly.', 'success')
  ```
- 'error': Failed operations
  ```python
  flash('An error occurred: {str(e)}', 'error')
  ```

##### Message Display Pattern
- Messages shown at top of forms
- Auto-dismiss after successful operations
- Persistent display for errors requiring user action

#### Resource Error Handling

##### Missing Images
- Fallback text via alt attributes
- Error logging for missing resources
- Default image placeholder system

##### PDF Resource Handling
- Graceful fallback for missing documents
- File existence check before serving
- User-friendly error messages for unavailable resources

#### Form Submission Flow

1. Client-Side Validation
   - Real-time field validation
   - Form submission prevention if invalid
   - Clear error message display

2. Server-Side Processing
   - Secondary validation of all fields
   - Database operation attempt
   - Appropriate flash message generation

3. User Feedback
   - Success/error message display
   - Redirect to appropriate page
   - Form state preservation on error

4. Error Recovery
   - Clear error messaging
   - Option to retry submission
   - Data persistence for retry attempts

### Testing
- No automated tests currently implemented
- Manual testing through UI recommended
- Key flows to test:
  1. Registration form submission
  2. Contact form handling
  3. Gallery lightbox functionality
  4. Events calendar display

## Common Tasks

### Adding New Events
Update the `upcomingEvents` array in `script.js`:
```javascript
const upcomingEvents = [
    { 
        date: 'MMM DD, YYYY',
        title: 'Event Title',
        location: 'Venue'
    }
    // ...
];
```

### Adding Gallery Images
1. Place image in `/static/images/`
2. Add to gallery grid in `index.html` following existing pattern
3. Ensure alt text and caption are descriptive