const CreateError = (name, msg) => {
  const e = new Error(msg)
  e.name = name
  return e
}

module.exports = {
  CreateError
}