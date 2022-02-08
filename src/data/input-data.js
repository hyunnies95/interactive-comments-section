import store from '@/store/index.js'
export default {
  id: null,
  content: '',
  createdAt: Date.now(),
  score: 0,
  user: {
    image: { 
      png: store.getters.getCurrentUser.image.png,
      webp:  store.getters.getCurrentUser.image.webp,
    },
    username: store.getters.getCurrentUser.username
  },
  replies: []
}