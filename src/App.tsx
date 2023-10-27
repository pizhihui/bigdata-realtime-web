import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  setup() {},
  render() {
    return (
      <div class="app">
        <h2>这是主页</h2>
        <router-link to="/login">login</router-link>
        <hr />
        <router-link to="/main">main</router-link>
        <hr />
        <router-link to="/task">task</router-link>
        <hr />
        <router-link to="/test">test</router-link>
        <router-view></router-view>
      </div>
    )
  }
})
