<template>
  <div>
    <v-flex row>
      <v-dialog v-model="dialog" max-width="800px">

        <v-btn slot="activator" color="#5bc0de" dark class="mb-2">Новое событие</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md3>
                  <v-text-field v-model="editedItem.date_of" label="Дата события" type="date"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md3>
                  <v-text-field v-model="editedItem.name" label="Название"></v-text-field>
                </v-flex>
                <!--<v-divider></v-divider>-->
                <v-flex xs12 sm12 md8>
                  <!--<v-text-field v-model="editedItem.full_info" label="Полная информация" maxlength="77"></v-text-field>-->
                  <v-textarea
                    v-model="editedItem.full_info"
                    label="Полная информация"
                    counter
                    maxlength="360"
                    full-width
                    single-line
                  ></v-textarea>
                </v-flex>

                <!--<v-flex xs12 sm6 md3 v-show="false">-->
                  <!--<v-checkbox-->
                    <!--class="justify-center"-->
                    <!--v-model="editedItem.is_done"-->
                    <!--color="green"-->
                    <!--hide-details-->
                  <!--&gt;-->
                  <!--</v-checkbox>-->
                <!--</v-flex>-->
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="close">Закрыть</v-btn>
            <v-btn color="blue darken-1" flat @click.native="save">Сохранить</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!--{{info}}-->
      <!--TODO Переделать эту дичь-->
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>

      <v-text-field
        class="search_place"
        v-model="search"
        append-icon="search"
        label="Поиск"
        single-line
        hide-details
      ></v-text-field>
    </v-flex>

    <!--{{editedItem.is_done}}-->
    ////
    <!--{{info[0]._done}}-->
    <!--{{info[1]._done}}-->
    <!--{{info[2]._done}}-->
    <!--{{info[3]._done}}-->
    \\\


    <v-footer class="tabel_name">События</v-footer>

    <v-data-table
      :headers="headers"
      :items="info"
      :search="search"
      hide-actions
      class="elevation-1 text-xs-center"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{ props.item.date_of }}</td>
        <td class="text-xs-center">{{ props.item.name }}</td>
        <td class="text-xs-center">{{ props.item.full_info }}</td>
        <td class="justify-center layout px-0">
          <v-btn icon class="mx-0" @click="editItem(props.item)">
            <v-icon color="#5bc0de">edit</v-icon>
          </v-btn>
          <v-btn icon class="mx-0" @click="deleteItem(props.item)">
            <v-icon color="red">delete</v-icon>
          </v-btn>
        </td>
        <td>

          <v-btn v-model="props.item._done" icon class="mx-0" @click="isDone(props.item)">
            <v-icon :color="props.item._done ? 'green' : '#DEDEDE'" class="far fa-check-circle is_done_icon_true"></v-icon>
          </v-btn>

          <!--<template v-if="props.item._done===true">-->
            <!--<v-btn v-model="props.item._done" icon class="mx-0" @click="isDone(props.item)">-->
            <!--<v-icon class="far fa-check-circle is_done_icon_true" color="green"></v-icon>-->
            <!--</v-btn>-->
          <!--</template>-->
          <!--<template v-else>-->
            <!--<v-btn v-model="props.item._done" icon class="mx-0" @click="isDone(props.item)">-->
            <!--<v-icon class="far fa-check-circle is_done_icon_false" color="#DEDEDE"></v-icon>-->
            <!--</v-btn>-->
          <!--</template>-->
        </td>
      </template>

      <v-alert v-slot:no-results :value="true" color="error" icon="warning">
        Your search for "{{ search }}" found no results.
      </v-alert>

      <template slot="no-data">
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  import {AXIOS} from '../plugins/APIService';

  export default {
    data: () => ({
      search: '',
      dialog: false,
      headers: [
        { text: 'Дата события', value: 'date_of', align: 'center' },
        { text: 'Название', value: 'name', align: 'center' },
        { text: 'Полная информация', value: 'full_info', align: 'center' },
        { text: 'Действия', value: 'action', sortable: false, align: 'center' },
        { text: 'Выполнено', value: '_done', sortable: false, align: 'center' },
      ],
      // status: false,
      info: [],
      response:[],
      errors:[],
      editedIndex: -1,
      editedItem: {
        date_of: '',
        name: '',
        full_info: '',
        is_done:false
      },
      defaultItem: {
        date_of: '',
        name: '',
        full_info: '',
      }
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Новое событие' : 'Редактировать событие'
      }
    },

    watch: {
      dialog (val) {
        val || this.close()
      }
    },

    created () {
      this.initialize()
    },

    methods: {
       initialize(){
        this.info = [
          AXIOS.get(`/events`)
            .then(response => {
              this.info = response.data
            })
            .catch(e => {
              this.errors.push(e)
            })
        ]
      },

      editItem(item) {
        this.editedIndex = this.info.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true
      },

      isDone(item){
        const index = this.info.indexOf(item);
        const idString = this.info[index].id;
        const id = parseInt(idString,10);

          if(this.info[index]._done===false){
            this.info[index]._done=true

            AXIOS.put(`/events/` + id + '/' +  true, {
                params:
                  {
                    id:id,
                    is_done: true
                  }
              })
                .then(response => {
                  // this.editedItem.done=response.data;
                })
                .catch(e => {
                  this.errors.push(e)
                })
          }else{
            this.info[index]._done=false

            AXIOS.put(`/events/` + id + '/' + false, {
                params:
                  {
                    id:id,
                    is_done: false
                  }
              })
                .then(response => {
                  // this.editedItem.done=response.data;
                })
                .catch(e => {
                  this.errors.push(e)
                })
          }

      },

      deleteItem(item) {
        const index = this.info.indexOf(item);
        const idString = this.info[index].id;
        const id = parseInt(idString,10);
        confirm('Are you sure you want to delete this item?') && AXIOS.delete('events/' + id,{
          params:
            {
              id:id
            }
        }).then(response => {
            this.info.splice(index, 1);
        })
          .catch(e => {
            this.errors.push(e)
          });

      },

      close() {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1
        }, 300)
      },

      save() {
        if (this.editedIndex > -1) {
          Object.assign(this.info[this.editedIndex], this.editedItem);
          const idString = this.info[this.editedIndex].id;
          const id = parseInt(idString,10);
          AXIOS.put(`/events/` + id, this.editedItem)
            .then(response => {
            })
            .catch(e => {
              this.errors.push(e)
            })

        } else {
          AXIOS.post(`/events`,this.editedItem)
            .then(response => {
              this.info.push(response.data)
            })
            .catch(e => {
              this.errors.push(e)
            })
        }
        this.close();
      }
    },
  }

</script>

<style scoped>

  /*.is_done_icon_true {*/
    /*color: green;*/
  /*}*/
  /*.is_done_icon_false {*/
    /*color: #DEDEDE;*/
  /*}*/

  .search_place {
    padding-bottom: 20px;
  }
  .row {
    margin-left: 0;
    margin-right: 0;
  }
  .tabel_name {
    font-size: 30px;
    /*font-family: ;*/
  }
  v-footer {
    /*text-align: center;*/
  }
</style>
