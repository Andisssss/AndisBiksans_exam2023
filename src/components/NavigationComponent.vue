<script>
import { auth } from '../stores/auth'

export default {
  data() {
    return {
      routes: [
        {
          name: 'ABOUT ME',
          path: '/about'
        },
        {
          name: 'SONGS',
          path: '/'
        },
        {
          name: 'ALBUMS',
          path: '/albums'
        }
      ],
      auth
    }
  }
}
</script>

<template>
  <nav id="main-navigaton" v-if="auth.isLogged" class="wrapper-navigation">
    <ol>
      <li v-for="(link, index) in routes" :key="index">
        <router-link :to="link.path">{{ link.name }}</router-link>
      </li>
    </ol>
  </nav>
</template>

<style >
#navigaton {
  padding: 1rem;
  background: #4609a3;
}

li {
  background: #8c5cda;
}

ol {
  list-style-type: none;
  padding: 0px;
}

a {
  display: block;
  padding: 10px;
  margin-bottom: 5px;
  font-weight: 800;
  text-decoration: none;
}
a:hover {
color: #cec000;
background-color: bisque;
}
</style>
