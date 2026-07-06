import CreatePost from "../components/CreatePost/CreatePost";
import FeedStory from "../components/Feedstory/Feedstory";
import FeedStoryMobile from "../components/Feedstory/FeedStoryMobile";
import Header from "../components/Header/Header";
import LayoutToggle from "../components/Layout/Layout";
import MobileBottomNav from "../components/MobileBottomNav/MobileBottomNav";
import MobileHeader from "../components/MobileHeader/MobileHeader";
import PostCard from "../components/PostCard/PostCard";
import LeftSidebar from "../components/Sidebar/LeftSidebar";
import RightSidebar from "../components/Sidebar/RightSidebar";
import { useAuth } from "../context/AuthContext";
import { postAPI } from "../services/api";
import { useEffect, useState } from "react";
export default function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Load posts
  const loadPosts = async (reset = false) => {
    setLoading(true);
    try {
      const currentPage = reset ? 1 : page;
      const response = await postAPI.getFeed(currentPage, 20);
      console.log('Load posts response:', response);
      const newPosts = response.data.data.posts || [];
      
      if (reset) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }
      
      setHasMore(newPosts.length === 20);
      if (!reset) setPage(currentPage + 1);
    } catch (error) {
      console.error('Load posts failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts(true);
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

 

  const handlePostUpdate = (postId) => {
    // Refresh post data
    loadPosts(true);
  };


  console.log("posts:", posts);

  if (loading && posts.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="_layout _layout_main_wrapper">
      <LayoutToggle />
      <div className="_main_layout">
        <Header />
        <MobileHeader />
        <MobileBottomNav />

        <div className="container _custom_container">
          <div className="_layout_inner_wrap">
            <div className="row">
              {/* Left Sidebar */}
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                <LeftSidebar />
              </div>

              {/* Middle Feed */}
              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div className="_layout_middle_wrap">
                  <div className="_layout_middle_inner">
                    <FeedStory />
                    <FeedStoryMobile />
                    <CreatePost onPostCreated={handlePostCreated} />
                    
                    {posts.map((post) => (
                      <PostCard 
                        key={post.id} 
                        post={post} 
                        onPostUpdate={handlePostUpdate}
                      />
                    ))}

                    {loading && (
                      <div className="text-center py-3">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    )}

                    {!loading && hasMore && posts.length > 0 && (
                      <button 
                        className="btn btn-outline-primary w-100 mt-2"
                        onClick={() => loadPosts(false)}
                      >
                        Load More
                      </button>
                    )}

                    {!loading && !hasMore && posts.length > 0 && (
                      <p className="text-center text-muted py-3">No more posts to load</p>
                    )}

                    {!loading && posts.length === 0 && (
                      <div className="text-center py-5">
                        <h4>No posts yet</h4>
                        <p className="text-muted">Be the first to create a post!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                <RightSidebar />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}