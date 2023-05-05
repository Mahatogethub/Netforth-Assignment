const blogModel = require("../model/blogModel");
const mongoose = require("mongoose");

//-------------------------------------------Create-Blog------------------------------------------------------------------//
const createBlog = async (req, res) => {
  try {
    let Blog = req.body;
    if (Object.keys(Blog).length == 0) {   //The Object. keys() method is used to return the 
      // object property name as an array.The length property is used to get the number of keys present in the object.
      return res.status(400).send({ status: false, msg: "Invalid request Please provide valid blog details", });
    }
    if (!Blog.title) return res.status(400).send({ msg: " title is required " });
    if (!Blog.body) return res.status(400).send({ msg: "body is required " });
    if (!Blog.authorId) return res.status(400).send({ msg: " authorId is required " });
    if (!Blog.category) return res.status(400).send({ msg: " category is require" });
    let requestUserId = req.body.authorId
    if (requestUserId !== req.loggedInUser) {
      return res.status(401).send({ status: false, msg: "Permission Denied for this User" })

    }
    let blogCreated = await blogModel.create(Blog);
    res.status(201).send({ status: true, data: blogCreated });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};
//---------------------------------------Get-Blogs--------------------------------------------------------------------//
const getBlogs = async function (req, res) {
  try {
  
    let obj = { isDeleted: false, isPublished: true }
    let { authorId, category, tags, subcategory: subcategory } = req.query //destructing method
    
   
    if (authorId) { obj.authorId = authorId }
    if (category) { obj.category = category }
    if (tags) { obj.tags = { $in: [tags] } }
    if (subcategory) { obj.subcategory = { $in: [subcategory] } }
    

    let savedData = await blogModel.find(obj)
    if (savedData.length == 0) {
      return res.status(404).send({ status: false, msg: "no document found" })
    }
    return res.status(200).send({ status: true, msg: savedData })
  }
  catch (err) {
    res.status(500).send({ status: false, msg: err.message })
  }
}

//-------------------------------------------Update-Blog--------------------------------------------------------------------//
const updateBlog = async function(req, res){
  try {

    let inputId = req.params.blogId;
    let isValid = mongoose.Types.ObjectId.isValid(inputId);  //it is used to check weather your blog format is valid or not
    if (!isValid) return res.status(400).send({ msg: "enter valid blogID" });

    let {title, body , tags , subcategory} = req.body;
   

    if (Object.keys(req.body).length == 0) {
      return res.status(400).send({status: false,msg: "Invalid request Please provide valid Author  details"});
    }

    let date = Date.now();
    let allDate = date.toString();

    let alert = await blogModel.findOne({ _id: inputId, isDeleted: true });
    if (alert) return res.status(400).send({ msg: "Blog is already deleted" });

    let blogs = await blogModel.findOneAndUpdate(
      { _id: inputId },
      {
        $set: {
          title: title,
          body: body,
          isPublished: true,
          publishedAt: allDate,
        },
        $push: { tags: tags, subcategory: subcategory },
      },
      { new: true }
    );

    if (!blogs) return res.status(404).send({ msg: "no blog found" });
    res.status(200).send({ msg: blogs });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};
//------------------------------------------Delete-Blog------------------------------------------------------------------//
const deleteBlog = async (req, res) => {
  try {
    let inputId = req.params.blogId;

    let isValid = mongoose.Types.ObjectId.isValid(inputId);
    if (!isValid) return res.status(400).send({ msg: "enter valid object Id" });

    let date = Date.now();
    let alltdate = date.toString();

    let deleteAlert = await blogModel.findOne({
      _id: inputId,
      isDeleted: true,
    });
    if (deleteAlert)
      return res.status(404).send({ msg: "This blog is already deleted" });

    let updateData = await blogModel.findOneAndUpdate(
      { _id: inputId },
      { $set: { isDeleted: true, deletedAt: alltdate } },
      { new: true }
    );

    if (!updateData)
      return res.status(404).send({ msg: "This document does not exist" });

    res.status(200).send({ status: true, msg: updateData });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};
//--------------------------------------Delete-Blog-By-Category------------------------------------------------------------------------//
const deleteBlogByCategory = async (req, res) => {
  try {
    let { category, authorId, tags, subcategory, isPublished } = req.query

    let deleteData = await blogModel.updateMany({

      authorId: req.loggedInUser,
      isDeleted: false, $or: [{ authorId: authorId },
      { isPublished: isPublished },
      { tags: tags },
      { category: category },
      { subcategory: subcategory }]
    },
      { $set: { isDeleted: true }, deletedAt: Date.now() },
      { new: true })

    if (deleteData.modifiedCount == 0) {
      return res.status(404).send({ status: false, msg: "All documents are already deleted" })
    }

    return res.status(200).send({ status: true, data: deleteData, msg: "Now, following blogs are deleted " })
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }
};
//----------------------------------------Exports------------------------------------------------------------------//

module.exports= {createBlog,getBlogs,updateBlog,deleteBlog,deleteBlogByCategory};

//----------------------------------------------------------------------------------------------------------------//

