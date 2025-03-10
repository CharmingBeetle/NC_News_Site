exports.handlePsqlErrors = (err, req, res, next) => {
    if(err.code === "22P02") {
        return res.status(400).send({msg: "Bad request"})
    }
    next(err)
}

exports.handleCustomErrors = (err, req, res, next)=> {
    if(err.status) {
        return res.status(err.status).send({msg: err.msg})
    }
    next(err)
}

exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send({msg: "Something went wrong!"})
}