try:
    from server.routes.students import students_bp
    from server.routes.courses import courses_bp
    from server.routes.enrollments import enrollments_bp
except ModuleNotFoundError:
    from .students import students_bp
    from .courses import courses_bp
    from .enrollments import enrollments_bp

__all__ = [
    'students_bp',
    'courses_bp',
    'enrollments_bp',
]


