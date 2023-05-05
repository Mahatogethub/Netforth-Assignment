const express = require('express') ;

const router = express.Router() ;
const userController = require('../controller/userController')
const blogController = require('../controller/blogController')
const auth = require('../middleware/auth')
// router.get('/' , (req,res) =>{
//     res.status(200).send({message : `Hello India`});
// })

router.post('/register' , userController.registerUser)

router.post('/login' ,auth.authenticate, userController.loginUser) ;

router.post("/blogs", auth.authenticate, blogController.createBlog);

router.get("/blogs", auth.authenticate, blogController.getBlogs);

router.put("/blogs/:blogId", auth.authenticate,auth.authorise,blogController.updateBlog);

router.delete("/blogs/:blogId", auth.authenticate, auth.authorise,blogController.deleteBlog);

router.delete("/blogs",auth.authenticate, auth.authorize,blogController.deleteBlogByCategory);


module.exports = router