<template>
  <nav id="nav">
    <router-link 
      v-for="(item, index) in Object.entries(links)" :key="index" 
      class="link" :to="item[0]" :class="{active: checkIfLinkActive(item[0])}"> {{ item[1] }} </router-link>
  </nav>
  <router-view />
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      links: {
        '/': 'Тренажер множення',
        '/fraction-trainer': 'Тренажер дробів',
        '/equation-trainer': 'Тренажер рівнянь'
      }
    }
  },
  methods: {
    checkIfLinkActive(link) {
      return '/' + this.$route.name == link;
    }
  },
}
</script>

