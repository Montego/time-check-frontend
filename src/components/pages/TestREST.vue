<template>
  <div class="user">
    <h1>Create User</h1>

    <h3>Just some database interaction...</h3>

    <input type="text" v-model="user.firstName" placeholder="first name">
    <input type="text" v-model="user.lastName" placeholder="last name">

    <button @click="createUser()">Create User</button>

    <div v-if="showResponse"><h6>User created with Id: {{ response }}</h6></div>

    <button v-if="showResponse" @click="retrieveUser()">Retrieve user {{user.id}} data from database</button>

    <h4 v-if="showRetrievedUser">Retrieved User {{retrievedUser.firstName}} {{retrievedUser.lastName}}</h4>

  </div>
</template>

<script>
  // import axios from 'axios'
  import {AXIOS} from '../plugins/APIService'

  export default {
    name: 'user',

    data () {
      return {
        response: [],
        errors: [],
        user: {
          lastName: '',
          firstName: '',
          id: 0
        },
        showResponse: false,
        retrievedUser: {},
        showRetrievedUser: false
      }
    },
    methods: {
      // Fetches posts when the component is created.
      createUser () {
        var params = new URLSearchParams()
        params.append('firstName', this.user.firstName)
        params.append('lastName', this.user.lastName)

        AXIOS.post(``, params)
          .then(response => {
            // JSON responses are automatically parsed.
            this.response = response.data
            this.user.id = response.data
            console.log(response.data)
            this.showResponse = true
          })
          .catch(e => {
            this.errors.push(e)
          })
      },
      retrieveUser () {
        AXIOS.get(`api/testREST/` + this.user.id)
          .then(response => {
            // JSON responses are automatically parsed.
            this.retrievedUser = response.data
            console.log(response.data)
            this.showRetrievedUser = true
          })
          .catch(e => {
            this.errors.push(e)
          })
      }
    }
  }

</script>

<style scoped>

</style>
