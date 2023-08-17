<script setup lang="ts">
import { ref, type PropType, watch } from 'vue'
import { IUser } from '@users'

import SearchComponent from './SearchComponent.vue'

const props = defineProps({
  data: {
    type: Array as PropType<IUser[]>,
    required: true
  },
  loading: {
    type: Boolean,
    required: true
  }
})

const searchValue = ref<string>('')
const users = ref<IUser[]>([])

const searchInTable = (query: string) => {
  const results = []

  if (query === '') return props.data

  for (let i = 0; i < props.data.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [_key, value] of Object.entries(props.data[i])) {
      if (value?.toString().toLowerCase().indexOf(query.toLowerCase()) > -1) {
        results.push(props.data[i])
        break
      }
    }
  }

  return results
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
watch([searchValue, () => props.data], async ([newSearch, newData], [prevSearch, _oldData]) => {
  if (newData) {
    users.value = newData
  }
  if (newSearch !== prevSearch) {
    users.value = searchInTable(newSearch)
  }
})
</script>

<template>
  <div class="row">
    <div class="col-12 mb-3 mt-3 d-flex justify-content-between align-items-center">
      <SearchComponent v-model="searchValue" />

      <router-link class="add-btn" to="/user/create"
        ><span class="add-btn-icon">&plus;</span> Add User</router-link
      >
    </div>

    <div class="col-12">
      <div v-if="loading" class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else-if="!!users" class="table-responsive">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">Full Name</th>
              <th scope="col" class="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>
                <img
                  v-if="!!user.avatar"
                  :src="user.avatar"
                  :alt="`${user.first_name} ${user.last_name}`"
                  class="avatar"
                />
              </td>
              <td>{{ `${user.first_name} ${user.last_name}` }}</td>
              <td style="width: 96px">
                <slot name="actions" :user="user"></slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-else>No items to display.</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.avatar {
  vertical-align: middle;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.add-btn {
  color: white;
  background-color: rgb(56, 134, 94);
  text-align: center;
  padding: 4px 24px;
  border-radius: 999px;
  text-decoration: none;

  &-icon {
    font-size: 20px;
  }
}

td {
  vertical-align: middle;
}
</style>
