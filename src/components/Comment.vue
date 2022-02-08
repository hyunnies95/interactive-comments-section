<template>
  <div class="comment" :class="{ 'comment--reply': isReply }">

    <div class="comment__user-info">
      <img class="comment__avatar" :src="require('@/' + comment.user.image.png)" :alt="comment.user.username" draggable="false">
      <h3 class="comment__username">{{ comment.user.username }}</h3>
      <span v-show="isCurrentUser">you</span>
      <p class="comment__posted">{{ createdAt }}</p>
    </div>

    <p class="comment__content" v-if="!updateMode">
      <span v-show="isReply">@{{ comment.replyingTo }}</span>
      {{ comment.content }}
    </p>

    <form class="comment__edit" v-if="updateMode">
      <textarea class="input__text" @input="resizeInput($event)" @click="resizeInput($event)" v-model="newCommentContent"></textarea>
      <button @click.prevent="updateComment" type="submit" class="btn">UPDATE</button>
    </form>

    <div class="comment__votes">
      <button class="upvote" @click="vote('upvote')" :class="{ active: comment.userVote === 'upvote', disabled: isCurrentUser}" aria-label="upvote">
        <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg>
      </button>
      <span>{{ commentScore }}</span>
      <button class="downvote" @click="vote('downvote')" :class="{ active: comment.userVote === 'downvote', disabled: isCurrentUser}" aria-label="downvote">
        <svg width="11" height="3" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg>
      </button>
    </div>

    <div class="comment__btns">
      <button class="comment__btn" v-show="!isCurrentUser" @click="openReplyInput"><img src="@/assets/images/icon-reply.svg" alt="reply-icon"> Reply</button>
      <button class="comment__btn comment__btn--delete" v-show="isCurrentUser" @click="deleteComment"><img src="@/assets/images/icon-delete.svg" alt="delete-icon"> Delete</button>
      <button class="comment__btn" v-show="isCurrentUser" @click="editComment"><img src="@/assets/images/icon-edit.svg" alt="edit-icon"> Edit</button>
    </div>
  </div>
  
  <AddReply
    v-if="replyInputIsOpened"
    :replyToId="replyToId"
    :replyToUser="comment.user.username"
    @close-reply-input="replyInputIsOpened = false"
  />
  
</template>

<script>
import AddReply from '@/components/AddReply.vue'

export default {
  components: { AddReply},
  props: {
    comment: Object,
    isReply: Boolean,
    replyToId: Number
  },
  data() {
    return {
      currentUser: this.$store.getters.getCurrentUser,
      replyInputIsOpened: false,
      updateMode: false,
      commentContent: this.comment.content,
      newCommentContent: this.comment.content,
    }
  },
  computed: {
    isCurrentUser() {
      return this.comment.user.username === this.currentUser.username
    },
    createdAt() {
      let time = this.timeSince(this.comment.createdAt)
      return time != this.comment.createdAt ? time + ' ago' : time
    },
    commentScore() {
      return (this.comment.userVote === 'upvote') ? this.comment.score + 1 : (this.comment.userVote === 'downvote') ? this.comment.score - 1 : this.comment.score
    }
  },
  methods: {
    openReplyInput() {
      this.replyInputIsOpened = !this.replyInputIsOpened
    },
    deleteComment() {
      this.$parent.$emit('open-modal', this.comment.id, this.replyToId)
    },
    editComment() {
      this.updateMode = !this.updateMode
      this.newCommentContent = this.comment.content
      setTimeout(() => {
        document.querySelector('textarea').style.height = `${document.querySelector('textarea').scrollHeight}px`
      }, 0)
    },
    updateComment() {
      if (this.newCommentContent !== '') {
        this.$store.commit('updateComment', {data: this.newCommentContent, commentId: this.comment.id, replyToId: this.replyToId})
        this.updateMode = false
      } else {
        document.querySelector('textarea').classList.add('error')
      }
    },
    resizeInput(e) {
      e.target.style.height = 'auto'
      e.target.style.height = `${e.target.scrollHeight}px`
    },
    vote(vote) {
      this.$store.commit('vote', { vote: vote, commentId: this.comment.id, replyToId: this.replyToId })
    },

    timeSince(date) {
      if (typeof(date) === 'string') return date

      let seconds = Math.floor((new Date() - date) / 1000)
      let interval = seconds / 31536000

      if (interval > 1) {
        return Math.floor(interval) + ' years'
      }
      interval = seconds / 2592000
      if (interval > 1) {
        return Math.floor(interval) + ' months'
      }
      interval = seconds / 86400
      if (interval > 1) {
        return Math.floor(interval) + ' days'
      }
      interval = seconds / 3600
      if (interval > 1) {
        return Math.floor(interval) + ' hours'
      }
      interval = seconds / 60
      if (interval > 1) {
        return Math.floor(interval) + ' minutes'
      }
      return Math.floor(seconds) + ' seconds'
      
    }
  }
}
</script>

