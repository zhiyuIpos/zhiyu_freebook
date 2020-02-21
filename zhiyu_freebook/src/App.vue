<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
export default {
  mounted(){
    
  }
}
  document.addEventListener('DOMContentLoaded',() =>{
    const html = document.querySelector('html')
    // 根据屏幕的变化而变化
    let fontSize = window.innerWidth / 10
    // 字体限制
    fontSize = fontSize > 50 ? 50 : fontSize
    html.style.fontSize = fontSize + 'px'
  })
</script>
<style scoped lang="scss">
#app{
  width:100%;
  height:100%;
  overflow: hidden;
}
</style>
