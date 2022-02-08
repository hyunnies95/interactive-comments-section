<template>
  <div class="container">
    <CommentSection @open-modal="openModal" v-for="comment in comments" :key="comment.id" :comment="comment" :style="{order: -comment.score}" />
    <AddComment />
    <Modal v-if="modalIsOpen" @close-modal="closeModal" :id="id" :replyToId="replyToId" />
  </div>
</template>

<script>
import CommentSection from '@/components/CommentSection.vue'
import AddComment from '@/components/AddComment.vue'
import Modal from '@/components/Modal.vue'

export default {
  name: 'App',
  components: {
    CommentSection,
    AddComment,
    Modal
  },
  data() {
    return {
      comments: this.$store.getters.getAllComments,
      modalIsOpen: false,
      id: null,
      replyToId: null
    }
  },
  methods: {
    openModal(id, replyToId) {
      this.modalIsOpen = true
      this.id = id
      this.replyToId = replyToId
    },
    closeModal() {
      this.modalIsOpen = false
    }
  }
}
</script>

<style lang="sass" scoped>
.container
  display: flex
  flex-direction: column
  padding: 3.2rem 1.6rem
  margin: 0 auto
  max-width: 77.8rem
  @include media('medium')
    padding: 6.4rem 2.4rem
</style>