<style lang="sass" scoped>
.comment
  background: $col-white
  display: grid
  grid-template-columns: 1fr 1fr
  grid-template-rows: repeat(3, auto)
  border-radius: 0.8rem
  padding: 1.6rem
  margin-bottom: 1.6rem
  @include media('medium')
    grid-template-columns: auto 1fr auto
    grid-template-rows: auto 1fr
    column-gap: 2.4rem
    padding: 2.4rem
    margin-bottom: 2rem
  &--reply
    @include media('medium')
      margin-bottom: 2.4rem

  &__user-info
    display: flex
    align-items: center
    gap: 1.6rem
    grid-column: 1 / 4
    @include media('medium')
      grid-column: 2 / 3
      grid-row: 1 / 2
    & span
      background: $col-moderate-blue
      border-radius: 0.2rem
      color: $col-white
      font-size: 1.4rem
      padding: 0.1rem 0.6rem
      margin-left: -0.8rem
  &__avatar
    height: 3.2rem
    width: 3.2rem
  &__content,
  &__edit
    grid-column: 1 / 3
    margin: 1.5rem 0
    @include media('medium')
      grid-column: 2 / 4
      margin-bottom: 0
    & span
      color: $col-moderate-blue
      font-weight: 500
  &__edit
    display: flex
    flex-direction: column
    textarea
      width: 100%
    & .btn
      margin-top: 1.6rem
      margin-left: auto
  &__votes
    background: $col-very-light-gray
    border-radius: 1rem
    display: flex
    align-items: center
    justify-content: space-between
    grid-column: 1 / 2
    height: 4.1rem
    width: 10rem
    @include media('medium')
      flex-direction: column
      grid-column: 1 / 2
      grid-row: 1 / 3
      height: 10rem
      width: 4rem
    & button
      display: flex
      align-items: center
      justify-content: center
      cursor: pointer
      height: 100%
      width: 3.6rem
      &:hover > svg path
        fill: $col-moderate-blue
      & svg path
        transition: $transition
      &.active svg path
        fill: $col-moderate-blue
      &.disabled
        pointer-events: none
      @include media('medium')
        &:first-of-type
          padding-bottom: 0.5rem
        &:last-of-type
          padding-top: 0.5rem
        
    & span
      color: $col-moderate-blue
      cursor: default
      font-weight: bold
  &__btns
    display: flex
    grid-column: 2 / 3
    margin-left: auto
    @include media('medium')
      grid-column: 3 / 4
      grid-row: 1 / 2
  &__btn
    color: $col-moderate-blue
    font-size: 1.6rem
    font-weight: bold
    letter-spacing: -0.3px
    transition: $transition
    &:hover
      opacity: .4
    &--delete
      color: $col-soft-red
      margin-right: 1.6rem
      @include media('medium')
        margin-right: 2.4rem
    & img
      margin-right: 0.3rem


</style>