import { useState } from 'react'
import {
  Paper,
  Box,
  Typography,
  Avatar,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import {
  Favorite,
  FavoriteBorder,
  Comment,
  Share,
} from '@mui/icons-material'
import api from '../services/api'
import { API_BASE_URL } from '../config'

const PostCard = ({ post, currentUserId, onPostUpdated }) => {
  const [isLiked, setIsLiked] = useState(
    post.likedBy?.some((id) => String(id) === String(currentUserId)) || false
  )
  const [likesCount, setLikesCount] = useState(post.likesCount || 0)
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0)
  const [commentDialogOpen, setCommentDialogOpen] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U'
  }

  const handleLike = async () => {
    try {
      const response = await api.post(`/posts/${post.id}/like`)
      const updatedPost = response.data.post
      setIsLiked(updatedPost.likedBy?.some((id) => String(id) === String(currentUserId)) || false)
      setLikesCount(updatedPost.likesCount)
      onPostUpdated(updatedPost)
    } catch (error) {
      console.error('Failed to like post:', error)
    }
  }

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return

    setSubmittingComment(true)
    try {
      const response = await api.post(`/posts/${post.id}/comments`, {
        text: commentText.trim(),
      })
      const updatedPost = response.data.post
      setCommentsCount(updatedPost.commentsCount)
      setCommentText('')
      setCommentDialogOpen(false)
      onPostUpdated(updatedPost)
    } catch (error) {
      console.error('Failed to comment:', error)
      alert(error.response?.data?.message || 'Failed to add comment')
    } finally {
      setSubmittingComment(false)
    }
  }

  const authorName = post.author?.name || 'Unknown User'
  const authorEmail = post.author?.email || ''
  const username = authorEmail.split('@')[0] || 'user'

  return (
    <>
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 2,
          borderRadius: 2,
        }}
      >
        {/* Post Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: '#1976d2',
              width: 48,
              height: 48,
              mr: 2,
            }}
          >
            {getInitials(authorName)}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {authorName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              @{username}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
            {formatDate(post.createdAt)}
          </Typography>
          <Button
            variant="contained"
            size="small"
            sx={{ textTransform: 'none' }}
          >
            Follow
          </Button>
        </Box>

        {/* Post Content */}
        {post.text && (
          <Typography variant="body1" sx={{ mb: 2 }}>
            {post.text}
          </Typography>
        )}

        {post.imageUrl && (
          <Box
            sx={{
              mb: 2,
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <img
              src={`${API_BASE_URL}${post.imageUrl}`}
              alt="Post"
              style={{
                width: '100%',
                maxHeight: '500px',
                objectFit: 'contain',
                backgroundColor: '#f5f5f5',
              }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found'
              }}
            />
          </Box>
        )}

        {/* Engagement Metrics */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            pt: 2,
            borderTop: '1px solid #e0e0e0',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={handleLike}
              color={isLiked ? 'error' : 'default'}
              size="small"
            >
              {isLiked ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            <Typography variant="body2">{likesCount}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={() => setCommentDialogOpen(true)}
              size="small"
            >
              <Comment />
            </IconButton>
            <Typography variant="body2">{commentsCount}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small">
              <Share />
            </IconButton>
            <Typography variant="body2">0</Typography>
          </Box>
        </Box>
      </Paper>

      {/* Comment Dialog */}
      <Dialog
        open={commentDialogOpen}
        onClose={() => setCommentDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add a comment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={4}
            placeholder="Write your comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommentDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCommentSubmit}
            variant="contained"
            disabled={!commentText.trim() || submittingComment}
          >
            {submittingComment ? 'Posting...' : 'Post Comment'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default PostCard
