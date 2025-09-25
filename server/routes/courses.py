from flask import Blueprint, request, jsonify
try:
	from server.models import db, Course
	from server.schemas import CourseSchema
except ModuleNotFoundError:
	from models import db, Course
	from schemas import CourseSchema


courses_bp = Blueprint('courses', __name__)

course_schema = CourseSchema()
courses_schema = CourseSchema(many=True)


@courses_bp.route('/courses', methods=['GET', 'POST'])
def courses():
    if request.method == 'GET':
        courses = Course.query.all()
        return jsonify(courses_schema.dump(courses))
    else:
        data = request.get_json()
        payload = course_schema.load(data)
        new_course = Course(**payload)
        db.session.add(new_course)
        db.session.commit()
        return jsonify(course_schema.dump(new_course)), 201


@courses_bp.route('/courses/<int:id>', methods=['PUT', 'DELETE'])
def course_detail(id: int):
    course = Course.query.get_or_404(id)
    if request.method == 'PUT':
        data = request.get_json()
        payload = course_schema.load(data, partial=True)
        for key, value in payload.items():
            setattr(course, key, value)
        db.session.commit()
        return jsonify(course_schema.dump(course))
    else:
        db.session.delete(course)
        db.session.commit()
        return '', 204


