<template>
  <section class="modal">
    <div class="modal__overlay"></div>
    <div class="modal__window">
      <h1>Delete comment</h1>
      <p>Are you sure you want to delete this comment? This will remove this comment and can't be undone.</p>
      <div class="modal__btns">
        <button class="modal__btn" @click="closeModal">No, cancel</button>
        <button class="modal__btn modal__btn--delete" @click="deleteComment(id, replyToId)">Yes, delete</button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: ['id', 'replyToId'],
  methods: {
    deleteComment(id, replyToId) {
      this.$store.commit('deleteComment', {id: id, replyToId: replyToId})
      this.closeModal()
    },
    closeModal() {
      this.$emit('close-modal')
    }
  }
}
</script>

<style lang="sass" scoped>
.modal
  position: fixed
  top: 0
  right: 0
  bottom: 0
  left: 0
  &__overlay
    background-color: black
    opacity: .4
    height: 100%
    width: 100%
  &__window
    background-color: $col-white
    border-radius: 0.8rem
    position: absolute
    padding: 2.4rem 2.6rem
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    overflow: visible
    min-height: 22.4rem
    width: calc(100% - 3.2rem)
    max-width: 40rem
    @include media('medium')
      padding: 3.2rem
      min-height: 25.1rem
  &__btns
    display: flex
    gap: 1rem
    flex-wrap: wrap
    margin-top: 1.6rem
    width: 100%
    @include media('medium')
      margin-top: 2.2rem
  &__btn
    background-color: $col-grayish-blue
    border-radius: 0.8rem
    color: $col-white
    padding: 1.4rem
    text-transform: uppercase
    transition: $transition
    flex: 1
    min-width: 14rem
    &--delete
      background-color: $col-soft-red
    &:hover
      opacity: .4
</style>