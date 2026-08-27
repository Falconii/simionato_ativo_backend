function success(res, message, data = {}, code = 200) {
  return res.status(code).json({
    status: "success",
    code,
    message,
    data
  });
}

function error(res, message,   details = null, code = 400) {
  const response = {
    status: "error",
    code,
    message
  };
  if (details) {
    response.details = details;
  }
  return res.status(code).json(response);
}

function backenderror(res, message, code = 500, details = null) {
  const response = {
    status: "error",
    code,
    message
  };
  if (details) {
    response.details = details;
  }
  return res.status(code).json(response);
}


function validationError(res, missingFields) {
  return error(res, "Parâmetros obrigatórios ausentes",missingFields,400);
}

function validationErrorMessage(res, message, missingFields) {
  return error(res, message, missingFields,400);
}


function notFound(res, entity, details = {}) {
  return error(res, `${entity} não encontrado`,details, 404);
}

function conflit(res, entity, details = {}) {
  return error(res, `${entity} Já Existe No Cadastro`,  details,409);
}

function backenderror(res, entity, details = {}) {
  return error(res, `${entity} Erro No Sistema!`, details,500);
}

module.exports = {
  success,
  error,
  validationError,
  validationErrorMessage,
  notFound,
  conflit,
  backenderror
};