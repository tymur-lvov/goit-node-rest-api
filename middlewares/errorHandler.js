const statusList = {
  400: '400 Bad Request',
  401: '401 Unauthorized',
  403: '403 Forbidden',
  404: '404 Not Found',
  409: '409 Conflict',
};

const errorHandler = (error, req, res, next) => {
  const { status = 500, message = 'Server error' } = error;

  res.status(status).json({
    Status: statusList[status],
    'Content-Type': 'application/json',
    ResponseBody: { message },
  });
};

export default errorHandler;
