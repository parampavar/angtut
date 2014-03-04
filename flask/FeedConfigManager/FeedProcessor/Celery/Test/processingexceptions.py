			
class FileProcessException(Exception):
	"""
    Attributes:
        file -- name of the file that is being processed
    """
	def __init__(self, file):
		self.file = file
			
class FileAccessException(FileProcessException):
	pass

class FileSchemaException(FileProcessException):
	pass

class RowException(FileSchemaException):
	"""
    Attributes:
        file -- name of the file that is being processed
        lineno -- line number that errored
        line -- line errored
        message -- message
    """

	def __init__(self, file, lineno, line, message=None):
		# logger.debug("RowException:{0}|{1}|{2}".format(file, lineno, line))
		FileSchemaException.__init__(self, file)
		self.lineno = lineno
		self.line = line
		if message == None:
			message = "Exception Occurred processing the row"
		self.message = message

class RowSchemaMismatchException(RowException):
	"""
    Attributes:
        file -- name of the file that is being processed
        lineno -- line number that errored
        line -- line errored
        message -- message
    """

	def __init__(self, file, lineno, line, message):
		# logger.debug("RowSchemaMismatchException:{0}|{1}|{2}".format(file, lineno, line))
		RowException.__init__(self, file, lineno, line)
		self.lineno = lineno
		self.line = line
		self.message = message

class RowSchemaMoreMismatchException(RowSchemaMismatchException):
	"""
    Attributes:
        file -- name of the file that is being processed
        lineno -- line number that errored
        line -- line errored
        message -- message
    """

	def __init__(self, file, lineno, line):
		# logger.debug("RowSchemaMoreMismatchException:{0}|{1}|{2}".format(file, lineno, line))
		RowSchemaMismatchException.__init__(self, file, lineno, line, "Line has more columns than defined in the Schema")

class RowSchemaLessMismatchException(RowSchemaMismatchException):
	"""
    Attributes:
        file -- name of the file that is being processed
        lineno -- line number that errored
        line -- line errored
        message -- message
    """

	def __init__(self, file, lineno, line):
		# logger.debug("RowSchemaLessMismatchException:{0}|{1}|{2}".format(file, lineno, line))
		RowSchemaMismatchException.__init__(self, file, lineno, line, "Line has fewer columns than defined in the Schema")

class RowDuplicateException(RowException):
	"""
    Attributes:
        file -- name of the file that is being processed
        lineno -- line number that errored
        line -- line errored
        message -- message
    """

	def __init__(self, file, lineno, line):
		# logger.debug("RowDuplicateException:{0}|{1}|{2}".format(file, lineno, line))
		RowException.__init__(self, file, lineno, line, "Row already exists")
	
