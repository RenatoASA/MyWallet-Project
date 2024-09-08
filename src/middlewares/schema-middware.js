

export function validarSchema(schema) {
  return (req, res, next) => {

    const validation = schema.validate(req.body, { abortEarly: false });

    if (validation.error) {
      const messageError = validation.error.details.map(datail => datail.message);
      return res.status(422).send("Unprocessable Entity" + messageError);
    }
    next();
  }
}