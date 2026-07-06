
import React, { useState } from 'react'; 
import { postAPI } from '../../services/api'; 
import CommentSection from '../CommentSection/CommentSecton';
import { useAuth } from '../../context/AuthContext';

function LikesModal({ postId, onClose }) {
  const [likers, setLikers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    postAPI.getPostLikes(postId).then(res => {
      const data = res.data?.data;
      setLikers(data?.likes || data || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, [postId]);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: '8px', padding: '20px', minWidth: '280px', maxHeight: '400px', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <strong>People who liked this</strong>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px' }}>×</button>
        </div>
        {loading ? <p>Loading...</p> : likers.length === 0 ? <p>No likes yet.</p> : likers.map(u => (
          <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <img src={u.profile_image || '/assets/images/txt_img.png'} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
            <span>{u.first_name} {u.last_name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PostCard({ post, onPostUpdate }) {

  const { user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(post.userLiked || false);
  const [likesCount, setLikesCount] = useState(post.likeCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);

  const isOwner = user?.id === post.user_id;

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const toggleLike = async () => {
    const prevLiked = isLiked;
    const prevCount = likesCount;
    // Optimistic update
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    try {
      if (prevLiked) {
        await postAPI.unlikePost(post.id);
      } else {
        await postAPI.likePost(post.id);
      }
    } catch (error) {
      // Revert on failure
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
      console.error('Like toggle failed:', error);
    }
  };

  const toggleComments = () => setShowComments(!showComments);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    setIsDeleting(true);
    try {
      await postAPI.deletePost(post.id);
      if (onPostUpdate) onPostUpdate(post.id);
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete post. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        {/* Post Header */}
        <div className="_feed_inner_timeline_post_top">
          <div className="_feed_inner_timeline_post_box">
            <div className="_feed_inner_timeline_post_box_image">
              <img 
                src={post.user?.profile_image || '/assets/images/default-avatar.png'} 
                alt="" 
                className="_post_img" 
              />
            </div>
            <div className="_feed_inner_timeline_post_box_txt">
              <h4 className="_feed_inner_timeline_post_box_title">
                {post.user?.first_name} {post.user?.last_name}
              </h4>
              <p className="_feed_inner_timeline_post_box_para">
                {new Date(post.created_at).toLocaleDateString()} . 
                <a href="#0">{post.visibility}</a>
              </p>
            </div>
          </div>

          {/* Dropdown */}
          {isOwner && (
            <div className="_feed_inner_timeline_post_box_dropdown">
              <button 
                className="_feed_timeline_post_dropdown_link" 
                onClick={toggleDropdown}
                disabled={isDeleting}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17">
                  <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                  <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                  <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
                </svg>
              </button>
              <div className={`_feed_timeline_dropdown ${isDropdownOpen ? 'show' : ''}`}>
                <ul className="_feed_timeline_dropdown_list">
                  <li>
                    <button 
                      className="_feed_timeline_dropdown_link"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete Post'}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Post Content */}
        {post.content && (
          <h4 className="_feed_inner_timeline_post_title">{post.content}</h4>
        )}
        {post?.image_url && (
          <div className="_feed_inner_timeline_image">
            <img src={post?.image_url} alt="Post" className="_time_img" />
          </div>
        )}
      </div>

      {/* Reactions */}
      <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
        <div className="_feed_inner_timeline_total_reacts_image">
          <img src="/assets/images/react_img1.png" alt="Image" className="_react_img1" />
          <img src="/assets/images/react_img2.png" alt="Image" className="_react_img" />
          <img src="/assets/images/react_img3.png" alt="Image" className="_react_img _rect_img_mbl_none" />
          <img src="/assets/images/react_img4.png" alt="Image" className="_react_img _rect_img_mbl_none" />
          <img src="/assets/images/react_img5.png" alt="Image" className="_react_img _rect_img_mbl_none" />
          <p className="_feed_inner_timeline_total_reacts_para" style={{ cursor: 'pointer' }} onClick={() => setShowLikesModal(true)}>{likesCount}+</p>
        </div>
        <div className="_feed_inner_timeline_total_reacts_txt">
          <p className="_feed_inner_timeline_total_reacts_para1">
            <a href="#0"><span>{post.commentCount || 0}</span> Comment</a>
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="_feed_inner_timeline_reaction">
        <button 
          className={`_feed_reaction ${isLiked ? '_feed_reaction_active' : ''}`} 
          onClick={toggleLike}
        >
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 19 19">
                <path fill="#FFCC4D" d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z"/>
                <path fill="#664500" d="M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z"/>
                <path fill="#fff" d="M4.75 11.611s1.583.528 4.75.528 4.75-.528 4.75-.528-1.056 2.111-4.75 2.111-4.75-2.11-4.75-2.11z"/>
                <path fill="#664500" d="M6.333 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847zM12.667 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847z"/>
              </svg>
              {isLiked ? 'Liked' : 'Haha'}
            </span>
          </span>
        </button>

        <button className="_feed_reaction" onClick={toggleComments}>
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none" viewBox="0 0 21 21">
                <path stroke="#000" d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z"/>
                <path stroke="#000" strokeLinecap="round" strokeLinejoin="round" d="M6.938 9.313h7.125M10.5 14.063h3.563"/>
              </svg>
              Comment
            </span>
          </span>
        </button>

        <button className="_feed_reaction">
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="24" height="21" fill="none" viewBox="0 0 24 21">
                <path stroke="#000" strokeLinejoin="round" d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z"/>
              </svg>
              Share
            </span>
          </span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <CommentSection
          postId={post.id} 
          comments={post.comments || []} 
          onCommentAdded={() => {
            if (onPostUpdate) onPostUpdate(post.id);
          }}
        />
      )}
      {showLikesModal && <LikesModal postId={post.id} onClose={() => setShowLikesModal(false)} />}
    </div>
  );
}