from flask import Blueprint, request, jsonify
try:
	from server.models import db, Student
	from server.schemas import StudentSchema
except ModuleNotFoundError:
	from models import db, Student
	from schemas import StudentSchema


students_bp = Blueprint('students', __name__)

student_schema = StudentSchema()
students_schema = StudentSchema(many=True)


@students_bp.route('/students', methods=['GET', 'POST'])
def students():
    if request.method == 'GET':
        students = Student.query.all()
        return jsonify(students_schema.dump(students))
    else:
        data = request.get_json()
        payload = student_schema.load(data)
        new_student = Student(**payload)
        db.session.add(new_student)
        db.session.commit()
        return jsonify(student_schema.dump(new_student)), 201


@students_bp.route('/students/<int:id>', methods=['PUT', 'DELETE'])
def student_detail(id: int):
    student = Student.query.get_or_404(id)
    if request.method == 'PUT':
        data = request.get_json()
        payload = student_schema.load(data, partial=True)
        for key, value in payload.items():
            setattr(student, key, value)
        db.session.commit()
        return jsonify(student_schema.dump(student))
    else:
        db.session.delete(student)
        db.session.commit()
        return '', 204


