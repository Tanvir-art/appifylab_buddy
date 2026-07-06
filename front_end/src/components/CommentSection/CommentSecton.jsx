import React, { useState, useEffect } from 'react';
import { commentAPI, replyAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const INITIAL_LIMIT = 2;

function LikersModal({ fetchFn, onClose }) {
  const [likers, setLikers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchFn().then(res => {
      const data = res.data?.data;
      
      setLikers(data?.likes || data || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: '8px', padding: '20px', minWidth: '260px', maxHeight: '360px', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <strong>Liked by</strong>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px' }}>×</button>
        </div>
        {loading ? <p>Loading...</p> : likers.length === 0 ? <p>No likes yet.</p> : likers.map(u => (
          <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <img src={u.profile_image || '/assets/images/txt_img.png'} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
            <span>{u.first_name} {u.last_name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReplyItem({ reply, onLike }) {
  const liked = reply.userLiked || reply.user_liked || false;
  const count = reply.like_count || 0;
  const [showLikers, setShowLikers] = useState(false);

  return (
    <div className="_comment_main" style={{ marginLeft: '48px', marginBottom: '12px', marginTop: '-8px' }}>
      <div className="_comment_image">
        <a href="#0" className="_comment_image_link">
          <img src={reply.profile_image || reply.user?.profile_image || '/assets/images/txt_img.png'} alt="" className="_comment_img1" />
        </a>
      </div>
      <div className="_comment_area">
        <div className="_comment_details">
          <div className="_comment_details_top">
            <div className="_comment_name">
              <a href="#0">
                <h4 className="_comment_name_title">
                  {reply.first_name || reply.user?.first_name} {reply.last_name || reply.user?.last_name}
                </h4>
              </a>
            </div>
          </div>
          <div className="_comment_status">
            <p className="_comment_status_text"><span>{reply.content}</span></p>
          </div>
          <div className="_total_reactions">
            <div className="_total_react">
              <span className="_reaction_like">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={liked ? '#1890FF' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
              </span>
            </div>
            <span className="_total" style={{ cursor: count > 0 ? 'pointer' : 'default' }} onClick={() => count > 0 && setShowLikers(true)}>{count}</span>
          </div>
          <div className="_comment_reply">
            <div className="_comment_reply_num">
              <ul className="_comment_reply_list">
                <li><span style={{ cursor: 'pointer' }} onClick={() => onLike(reply.id)}>{liked ? 'Unlike' : 'Like'}.</span></li>
                <li><span className="_time_link">.{new Date(reply.created_at).toLocaleDateString()}</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {showLikers && <LikersModal fetchFn={() => replyAPI.getReplyLikes(reply.id)} onClose={() => setShowLikers(false)} />}
    </div>
  );
}

function CommentItem({ comment, currentUser }) {
  const [liked, setLiked] = useState(comment.user_liked || comment.userLiked || false);
  const [likeCount, setLikeCount] = useState(comment.like_count || 0);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showLikers, setShowLikers] = useState(false);

  const replyCount = comment.reply_count || 0;

  const handleLike = async () => {
    const prev = liked;
    setLiked(!prev);
    setLikeCount(prev ? likeCount - 1 : likeCount + 1);
    try {
      if (prev) await commentAPI.unlikeComment(comment.id);
      else await commentAPI.likeComment(comment.id);
    } catch {
      setLiked(prev);
      setLikeCount(likeCount);
    }
  };

  const loadReplies = async () => {
    if (showReplies) { setShowReplies(false); return; }
    setLoadingReplies(true);
    try {
      const res = await replyAPI.getReplies(comment.id);
      setReplies(res.data.data.replies || []);
      setShowReplies(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingReplies(false);
    }
  };

  const handleReplyLike = async (replyId) => {
    const reply = replies.find(r => r.id === replyId);
    if (!reply) return;
    const prev = reply.userLiked;
    setReplies(replies.map(r =>
      r.id === replyId ? { ...r, userLiked: !prev, like_count: prev ? r.like_count - 1 : r.like_count + 1 } : r
    ));
    try {
      if (prev) await replyAPI.unlikeReply(replyId);
      else await replyAPI.likeReply(replyId);
    } catch {
      setReplies(replies.map(r => r.id === replyId ? { ...r, userLiked: prev } : r));
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      const res = await replyAPI.createReply({ commentId: comment.id, content: replyText });
      setReplies(prev => [...prev, res.data.data]);
      setReplyText('');
      setShowReplies(true);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="_comment_main">
      <div className="_comment_image">
        <a href="#0" className="_comment_image_link">
          <img src={comment.profile_image || comment.user?.profile_image || '/assets/images/txt_img.png'} alt="" className="_comment_img1" />
        </a>
      </div>
      <div className="_comment_area">
        <div className="_comment_details">
          <div className="_comment_details_top">
            <div className="_comment_name">
              <a href="#0">
                <h4 className="_comment_name_title">
                  {comment.first_name || comment.user?.first_name} {comment.last_name || comment.user?.last_name}
                </h4>
              </a>
            </div>
          </div>
          <div className="_comment_status">
            <p className="_comment_status_text"><span>{comment.content}</span></p>
          </div>
          <div className="_total_reactions">
            <div className="_total_react">
              <span className="_reaction_like">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={liked ? '#1890FF' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
              </span>
              <span className="_reaction_heart">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
              </span>
            </div>
            <span className="_total" style={{ cursor: likeCount > 0 ? 'pointer' : 'default' }} onClick={() => likeCount > 0 && setShowLikers(true)}>{likeCount}</span>
          </div>
          <div className="_comment_reply">
            <div className="_comment_reply_num">
              <ul className="_comment_reply_list">
                <li><span style={{ cursor: 'pointer' }} onClick={handleLike}>{liked ? 'Unlike' : 'Like'}.</span></li>
                <li><span style={{ cursor: 'pointer' }} onClick={() => {}}>Reply.</span></li>
                <li><span className="_time_link">.{new Date(comment.created_at).toLocaleDateString()}</span></li>
              </ul>
            </div>
          </div>

          {/* View previous replies */}
          {replyCount > 0 && (
            <div className="_previous_comment" style={{ marginTop: '6px' }}>
              <button type="button" className="_previous_comment_txt" onClick={loadReplies} disabled={loadingReplies}>
                {loadingReplies ? 'Loading...' : showReplies ? 'Hide replies' : `View ${replyCount} previous repl${replyCount > 1 ? 'ies' : 'y'}`}
              </button>
            </div>
          )}

          {/* Replies list */}
          {showReplies && replies.map(r => (
            <ReplyItem key={r.id} reply={r} onLike={handleReplyLike} />
          ))}

          {/* Reply input — always visible like Facebook */}
          <div className="_feed_inner_comment_box" style={{ marginTop: '8px', marginLeft: '0' }}>
            <form className="_feed_inner_comment_box_form" onSubmit={handleReplySubmit}>
              <div className="_feed_inner_comment_box_content">
                <div className="_feed_inner_comment_box_content_image">
                  <img src={currentUser?.profileImage || '/assets/images/comment_img.png'} alt="" className="_comment_img" />
                </div>
                <div className="_feed_inner_comment_box_content_txt">
                  <textarea
                    className="form-control _comment_textarea"
                    placeholder="Write a reply..."
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    disabled={submitting}
                  />
                </div>
              </div>
              <div className="_feed_inner_comment_box_icon">
                <button type="submit" className="_feed_inner_comment_box_icon_btn" disabled={submitting || !replyText.trim()}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                    <path fill="#000" fillOpacity=".46" fillRule="evenodd" d="M10.867 1.333c2.257 0 3.774 1.581 3.774 3.933v5.435c0 2.352-1.517 3.932-3.774 3.932H5.101c-2.254 0-3.767-1.58-3.767-3.932V5.266c0-2.352 1.513-3.933 3.767-3.933h5.766zm0 1H5.101c-1.681 0-2.767 1.152-2.767 2.933v5.435c0 1.782 1.086 2.932 2.767 2.932h5.766c1.685 0 2.774-1.15 2.774-2.932V5.266c0-1.781-1.089-2.933-2.774-2.933zm.426 5.733l.017.015.013.013.009.008.037.037c.12.12.453.46 1.443 1.477a.5.5 0 11-.716.697S10.73 8.91 10.633 8.816a.614.614 0 00-.433-.118.622.622 0 00-.421.225c-1.55 1.88-1.568 1.897-1.594 1.922a1.456 1.456 0 01-2.057-.021s-.62-.63-.63-.642c-.155-.143-.43-.134-.594.04l-1.02 1.076a.498.498 0 01-.707.018.499.499 0 01-.018-.706l1.018-1.075c.54-.573 1.45-.6 2.025-.06l.639.647c.178.18.467.184.646.008l1.519-1.843a1.618 1.618 0 011.098-.584c.433-.038.854.088 1.19.363zM5.706 4.42c.921 0 1.67.75 1.67 1.67 0 .92-.75 1.67-1.67 1.67-.92 0-1.67-.75-1.67-1.67 0-.921.75-1.67 1.67-1.67zm0 1a.67.67 0 10.001 1.34.67.67 0 00-.002-1.34z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {showLikers && <LikersModal fetchFn={() => { console.log('fetching likes for comment:', comment.id); return commentAPI.getCommentLikes(comment.id); }} onClose={() => setShowLikers(false)} />}
    </div>
  );
}

export default function CommentSection({ postId, onCommentAdded }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments(1, true);
  }, [postId]);

  const loadComments = async (pageNum, reset = false) => {
    setLoading(true);
    try {
      const res = await commentAPI.getComments(postId, pageNum, INITIAL_LIMIT);
      const data = res.data.data;
      const fetched = data.comments || [];
      setComments(prev => reset ? fetched : [...fetched, ...prev]);
      setTotal(data.pagination?.total || 0);
      setPage(pageNum);
    } catch (e) {
      if (e.response?.status !== 403) console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const res = await commentAPI.createComment({ postId, content: newComment });
      setComments(prev => [res.data.data, ...prev]);
      setTotal(t => t + 1);
      setNewComment('');
      if (onCommentAdded) onCommentAdded();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const shown = comments.length;
  const remaining = total - shown;

  return (
    <div className="_timline_comment_main">
      {/* View previous comments */}
      {remaining > 0 && (
        <div className="_previous_comment">
          <button type="button" className="_previous_comment_txt" onClick={() => loadComments(page + 1)} disabled={loading}>
            {loading ? 'Loading...' : `View ${remaining} previous comment${remaining > 1 ? 's' : ''}`}
          </button>
        </div>
      )}

      {/* Comments */}
      {comments.map(c => (
        <CommentItem key={c.id} comment={c} currentUser={user} />
      ))}

      {/* New comment input */}
      <div className="_feed_inner_comment_box">
        <form className="_feed_inner_comment_box_form" onSubmit={handleSubmit}>
          <div className="_feed_inner_comment_box_content">
            <div className="_feed_inner_comment_box_content_image">
              <img src={user?.profileImage || '/assets/images/comment_img.png'} alt="" className="_comment_img" />
            </div>
            <div className="_feed_inner_comment_box_content_txt">
              <textarea
                className="form-control _comment_textarea"
                placeholder="Write a comment"
                id="floatingTextarea2"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                disabled={submitting}
              />
            </div>
          </div>
          <div className="_feed_inner_comment_box_icon">
            <button type="submit" className="_feed_inner_comment_box_icon_btn" disabled={submitting || !newComment.trim()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                <path fill="#000" fillOpacity=".46" fillRule="evenodd" d="M10.867 1.333c2.257 0 3.774 1.581 3.774 3.933v5.435c0 2.352-1.517 3.932-3.774 3.932H5.101c-2.254 0-3.767-1.58-3.767-3.932V5.266c0-2.352 1.513-3.933 3.767-3.933h5.766zm0 1H5.101c-1.681 0-2.767 1.152-2.767 2.933v5.435c0 1.782 1.086 2.932 2.767 2.932h5.766c1.685 0 2.774-1.15 2.774-2.932V5.266c0-1.781-1.089-2.933-2.774-2.933zm.426 5.733l.017.015.013.013.009.008.037.037c.12.12.453.46 1.443 1.477a.5.5 0 11-.716.697S10.73 8.91 10.633 8.816a.614.614 0 00-.433-.118.622.622 0 00-.421.225c-1.55 1.88-1.568 1.897-1.594 1.922a1.456 1.456 0 01-2.057-.021s-.62-.63-.63-.642c-.155-.143-.43-.134-.594.04l-1.02 1.076a.498.498 0 01-.707.018.499.499 0 01-.018-.706l1.018-1.075c.54-.573 1.45-.6 2.025-.06l.639.647c.178.18.467.184.646.008l1.519-1.843a1.618 1.618 0 011.098-.584c.433-.038.854.088 1.19.363zM5.706 4.42c.921 0 1.67.75 1.67 1.67 0 .92-.75 1.67-1.67 1.67-.92 0-1.67-.75-1.67-1.67 0-.921.75-1.67 1.67-1.67zm0 1a.67.67 0 10.001 1.34.67.67 0 00-.002-1.34z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
