import { useState, useEffect } from 'react'
import {
  Container,
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
} from '@mui/material'
import { Logout as LogoutIcon } from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import CreatePost from '../components/CreatePost'
import PostCard from '../components/PostCard'
import api from '../services/api'

const Feed = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchPosts = async (pageNum = 1) => {
    try {
      const response = await api.get(`/posts?page=${pageNum}&limit=10`)
      const { items, hasMore: more } = response.data
      
      if (pageNum === 1) {
        setPosts(items)
      } else {
        setPosts((prev) => [...prev, ...items])
      }
      setHasMore(more)
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts(1)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev])
  }

  const handlePostUpdated = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
    )
  }

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchPosts(nextPage)
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <AppBar position="sticky" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            TaskPlanet
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {user?.name}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 3 }}>
        <CreatePost onPostCreated={handlePostCreated} />

        <Box sx={{ mt: 3 }}>
          {loading && posts.length === 0 ? (
            <Typography align="center" color="text.secondary">
              Loading posts...
            </Typography>
          ) : posts.length === 0 ? (
            <Typography align="center" color="text.secondary">
              No posts yet. Be the first to post!
            </Typography>
          ) : (
            <>
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUserId={user?.id}
                  onPostUpdated={handlePostUpdated}
                />
              ))}
              {hasMore && (
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Button variant="outlined" onClick={handleLoadMore}>
                    Load More
                  </Button>
                </Box>
              )}
            </>
          )}
        </Box>
      </Container>
    </Box>
  )
}

export default Feed
