const notFoundHandler = (req, res) => {
  res.status(404).json({
    code: 404,
    message: `${req.url} Not Found`,
  });
};

export default notFoundHandler;
