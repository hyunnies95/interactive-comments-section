import { createStore } from 'vuex'
import json from '@/data/data.json'

let comments = window.localStorage.getItem('comments')

export default createStore({
  state: {
    comments: comments ? JSON.parse(comments) : json.comments,
    currentUser: json.currentUser
  },

  mutations: {
    addComment(state, data) {
      state.comments.push(data)
      this.commit('saveData')
    },
    addReply(state, {replyToId, data}) {
      let comment = state.comments.find(comment => comment.id === replyToId)
      comment.replies.push(data)
      this.commit('saveData')
    },
    deleteComment(state, {id, replyToId}) {
      let i
      if (replyToId != undefined && replyToId != id) {
        i = state.comments[replyToId - 1].replies.findIndex(reply => reply.id === id)
        state.comments[replyToId - 1].replies.splice(i, 1)
      } else {
        i = state.comments.findIndex(comment => comment.id === id)
        state.comments.splice(i, 1)
      }
      this.commit('saveData')
    },
    updateComment(state, {data, commentId, replyToId}) {
      let comment = (replyToId !== undefined && replyToId !== commentId) ? state.comments[replyToId - 1].replies.find(reply => reply.id === commentId) : state.comments.find(comment => comment.id === commentId)
      comment.content = data
      this.commit('saveData')
    },
    vote(state, {vote, commentId, replyToId}) {
      let comment = (replyToId !== undefined && replyToId !== commentId) ? state.comments[replyToId - 1].replies.find(reply => reply.id === commentId) : state.comments.find(comment => comment.id === commentId)
      comment.userVote === vote ? comment.userVote = '' : comment.userVote = vote
      this.commit('saveData')
    },
    saveData(state) {
      window.localStorage.setItem('comments', JSON.stringify(state.comments))
    }
  },

  getters: {
    getAllComments(state) {
      return state.comments
    },
    getCurrentUser(state) {
      return state.currentUser
    },
    getNumberOfComments(state) {
      let length = state.comments.length
      state.comments.forEach(comment => {
        length += comment.replies.length
      })
      return length
    }
  }
})