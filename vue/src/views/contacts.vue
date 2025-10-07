<template>

  <div class="info42">
     <p><b>Почта для связи:</b> simonovsim62@gmail.com <span class="phone1"><b>Номер телефона для связи:</b> +7 (914) 735-42-42</span></p>
  </div>

  <div class="a42">
    <a href="https://web.telegram.org/"><button type="button" class="btn btn-info">Телеграм</button></a>
    <a href="https://www.whatsapp.com/"><button type="button" class="btn btn-success">Whatsapp</button></a>
    <a href="https://max.ru/"><button type="button" class="btn btn-primary">MAX</button></a>
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

.info42 {text-align: center;}
.phone1 {margin-left: 100px;}
.a42 {margin-top: 70px; text-align: center;}

</style>