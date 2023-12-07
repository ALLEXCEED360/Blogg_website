import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { BiEdit } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import Comment from "../components/Comment";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { URL, IF } from "../url";
import { useContext, useEffect, useState } from "react";
import Loader from "../components/Loader";
import { UserContext } from "../context/UserContext";
import { useUser } from "../context/UserContext";
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

const PostDetails = () => {
  const postId = useParams().id;
  const [post, setPost] = useState({});
  const { user } = useUser();
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loader, setLoader] = useState(false);
  const [views, setViews] = useState(0);
  const navigate = useNavigate();

  const fetchPost = async () => {
    setLoader(true);
    try {
      const res = await axios.get(URL + "/api/posts/" + postId);
      setPost(res.data);
      setViews(res.data.views); // Update the views count from the fetched data
      setLoader(false);
    } catch (err) {
      console.log(err);
      setLoader(true);
    }
  };

  const handleDeletePost = async () => {
    try {
      await axios.delete(URL + "/api/posts/" + postId, { withCredentials: true });
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchPostComments();
  }, [postId]);

  const fetchPostComments = async () => {
    try {
      const res = await axios.get(URL + "/api/comments/post/" + postId);
      setComments(res.data);
    } catch (err) {
      console.log(err);
      console.log(postId);
    }
  };

  useEffect(() => {
    fetchPostComments();
  }, [postId]);

  const postComment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        URL + "/api/comments/create",
        { comment: comment, author: user.username, postId: postId, userId: user._id },
        { withCredentials: true }
      );
      setComment("");
      fetchPostComments();
    } catch (err) {
      console.log(err);
    }
  };

  const postUpdateComment = (id, updatedComment) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment._id === id ? { ...comment, comment: updatedComment } : comment
      )
    );
  };

  const postDeleteComment = (id) => {
    setComments((prevComments) => prevComments.filter((comment) => comment._id !== id));
  };
  const handleLike = async () => {
    try {
      await axios.put(URL + "/api/posts/" + postId + "/like", { userId: user._id }, { withCredentials: true });
      fetchPost();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDislike = async () => {
    try {
      await axios.put(URL + "/api/posts/" + postId + "/dislike", { userId: user._id }, { withCredentials: true });
      fetchPost();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Navbar />
      {loader ? (
        <div className="h-[80vh] flex justify-center items-center w-full">
          <Loader />
        </div>
      ) : (
        <div className="px-[200px] mt-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-black md:text-3xl">{post.title}</h1>
            {user?._id === post?.userId && (
              <div className="flex items-center justify-center space-x-2">
                <p className="cursor-pointer text-gray-900 hover:text-blue-500" onClick={() => navigate("/edit/" + postId)}>
                  <BiEdit />
                </p>
                <p className="cursor-pointer text-gray-900 hover:text-red-500" onClick={handleDeletePost}>
                  <MdDelete />
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between mt-2 md:mt-4">
          <div className="flex items-center space-x-2">
              <div className="bg-gray-200 rounded-md p-2">
                <span className="text-gray-600">Views:</span>
                <span className="font-bold">{views}</span>
              </div>
            </div>
            <p>@{post.username}</p>
            <div className="flex space-x-2">
              <p>{new Date(post.updatedAt).toString().slice(0, 15)}</p>
              <p>{new Date(post.updatedAt).toString().slice(16, 24)}</p>
            </div>
          </div>
          <img src={IF + post.photo} className=" mx-auto mt-8" alt="" />
          <div className="flex justify-center items-center mt-4 space-x-4">
        <div className="flex items-center space-x-2" onClick={handleLike}>
          <FaThumbsUp className="text-blue-500 cursor-pointer" size={24} />
          <span className="text-gray-600">{post.likes}</span>
        </div>
        <div className="flex items-center space-x-2" onClick={handleDislike}>
          <FaThumbsDown className="text-red-500 cursor-pointer" size={24} />
          <span className="text-gray-600">{post.dislikes}</span> 
        </div>
      </div>
          <p className="mx-auto mt-8">{post.desc}</p>
          <div className="flex items-center mt-8 space-x-4 font-semibold">
            <p>Categories:</p>
            <div className="flex justify-center items-center space-x-2">
              {post.categories?.map((c, i) => (
                <div key={i} className="bg-gray-300 rounded-lg px-3 py-1">
                  {c}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col mt-4">
            <h3 className="mt-6 mb-4 font-semibold">Comments</h3>
            {comments?.map((c) => (
              <Comment
                key={c._id}
                c={c}
                post={post}
                postUpdateComment={postUpdateComment}
                postDeleteComment={postDeleteComment}
              />
            ))}
          </div>
          {/* write a comment */}
          <div className="w-full flex flex-col mt-4 md:flex-row items-center space-x-4">
            <input
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              type="text"
              placeholder="Write a comment"
              className="md:w-[80%] outline-none py-2 px-4 rounded-lg border border-gray-300 mb-4 md:mb-0 focus:outline-none"
            />
            <button
              onClick={postComment}
              className="bg-gray-900 text-sm text-white px-4 py-2 md:w-[20%] rounded-lg hover:bg-gray-800 focus:outline-none"
            >
              Add Comment
            </button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default PostDetails;
