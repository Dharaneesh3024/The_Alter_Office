function success(res, data, status = 200) {
  return res.status(status).json({ success: true, data });
}

function created(res, data) {
  return success(res, data, 201);
}

function error(res, message = 'Server error', status = 500) {
  return res.status(status).json({ success: false, message });
}

module.exports = { success, created, error };
