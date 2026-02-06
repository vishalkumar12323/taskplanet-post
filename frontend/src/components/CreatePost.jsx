import { useState, useRef } from 'react'
import {
  Paper,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  CircularProgress,
} from '@mui/material'
import {
  CameraAlt as CameraIcon,
  EmojiEmotions as EmojiIcon,
  Menu as MenuIcon,
  Campaign as PromoteIcon,
  Send as PostIcon,
} from '@mui/icons-material'
import api from '../services/api'

const CreatePost = ({ onPostCreated }) => {
  const [text, setText] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!text.trim() && !image) {
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      if (text.trim()) {
        formData.append('text', text.trim())
      }
      if (image) {
        formData.append('image', image)
      }

      const response = await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setText('')
      setImage(null)
      setImagePreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      onPostCreated(response.data.post)
    } catch (error) {
      console.error('Failed to create post:', error)
      alert(error.response?.data?.message || 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          variant="outlined"
          sx={{ mb: 2 }}
        />

        {imagePreview && (
          <Box sx={{ position: 'relative', mb: 2 }}>
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                width: '100%',
                maxHeight: '400px',
                objectFit: 'contain',
                borderRadius: '8px',
              }}
            />
            <Button
              size="small"
              onClick={handleRemoveImage}
              sx={{ position: 'absolute', top: 8, right: 8 }}
              variant="contained"
              color="error"
            >
              Remove
            </Button>
          </Box>
        )}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Box sx={{ display: 'flex', gap: 1 }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              style={{ display: 'none' }}
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <IconButton component="span" color="primary">
                <CameraIcon />
              </IconButton>
            </label>
            <IconButton color="primary">
              <EmojiIcon />
            </IconButton>
            <IconButton color="primary">
              <MenuIcon />
            </IconButton>
            <Button
              startIcon={<PromoteIcon />}
              variant="outlined"
              size="small"
              sx={{ textTransform: 'none' }}
            >
              Promote
            </Button>
          </Box>
          <Button
            type="submit"
            variant="contained"
            startIcon={loading ? <CircularProgress size={16} /> : <PostIcon />}
            disabled={loading || (!text.trim() && !image)}
            sx={{ textTransform: 'none' }}
          >
            Post
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}

export default CreatePost
