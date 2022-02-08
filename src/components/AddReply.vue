<template>
  <form class="input input--reply">
    <img class="input__avatar" :src="require('@/' + currentUser.image.png)" :alt="currentUser.username" draggable="false">
    <textarea @input="resizeInput($event)" class="input__text" v-model="newReply.content"></textarea>
    <button class="input__btn btn" type="submit" @click.prevent="save">REPLY</button>
  </form>
</template>

<script>
import inputData from '@/data/input-data.js'

export default {
  props: {
    showReplyInput: Boolean,
    replyToId: Number,
    replyToUser: String
  },
  data() {
    return {
      currentUser: this.$store.getters.getCurrentUser,
      newReply: {...inputData}
    }
  },
  methods: {
    save() {
      this.newReply.id = this.$store.getters.getNumberOfComments + 1
      this.newReply.createdAt = Date.now()

      let replyingTo = {replyingTo: this.replyToUser}

      this.newReply = {...this.newReply, ...replyingTo}
      this.newReply.content = this.newReply.content.replace(/@(?=)\w+/g, "").trimStart()

      if (this.newReply.content !== '') {
        this.$store.commit('addReply', { replyToId: this.replyToId, data: this.newReply })
        this.$emit('close-reply-input')
      } else {
        this.newReply.content = '@' + this.replyToUser + ' '
        document.querySelector('textarea').classList.add('error')
      }
    },
    resizeInput(e) {
      document.querySelector('textarea').classList.remove('error')
      e.target.style.height = 'auto'
      e.target.style.height = `${e.target.scrollHeight}px`
    }
  },
  created() {
    this.newReply.content = '@' + this.replyToUser + ' '
  }
}
</script>



