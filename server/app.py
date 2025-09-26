from flask import Flask, request, jsonify
from flask_cors import CORS
from marshmallow import ValidationError
try:
    from server.models import db
    from server.schemas import (
        StudentSchema,
        CourseSchema,
        EnrollmentSchema,
    )
    from server.routes import students_bp, courses_bp, enrollments_bp
except ModuleNotFoundError:
    from models import db
    from schemas import (
        StudentSchema,
        CourseSchema,
        EnrollmentSchema,
    )
    from routes.students import students_bp
    from routes.courses import courses_bp
    from routes.enrollments import enrollments_bp

app = Flask(__name__)
import os
db_path = os.path.join(os.path.dirname(__file__), "instance", "enrollment.db")
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)
db.init_app(app)

student_schema = StudentSchema()
students_schema = StudentSchema(many=True)
course_schema = CourseSchema()
courses_schema = CourseSchema(many=True)
enrollment_schema = EnrollmentSchema()
enrollments_schema = EnrollmentSchema(many=True)

# Error handler for validation
@app.errorhandler(ValidationError)
def handle_validation_error(e):
    return jsonify(e.messages), 400

app.register_blueprint(students_bp)
app.register_blueprint(courses_bp)
app.register_blueprint(enrollments_bp)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='127.0.0.1', port=5000)
