<template>
  <div id="app">
    <nav>
      <router-link to="/">⇦ Главная</router-link>
    </nav>
    
    <!-- Здесь будут отображаться страницы -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

nav {
  padding: 50px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  margin: 0 10px;
}

nav a.router-link-exact-active {
  color: #42b983;
}

</style>