const errorHandler = (error, req, res, next) => {
  if (error.isJoi) {
    error.status = 400;
    error.message = error.message.replace(/"/g, "");
  }

  const { status = 500, message = "Server error" } = error;

  res.status(status).json({
    code: status,
    message,
  });
};

export default errorHandler;
