<script setup>
import { ref } from 'vue';
import { useTireStore } from '../stores/tire';

const store = useTireStore();
const maintenanceRecords = ref(store.maintenanceRecords);
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Manutenção</h1>
    <div class="bg-white rounded-lg shadow p-6">
      <div v-if="maintenanceRecords.length === 0" class="text-center text-gray-500">
        Nenhum registro de manutenção ainda
      </div>
      <div v-else class="space-y-4">
        <div v-for="record in maintenanceRecords" :key="record.id" class="bg-gray-50 rounded-lg p-4">
          <h3 class="text-lg font-semibold">Manutenção #{{ record.id }}</h3>
          <p class="text-gray-600">Data: {{ new Date(record.date).toLocaleDateString() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>