from marshmallow import Schema, fields, validate


class StudentSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=1))
    email = fields.Email(required=True)


class CourseSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True, validate=validate.Length(min=1))
    instructor = fields.Str(required=True, validate=validate.Length(min=1))


class EnrollmentSchema(Schema):
    id = fields.Int(dump_only=True)
    student_id = fields.Int(required=True)
    course_id = fields.Int(required=True)
    grade = fields.Str(validate=validate.Regexp(r'^(A|A-|B\+|B|B-|C\+|C|C-|D\+|D|D-|F)$'))
    student = fields.Nested(StudentSchema, dump_only=True)
    course = fields.Nested(CourseSchema, dump_only=True)


