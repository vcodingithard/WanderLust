module.exports=(fn)=>{
    
    return (req,res,next)=>{
        fn(req,res,next).catch((err)=>{
            next(err);//passes the error to the error handling middleware
        })
    }
}
