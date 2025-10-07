<template>

  <div>
    <center><p class="vhodt1">Войти в аккаунт</p></center>
    <form style="margin-top: 35px;">
      <div class="mb-3">
        <label for="exampleInputEmail1" class="form-label">Адрес электронной почты</label>
        <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
      </div>
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label">Пароль</label>
        <input type="password" class="form-control" id="exampleInputPassword1">
      </div>
      <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="exampleCheck1">
        <label class="form-check-label" for="exampleCheck1">Проверить меня</label>
      </div>
      <center><button type="submit" class="btn btn-primary">Отправить</button></center>
    </form>
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

form {text-align: left; margin: auto; width: 350px;}
.form-control {width: 350px; margin: auto;}
.form-label {width: 350px; margin: auto;}
.form-check {width: 350px; margin: auto;}

.vhodt1 {font-size: 23px;}

</style>