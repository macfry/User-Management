<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { IUser } from '@users'
import { useRoute, useRouter } from 'vue-router'

const initialUser = {
  first_name: '',
  last_name: '',
  avatar: ''
}

const user = reactive<IUser>({ ...initialUser })
const resetUser = () => Object.assign(user, initialUser)
const loading = ref<boolean>(false)
const controller = new AbortController()
const signal = controller.signal

const route = useRoute()
const router = useRouter()

const getUser = async (id: number | string) => {
  try {
    loading.value = true
    const response = await fetch(`https://reqres.in/api/users/${id}`, { signal })
    const json = await response.json()
    user.first_name = json.data.first_name
    user.last_name = json.data.last_name
    user.avatar = json.data.avatar
  } catch (error) {
    console.error(`Fetch error: ${error.message}`)
  } finally {
    loading.value = false
  }
}

const updateUser = async () => {
  try {
    loading.value = true
    const request = {
      method: route.params.id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
      signal
    }
    await fetch(`https://reqres.in/api/users/${route.params.id ?? ''}`, request)
    router.push('/')
  } catch (error) {
    console.error(`Fetch error: ${error.message}`)
  } finally {
    loading.value = false
  }
}

const convertToBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = () => {
      resolve(fileReader.result)
    }
    fileReader.onerror = (error) => {
      reject(error)
    }
  })

const onUploadImg = async (event: InputEvent) => {
  const img: File = event.target.files[0]
  const base64Img = await convertToBase64(img)
  user.avatar = base64Img
}

onMounted(async () => {
  if (route.params.id) {
    await getUser(route.params.id)
  }
})

onBeforeUnmount(() => {
  controller.abort()
  resetUser()
})
</script>

<template>
  <div class="row">
    <div class="col-xs-12 mb-3 mt-3">
      <h1>{{ route.params.id ? 'Edit' : 'Add' }} user</h1>
    </div>
  </div>

  <div class="row">
    <div class="col-xs-12 col-sm-8 mb-3">
      <div class="card border-light h-100">
        <div class="card-body d-flex flex-column justify-content-between">
          <div class="row">
            <div class="col-xs-12 col-sm-6 mb-3">
              <label for="firstName" class="form-label">First Name</label>
              <input type="text" class="form-control" id="firstName" v-model="user.first_name" />
            </div>

            <div class="col-xs-12 col-sm-6 mb-3">
              <label for="lastName" class="form-label">Last Name</label>
              <input type="text" class="form-control" id="lastName" v-model="user.last_name" />
            </div>
          </div>

          <button
            type="button"
            class="btn btn-success btn-padding align-self-start"
            @click="updateUser"
            :disabled="loading"
          >
            <template v-if="loading">
              <span class="spinner-grow spinner-grow-sm" aria-hidden="true"></span>
              <span role="status">Loading...</span>
            </template>
            <template v-else>Update Details</template>
          </button>
        </div>
      </div>
    </div>

    <div class="col-xs-12 col-sm-4 mb-3">
      <div class="card border-light">
        <div class="card-body d-flex flex-column justify-content-center align-items-center">
          <img v-if="user.avatar" :src="user.avatar" class="avatar mb-5" alt="User photo" />
          <div v-else class="avatar thumb mb-5"></div>

          <input
            ref="upload"
            class="form-control form-control-lg"
            type="file"
            name="file-upload"
            accept="image/jpeg, image/png"
            placeholder="Change Photo"
            @change="onUploadImg"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.btn-padding {
  padding: 12px 24px;
}

.full-width {
  width: 100%;
}

.avatar {
  width: 200px;
  height: 200px;
  border-radius: 50%;
}

.thumb {
  background-color: grey;
}
</style>
