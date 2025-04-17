<script setup>
import { ref } from 'vue';
import { useTireStore } from '../stores/tire';

const store = useTireStore();
const vehicles = ref(store.vehicles);

const newVehicle = ref({
  name: '',
  plate: '',
  type: '',
  axles: 2,
  notes: ''
});

const vehicleTypes = [
  'Caminhão',
  'Carro',
  'Ônibus',
  'Van',
  'Carreta'
];

function handleSubmit() {
  store.addVehicle({
    ...newVehicle.value,
    axles: parseInt(newVehicle.value.axles)
  });
  
  // Reset form
  newVehicle.value = {
    name: '',
    plate: '',
    type: '',
    axles: 2,
    notes: ''
  };
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Gestão de Veículos</h1>
    
    <div class="grid grid-cols-2 gap-6">
      <!-- Left Side: Add Vehicle Form -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Adicionar Novo Veículo</h2>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Nome do Veículo</label>
            <input
              type="text"
              id="name"
              v-model="newVehicle.name"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Digite o nome do veículo"
            />
          </div>

          <div>
            <label for="plate" class="block text-sm font-medium text-gray-700">Placa</label>
            <input
              type="text"
              id="plate"
              v-model="newVehicle.plate"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Digite a placa"
            />
          </div>

          <div>
            <label for="type" class="block text-sm font-medium text-gray-700">Tipo de Veículo</label>
            <select
              id="type"
              v-model="newVehicle.type"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Selecione o tipo...</option>
              <option v-for="type in vehicleTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>

          <div>
            <label for="axles" class="block text-sm font-medium text-gray-700">Número de Eixos</label>
            <input
              type="number"
              id="axles"
              v-model="newVehicle.axles"
              required
              min="2"
              max="6"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label for="notes" class="block text-sm font-medium text-gray-700">Observações</label>
            <textarea
              id="notes"
              v-model="newVehicle.notes"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Observações adicionais..."
            ></textarea>
          </div>

          <div class="pt-4">
            <button
              type="submit"
              class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Adicionar Veículo
            </button>
          </div>
        </form>
      </div>

      <!-- Right Side: Vehicles Table -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Veículos Registrados</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placa</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Eixos</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Criado em</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="vehicle in vehicles" :key="vehicle.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ vehicle.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ vehicle.plate }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ vehicle.type }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ vehicle.axles }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ new Date(vehicle.createdAt).toLocaleDateString() }}
                </td>
              </tr>
              <tr v-if="vehicles.length === 0">
                <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                  Nenhum veículo registrado ainda
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>