<template>
  <table class="mail-table">
    <tbody>
      <tr
        v-for="email in unarchivedEmails"
        :key="email.id"
        :class="['clickable', email.read ? 'read' : '']"
      >
        <td>
          <input type="checkbox" />
        </td>
        <td @click="openEmail(email)">{{ email.from }}</td>
        <td @click="openEmail(email)">
          <p>
            <strong>{{ email.subject }}</strong> - {{ email.body }}
          </p>
        </td>
        <td class="date" @click="openEmail(email)">
          {{ format(new Date(email.sentAt), "MMM do yyyy") }}
        </td>
        <td><button @click="archiveEmail(email)">Archive</button></td>
      </tr>
    </tbody>
  </table>
  <ModalView v-if="openedEmail" @closeModal="openedEmail = null">
    <MailView v-if="openedEmail" :email="openedEmail" />
  </ModalView>
</template>

<script lang="ts">
import { format } from 'date-fns'
import axios from 'axios'
import { computed, reactive, ref } from 'vue'

import MailView from '@/components/MailView.vue'
import ModalView from '@/components/ModalView.vue'

interface Email {
  id: number;
  from: string;
  subject: string;
  body: string;
  sentAt: string;
  archived: boolean;
  read: boolean;
}

interface ServerResponse {
  data: Email[];
}

export default {
  components: {
    MailView,
    ModalView
  },
  async setup () {
    const { data }: ServerResponse = await axios.get('http://localhost:3000/emails')
    const emails = reactive(data)
    const openedEmail = ref<null | Email>(null)

    const updateEmail = (email: Email) => {
      axios.put(`http://localhost:3000/emails/${email.id}`, email)
    }
    const readEmail = (email: Email) => {
      email.read = true
      updateEmail(email)
    }
    const archiveEmail = (email: Email) => {
      email.archived = true
      updateEmail(email)
    }
    const openEmail = (email: Email) => {
      email.read = true
      updateEmail(email)
      openedEmail.value = email
    }

    const sortedEmails = computed(() => [...emails].sort((e1, e2) =>
      e1.sentAt < e2.sentAt ? 1 : -1))
    const unarchivedEmails = computed(() => sortedEmails.value.filter(e => !e.archived))

    return {
      emails,
      unarchivedEmails,

      archiveEmail,
      readEmail,
      updateEmail,

      openedEmail,
      openEmail,

      format
    }
  }

}
</script>

<style scoped>
</style>
