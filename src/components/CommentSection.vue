<template>
  <section class="comments">
    <Comment :comment="comment" :replyToId="replyToId" />
    <div class="replies">
      <Comment v-for="reply in replies" :key="reply.id" :comment="reply" :isReply="true" :replyToId="replyToId" />
    </div>
  </section>
</template>

<script>
import Comment from '@/components/Comment.vue'

export default {
  components: {
    Comment
  },
  props: ['comment'],
  data() {
    return {
      replies: this.comment.replies,
      replyToId: this.comment.id
    }
  },

}
</script>

<style lang="sass" scoped>
.replies
  border-left: 2px solid $col-light-gray
  padding-left: 1.6rem
  @include media('medium')
    padding-left: 4.3rem
    margin-left: 4.3rem
</style>