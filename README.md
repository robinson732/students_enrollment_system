# 🎓 Student Enrollment System
 
A modern, full-stack **Student Course Enrollment Management System** built with React and Flask. This application provides a comprehensive dashboard for managing students, courses, and enrollments with real-time data visualization and intuitive user interface.

## ✨ Features

### 🎯 Core Functionality

- **Student Management**: Add, edit, delete, and search students
- **Course Management**: Manage course catalog with instructors
- **Enrollment System**: Enroll students in courses with grade tracking
- **Dashboard Analytics**: Real-time KPI cards and data visualization
- **Search & Filter**: Advanced search capabilities across all entities

### 🎨 User Experience

- **Modern Dark Theme**: Professional, eye-friendly interface
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Real-time Updates**: Optimistic UI updates with API fallback
- **Form Validation**: Comprehensive client and server-side validation
- **Interactive Tables**: Inline editing and bulk operations

### 🏗️ Technical Features

- **RESTful API**: Complete CRUD operations for all entities
- **Database Relationships**: Proper many-to-many relationships
- **Data Validation**: Marshmallow schemas with comprehensive validation
- **Error Handling**: Graceful error recovery and user feedback
- **CORS Support**: Cross-origin resource sharing enabled

## 🛠️ Tech Stack

### Backend

- **Flask 3.0.3** - Web framework
- **SQLAlchemy 3.1.1** - ORM and database management
- **Marshmallow 3.21.3** - Data serialization and validation
- **SQLite** - Lightweight database
- **Flask-CORS** - Cross-origin resource sharing

### Frontend

- **React 19.1.1** - UI library
- **Vite 7.1.7** - Build tool and dev server
- **React Router 7.9.2** - Client-side routing
- **Formik 2.4.6** - Form management
- **Yup 1.7.1** - Schema validation
 
## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd students_enrollment_system
```

### 2. Backend Setup (Flask API)

```bash
# Navigate to server directory
cd server

# Install dependencies using Pipenv
pipenv install --dev --skip-lock
pipenv shell

# 
# pipenv install flask flask-sqlalchemy flask-cors marshmallow

# Initialize database and seed sample data
python3 seed.py

# Start the Flask development server
python3 app.py
```

The API will be available at `http://127.0.0.1:5000`

### 3. Frontend Setup (React App)

 

