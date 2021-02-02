<template>
  <div class="email-display">
    <h2 class="mb-0">
      Subject: <strong>{{ email.subject }}</strong>
    </h2>
    <div>
      <em
        >From {{ email.from }} on
        {{ format(new Date(email.sentAt), "MMM do yyyy") }}</em
      >
    </div>
    <div v-html="marked(email.body)" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { format } from 'date-fns'
import marked from 'marked'

import { Email } from '../types'

export default defineComponent({
  props: {
    email: {
      type: Object as PropType<Email>,
      required: true
    }
  },
  setup () {
    return {
      format,
      marked
    }
  }
})
</script>

<style scoped>
</style>
