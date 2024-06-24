<template>
  <div class="h-full w-full p-10">
    <Toast />
    <ConfirmDialog />
    <Dialog v-model:visible="isDialogVisible" modal header="Edit Game" :style="{ width: '25rem' }">
      <span class="text-surface-500 dark:text-surface-400 block mb-8">Update your Game information</span>
      <div class="flex items-center gap-4 mb-4">
        <label for="title" class="font-semibold w-24">Name</label>
        <InputText id="title" class="flex-auto" autocomplete="off" v-model="editingGame.title" />
      </div>
      <div class="flex items-center gap-4 mb-8">
        <label for="image-url" class="font-semibold w-24">Image Url</label>
        <InputText id="image-url" class="flex-auto" autocomplete="off" v-model="editingGame.imageUrl" />
      </div>
      <div class="flex items-center gap-4 mb-8">
        <label for="status" class="font-semibold w-24">Status</label>
        <Select id="status" v-model="editingGame.status" :options="status" optionLabel="name" optionValue="id"
          placeholder="Select a City" class="w-[259px]" />
      </div>
      <div class="flex justify-end gap-2">
        <Button type="button" label="Cancel" severity="secondary"
          @click="isDialogVisible = false; editingGame.value = {}"></Button>
        <Button type="button" label="Save" @click="updateGame(editingGame)"></Button>
      </div>
    </Dialog>

    <!-- Tools -->
    <div class="h-full w-full flex justify-center gap-20">
      <div>
        <AutoComplete placeholder="Write the Game name" v-model="query" inputId="external-games" optionLabel="name"
          :suggestions="gamesFound" @complete="searchGames" />
      </div>
      <Button label="Add" @click="addGame" />
    </div>

    <!-- Games -->
    <div class="pt-10 flex gap-4 justify-center flex-wrap">
      <Card v-for="game in games" :key="game.id" style="width: 25rem; overflow: hidden">
        <template #header>
          <img :alt="`${game.title} image`" :src="game.imageUrl" />
        </template>
        <template #title>{{ game.title }}</template>
        <template #subtitle>
          <span class="text-blue-400" v-if="game.status === 1">To Play</span>
          <span class="text-green-500" v-else-if="game.status === 2">Playing</span>
          <span v-else-if="game.status === 3">Played</span>
        </template>
        <template #footer>
          <div class="flex gap-4 mt-1">
            <Button label="Edit" severity="info" outlined class="w-full" @click="openEditDialog(game)" />
            <Button label="Delete" severity="contrast" class="w-full" @click="confirmDelete(game.id)" />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import { onMounted } from 'vue';
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";

const confirm = useConfirm();
const toast = useToast();

const apiUri = import.meta.env.VITE_API_URI;
const status = ref([
  { name: "To Play", id: 1 },
  { name: "Playing", id: 2 },
  { name: "Played", id: 3 },
]);
const query = ref("");
const gamesFound = ref([]);
const games = ref([]);
const editingGame = ref({});
const isDialogVisible = ref(false);

const searchGames = async (event) => {
  let response = await axios.get(apiUri + "/externalGames", {
    params: {
      search: event.query,
    }
  })

  gamesFound.value = response.data
}

const getGames = async () => {
  let response = await axios.get(apiUri + "/games").catch(() => {
    showErrorMessage("Error loading games, try again later");
  });

  games.value = response.data
}

const showSuccessMessage = (message) => {
  toast.add({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
};

const showWarnMessage = (message) => {
  toast.add({ severity: 'warn', summary: 'Warn', detail: message, life: 3000 });
};

const showErrorMessage = (message) => {
  toast.add({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
};

const showInfoMessage = (message) => {
  toast.add({ severity: 'info', summary: 'Info', detail: message, life: 3000 });
}

const confirmDelete = (id) => {
  confirm.require({
    message: 'Are you sure you want to delete this game?',
    header: 'Delete Game',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger'
    },
    accept: () => {
      deleteGame(id);
    }
  });
};

const addGame = () => {
  if (gamesFound.value.length === 0) {
    return showWarnMessage("Game not found");
  }

  const game = gamesFound?.value.find((e) => e?.name === query?.value?.name);

  if (!game) {
    return showWarnMessage("Game not found");
  }

  axios.post(apiUri + "/games", {
    title: game.name,
    imageUrl: game.imageUrl,
  }).then(() => {
    getGames();
    showSuccessMessage("Game added successfully");
  }).catch(() => {
    showWarnMessage("Game already added");
  });
}

const deleteGame = (id) => {
  axios.delete(apiUri + "/games/" + id).then(() => {
    getGames();
    showInfoMessage("Game deleted");
  }).catch(() => {
    showErrorMessage("Error deleting game, try again later");
  });
}

const updateGame = () => {
  axios.put(apiUri + "/games/" + editingGame.value.id, editingGame.value).then(() => {
    getGames();
    isDialogVisible.value = false;
    showSuccessMessage("Game updated successfully");
  }).catch(() => {
    showErrorMessage("Error updating game, try again later");
  });
}

const openEditDialog = (game) => {
  editingGame.value = {
    id: game.id,
    title: game.title,
    imageUrl: game.imageUrl,
    status: game.status,
  };
  isDialogVisible.value = true;
}

onMounted(() => {
  getGames();
});
</script>