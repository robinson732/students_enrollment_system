from flask import Blueprint, request, jsonify
try:
	from server.models import db, Enrollment
	from server.schemas import EnrollmentSchema
except ModuleNotFoundError:
	from models import db, Enrollment
	from schemas import EnrollmentSchema


enrollments_bp = Blueprint('enrollments', __name__)

enrollment_schema = EnrollmentSchema()
enrollments_schema = EnrollmentSchema(many=True)


@enrollments_bp.route('/enrollments', methods=['GET', 'POST'])
def enrollments():
    if request.method == 'GET':
        enrollments = Enrollment.query.all()
        return jsonify(enrollments_schema.dump(enrollments))
    else:
        data = request.get_json()
        payload = enrollment_schema.load(data)
        new_enrollment = Enrollment(**payload)
        db.session.add(new_enrollment)
        db.session.commit()
        return jsonify(enrollment_schema.dump(new_enrollment)), 201


@enrollments_bp.route('/enrollments/<int:id>', methods=['PUT', 'DELETE'])
def enrollment_detail(id: int):
    enrollment = Enrollment.query.get_or_404(id)
    if request.method == 'PUT':
        data = request.get_json()
        payload = enrollment_schema.load(data, partial=True)
        for key, value in payload.items():
            setattr(enrollment, key, value)
        db.session.commit()
        return jsonify(enrollment_schema.dump(enrollment))
    else:
        db.session.delete(enrollment)
        db.session.commit()
        return '', 204


