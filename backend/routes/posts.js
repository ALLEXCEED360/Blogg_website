const express=require('express')
const router=express.Router()
const User=require('../models/User')
const bcrypt=require('bcrypt')
const Post=require('../models/Post')
const Comment=require('../models/Comment')
const verifyToken = require('../verifyToken')




//CREATE
router.post("/create",verifyToken, async(req,res)=>{
    try{
        const newPost=new Post(req.body)
        const savedPost=await newPost.save()
        
        res.status(200).json(savedPost)
    }
    catch(err){
        res.status(200).json(err)
    }
})
//UPDATE
router.put("/:id",verifyToken, async (req,res)=>{
    try{
        const updatedPost=await Post.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        res.status(200).json(updatedPost)
    }
    catch(err){
        res.status(500).json(err)
    }
})


//DELETE
router.delete("/:id",verifyToken, async (req,res)=>{
    try{
        await Post.findByIdAndDelete(req.params.id)
        await Comment.deleteMany({postId:req.params.id})
        res.status(200).json("Post has been deleted!")
    }
    catch(err){
        res.status(500).json(err)
    }
})


// GET POST DETAILS
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        post.views = (post.views || 0) + 1;

        await post.save();

        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
});
// GET POSTS
router.get("/", async (req, res) => {
    const query = req.query;
    try {
      const searchFilter = {
        title: { $regex: query.search, $options: "i" },
      };
  
      let sortOption = {};
  
      switch (query.sortBy) {
        case "oldest":
          sortOption = { createdAt: 1 };
          break;
        case "title":
          sortOption = { title: 1 };
          break;

        default:
          sortOption = { createdAt: -1 };
          break;
      }
  
      const posts = await Post.find(query.search ? searchFilter : null)
        .sort(sortOption)
        .exec();
  
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  


//GET USER POSTS
router.get("/user/:userId",async (req,res)=>{
    try{
        const posts=await Post.find({userId:req.params.userId})
        res.status(200).json(posts)
    }
    catch(err){
        res.status(500).json(err)
    }
})

//SEARCH POSTS
router.get("/search/:prompt",async (req,res)=>{
    try{

    }
    catch(err){
        res.status(500).json(err)
    }
})
// LIKE A POST
router.put("/:id/like", verifyToken, async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (!post.likedBy.includes(userId)) {
            post.likes += 1;
            post.likedBy.push(userId);

            if (post.dislikedBy.includes(userId)) {
                post.dislikes -= 1;
                const index = post.dislikedBy.indexOf(userId);
                post.dislikedBy.splice(index, 1);
            }

            await post.save();
            res.json(post);
        } else {
            res.status(400).json({ message: "Already liked" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DISLIKE A POST
router.put("/:id/dislike", verifyToken, async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (!post.dislikedBy.includes(userId)) {
            post.dislikes += 1;
            post.dislikedBy.push(userId);

            if (post.likedBy.includes(userId)) {
                post.likes -= 1;
                const index = post.likedBy.indexOf(userId);
                post.likedBy.splice(index, 1);
            }

            await post.save();
            res.json(post);
        } else {
            res.status(400).json({ message: "Already disliked" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//USER RATINGS UPDATE
router.post("/:id/rate", verifyToken, async (req, res) => {
    const { id } = req.params;
    const { userId, rating } = req.body;

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const existingRatingIndex = post.ratings.findIndex(r => r.userId.toString() === userId);

        if (existingRatingIndex !== -1) {
            return res.status(400).json({ message: "User has already rated this post" });
        }

        post.ratings.push({ userId, rating });

        const totalRatings = post.ratings.reduce((acc, curr) => acc + curr.rating, 0);
        post.averageRating = totalRatings / post.ratings.length;

        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports=router