try:
	from server.app import app
	from server.models import db, Student, Course, Enrollment
except ModuleNotFoundError:
	from app import app
	from models import db, Student, Course, Enrollment


def seed_data() -> None:
	with app.app_context():
		# Reset database
		db.drop_all()
		db.create_all()

		# Create students
		students = [
			Student(name="Alice Johnson", email="alice@example.com"),
			Student(name="Bob Smith", email="bob@example.com"),
			Student(name="Charlie Lee", email="charlie@example.com"),
		]
		for s in students:
			db.session.add(s)

		# Create courses
		courses = [
			Course(title="Intro to Python", instructor="Dr. Nguyen"),
			Course(title="Data Structures", instructor="Prof. Patel"),
			Course(title="Web Development", instructor="Ms. Rivera"),
		]
		for c in courses:
			db.session.add(c)

		db.session.commit()

		# Create enrollments (many-to-many) with grades
		enrollments = [
			Enrollment(student_id=students[0].id, course_id=courses[0].id, grade="A"),
			Enrollment(student_id=students[0].id, course_id=courses[1].id, grade="B+"),
			Enrollment(student_id=students[1].id, course_id=courses[0].id, grade="A-"),
			Enrollment(student_id=students[1].id, course_id=courses[2].id, grade="B"),
			Enrollment(student_id=students[2].id, course_id=courses[2].id, grade="C+"),
		]
		for e in enrollments:
			db.session.add(e)

		db.session.commit()
		print("Seed complete: {} students, {} courses, {} enrollments".format(
			Student.query.count(), Course.query.count(), Enrollment.query.count()
		))


if __name__ == "__main__":
	seed_data()