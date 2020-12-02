<template>
  <div id="lights">
    <div v-for="light in lights" :key="light.id">
      {{ light.data.name }}
      <p v-if="light.data.state === true">Allumé</p>
      <p v-else>Eteint</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component'
import Api from '../services/Api'

export default class Lights extends Vue {
  lights: [] = []
  data() {
    return {
      lights: []
    }
  }

  mounted() {
    Api.getLights().then((lights) => {
      this.lights = lights
      console.log(this.lights)
    })
  }
}
</script>
