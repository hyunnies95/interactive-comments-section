<template>
  <form class="input">
    <img class="input__avatar" :src="require('@/' + currentUser.image.png)" :alt="currentUser.username" draggable="false">
    <textarea @input="resizeInput($event)" class="input__text" :placeholder="'Add a comment...'" v-model="newComment.content"></textarea>
    <button class="input__btn btn" type="submit" @click.prevent="save">SEND</button>
  </form>
</template>

<script>
import inputData from '@/data/input-data.js'

export default {
  data() {
    return {
      currentUser: this.$store.getters.getCurrentUser,
      newComment: inputData
    }
  },
  methods: {
    save() {
      this.newComment.id = this.$store.getters.getNumberOfComments + 1
      this.newComment.createdAt = Date.now()
      if (this.newComment.content !== '') {
        let newComment = {...this.newComment}
        this.$store.commit('addComment', newComment)
        this.resetInput()
      } else {
        document.querySelector('textarea').classList.add('error')
      }
    },
    resetInput() {
      this.newComment.content = ''
      this.removeInputError()
      document.querySelector('textarea').style.height = 'auto'
    },
    resizeInput(e) {
      this.removeInputError()
      e.target.style.height = 'auto'
      e.target.style.height = `${e.target.scrollHeight}px`
    },
    removeInputError() {
      document.querySelector('textarea').classList.remove('error')
    }
  }
}
</script>

<style lang="sass" scoped>
.input
  margin-top: -0.4rem
</style>