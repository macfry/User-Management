<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { IUsers } from '@users'

import UserTable from '../components/UserTable.vue'
import PaginationComponent from '../components/PaginationComponent.vue'

const usersData = ref<IUsers>([]);
const loading = ref<boolean>(false);
const pageValue = ref<number>(1);
const controller = new AbortController();
const signal = controller.signal;

const getUsers = async (params?: string) => {
  try {
    loading.value = true;
    const response = await fetch(`https://reqres.in/api/users${params ? params : ''}`, { signal });
    usersData.value = await response.json();
  } catch (error) {
    console.error(`Fetch error: ${error.message}`);
  } finally {
    loading.value = false;
  }
};

const deleteUser = async (userId: number | string) => {
  try {
    loading.value = true;
    const request = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      signal
    };
    await fetch(`https://reqres.in/api/users/${userId}`, request);
    // usersData.value = usersData.value.filter(({ id }) => id !== userId);
    await getUsers();
  } catch (error) {
    console.error(`Fetch error: ${error.message}`);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await getUsers()
});

onBeforeUnmount(() => {
  controller.abort()
  usersData.value = []
});

watch([pageValue], async ([newPage], [prevPage]) => {
  if (newPage !== prevPage) {
    const params = `?page=${newPage}`
    await getUsers(params)
  }
});
</script>

<template>
  <div class="row">
    <div class="col-12">
      <UserTable :data="usersData.data" :loading="loading">
        <template #actions="{ user }">
          <div class="d-flex flex-row justify-content-center">
            <RouterLink
              :to="{
                name: 'userEdit',
                params: { id: user.id }
              }"
              class="btn"
              ><span class="material-symbols-outlined">edit</span></RouterLink
            >

            <button type="button" class="btn" @click="deleteUser(user.id)">
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
        </template>
      </UserTable>
    </div>

    <div class="col-12">
      <PaginationComponent
        :page-count="usersData.total_pages"
        :page-size="usersData.per_page"
        :page="pageValue"
        v-model="pageValue"
      />
    </div>
  </div>
</template>
