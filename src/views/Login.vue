<script>
import { auth } from '../stores/auth'

export default {
  data() {
    return {
      auth,
      user_form: {
        email: '',
        password: ''
      }
    }
  },
  computed: {
    disabled() {
      return this.user_form.email.trim().length == 0 || this.user_form.password.trim().length < 6
    }
  }
}
</script>

<template>
  <div id="login-view">
    <form class="login-form">
      <div class="wrapper-logo">
        <img src="@/assets/logo.svg" />
        <div>KRAKEN.FM</div>
      </div>
      <input placeholder="E-mail" v-model="user_form.email" />
      <input type="password" placeholder="Password" v-model="user_form.password" />
      <button
        type="submit"
        :disabled="disabled"
        @click="auth.login(user_form.email, user_form.password)"
      >
        LOGIN
      </button>
    </form>
  </div>
</template>

<style scoped lang="scss"></style>
