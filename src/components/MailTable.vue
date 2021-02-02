<template>
  <table class="mail-table">
    <tbody>
      <tr
        v-for="email in unarchivedEmails"
        :key="email.id"
        :class="['clickable', email.read ? 'read' : '']"
        @click="readEmail(email)"
      >
        <td>
          <input type="checkbox" />
        </td>
        <td>{{ email.from }}</td>
        <td>
          <p>
            <strong>{{ email.subject }}</strong> - {{ email.body }}
          </p>
        </td>
        <td class="date">
          {{ format(new Date(email.sentAt), "MMM do yyyy") }}
        </td>
        <td><button @click="archiveEmail(email)">Archive</button></td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { format } from 'date-fns'
import axios from 'axios'
import { computed, ref } from 'vue'

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
  async setup () {
    const { data: emails }: ServerResponse = await axios.get('http://localhost:3000/emails')

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

    const sortedEmails = computed(() => [...emails].sort((e1, e2) =>
      e1.sentAt < e2.sentAt ? 1 : -1))
    const unarchivedEmails = computed(() => sortedEmails.value.filter(e => !e.archived))

    return {
      archiveEmail,
      emails: ref(emails),
      format,
      readEmail,
      updateEmail,
      unarchivedEmails
    }
  }

}
</script>

<style scoped>
</style>
