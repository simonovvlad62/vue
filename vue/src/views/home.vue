<template>

  <div>

    <div class="nav2">
      <button type="button" class="btn btn-primary"><router-link to="/contacts">Наши контакты</router-link></button>
      <button type="button" class="btn btn-danger"><router-link to="/login">Войти в систему</router-link></button>
    </div>

  </div>

</template>



<script>

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

export default {
  name: 'HomePage',
  mounted() {
    // Bootstrap JavaScript теперь доступен
  }
}

</script>



<style>

.nav2 {text-align: center;}
.btn {margin: 15px; color: white;}
a {text-decoration: none; color: #ffffff}

</style>