```bash
# Navigate to client directory
cd client/students-enrollment-course

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port)

## 📊 API Endpoints

### Students

- `GET /students` - Retrieve all students
- `POST /students` - Create a new student
- `PUT /students/<id>` - Update a student
- `DELETE /students/<id>` - Delete a student

### Courses

- `GET /courses` - Retrieve all courses
- `POST /courses` - Create a new course
- `PUT /courses/<id>` - Update a course
- `DELETE /courses/<id>` - Delete a course

### Enrollments

- `GET /enrollments` - Retrieve all enrollments
- `POST /enrollments` - Create a new enrollment
- `PUT /enrollments/<id>` - Update an enrollment
- `DELETE /enrollments/<id>` - Delete an enrollment

## 🗂️ Project Structure

```
students_enrollment_system/
├── 📁 server/                          # Flask Backend
│   ├── 📄 app.py                       # Flask application factory
│   ├── 📄 models.py                    # SQLAlchemy database models
│   ├── 📄 schemas.py                   # Marshmallow validation schemas
│   ├── 📄 seed.py                      # Database seeding script
│   ├── 📁 routes/                      # API route blueprints
│   │   ├── 📄 __init__.py
│   │   ├── 📄 students.py              # Student CRUD endpoints
│   │   ├── 📄 courses.py               # Course CRUD endpoints
│   │   └── 📄 enrollments.py           # Enrollment CRUD endpoints
│   └── 📁 instance/
│       └── 📄 enrollment.db            # SQLite database (auto-generated)
├── 📁 client/students-enrollment-course/  # React Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/              # Reusable React components
│   │   │   ├── 📄 Dashboard.jsx        # Main dashboard with KPIs
│   │   │   ├── 📄 StudentList.jsx      # Student management
│   │   │   ├── 📄 CourseList.jsx       # Course management
│   │   │   ├── 📄 EnrollmentList.jsx   # Enrollment management
│   │   │   ├── 📄 Header.jsx           # Application header
│   │   │   └── 📄 Navbar.jsx           # Navigation sidebar
│   │   ├── 📁 Pages/                   # Route components
│   │   │   ├── 📄 DashboardPage.jsx
│   │   │   ├── 📄 StudentsPage.jsx
│   │   │   ├── 📄 CoursesPage.jsx
│   │   │   └── 📄 EnrollmentsPage.jsx
│   │   ├── 📄 App.jsx                  # Main application component
│   │   ├── 📄 main.jsx                 # Application entry point
│   │   └── 📄 index.css                # Global styles
│   ├── 📄 package.json                 # Node.js dependencies
│   └── 📄 vite.config.js               # Vite configuration
├── 📄 Pipfile                          # Python dependencies
├── 📄 Pipfile.lock                     # Locked Python dependencies
└── 📄 README.md                        # This file
```

## 🎮 Usage Guide

### Dashboard

- View real-time statistics (Total Students, Courses, Active Enrollments)
- Search and filter students
- Quick access to add new students

### Student Management

- **Add Student**: Fill in name and email, click "Add Student"
- **Edit Student**: Click "Edit" button, modify fields, click "Save"
- **Delete Student**: Click "Delete" button to remove student
- **Search**: Use the search bar to filter students by name or email

### Course Management

- **Add Course**: Enter course title and instructor name
- **Edit Course**: Click "Edit" to modify course details
- **Delete Course**: Remove courses that are no longer needed

### Enrollment Management

- **Enroll Student**: Select student and course from dropdowns
- **Assign Grade**: Optionally assign grades (A, A-, B+, B, B-, C+, C, C-, D+, D, D-, F)
- **Edit Enrollment**: Modify student-course relationships or grades
- **Remove Enrollment**: Delete enrollment records

## 🔧 Development Commands

### Backend Commands

```bash
# Start development server
python3 app.py

# Reset and seed database
python3 seed.py

# Run with specific port
flask run -p 5001
```

### Frontend Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```
 

## 📈 Performance Features

- **Optimistic Updates**: UI updates immediately, syncs with backend
- **Error Recovery**: Graceful handling of network failures
- **Responsive Design**: Optimized for all screen sizes
- **Fast Development**: Hot module replacement with Vite
- **Efficient Queries**: Optimized database queries with SQLAlchemy

## 🔒 Data Validation

### Client-Side (Yup)

- Email format validation
- Required field validation
- Grade format validation (A-F scale)
- Minimum length requirements

### Server-Side (Marshmallow)

- Comprehensive data sanitization
- Foreign key validation
- Grade regex validation
- Database constraint enforcement

## 🎨 UI/UX Features

- **Dark Theme**: Modern, professional appearance
- **Interactive Tables**: Hover effects and smooth transitions
- **Form Validation**: Real-time error feedback
- **Loading States**: Visual feedback during operations
- **Responsive Layout**: Mobile-first design approach
- **Accessibility**: Keyboard navigation and screen reader support

## 📝 Sample Data

The seed script creates sample data including:

- 3 Students (Alice Johnson, Bob Smith, Charlie Lee)
- 3 Courses (Intro to Python, Data Structures, Web Development)
- 5 Enrollments with various grades
 

- ✅ Full-stack web development
- ✅ RESTful API design and implementation
- ✅ Database design and relationships
- ✅ Modern React development patterns
- ✅ Form handling and validation
- ✅ Responsive web design
- ✅ Error handling and user experience
- ✅ Version control and project management

---
 