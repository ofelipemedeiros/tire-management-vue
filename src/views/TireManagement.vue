<script setup>
import { ref } from 'vue';
import { useTireStore } from '../stores/tire';

const store = useTireStore();
const tires = ref(store.tires);

const newTire = ref({
  identification: '',
  brand: '',
  model: '',
  size: '',
  quantity: 1,
  description: '',
  supplier: '',
  condition: '',
  price: 0,
  warranty: 12,
  type: '',
  purchaseDate: new Date().toISOString().split('T')[0],
});

const conditions = [
  'Novo',
  'Usado',
  'Recapado',
  'Danificado'
];



const tireTypes = [
  'Radial',
  'Diagonal',
  'Run-flat',
  'Todas as Estações'
];

function handleSubmit() {
  store.addTire({
    ...newTire.value,
    price: parseFloat(newTire.value.price),
    warranty: parseInt(newTire.value.warranty),
    quantity: parseInt(newTire.value.quantity),
  });
  
  // Reset form
  newTire.value = {
    identification: '',
    brand: '',
    model: '',
    size: '',
    quantity: 1,
    description: '',
    supplier: '',
    condition: '',
    price: 0,
    warranty: 12,
    type: '',
    purchaseDate: new Date().toISOString().split('T')[0],
  };
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Gestão de Pneu</h1>
    
    <div class="grid grid-cols-2 gap-6">
      <!-- Left Side: Add Tire Form -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Adicionar Novo Pneu</h2>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Identificação</label>
            <input
              type="text"
              v-model="newTire.identification"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Ex: PNEU001"
              required
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Marca</label>
              <input
                type="text"
                v-model="newTire.brand"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Ex: Michelin"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Modelo</label>
              <input
                type="text"
                v-model="newTire.model"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Ex: X Multi Z"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Tamanho</label>
              <input
                type="text"
                v-model="newTire.size"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Ex: 295/80 R22.5"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Quantidade</label>
              <input
                type="number"
                v-model="newTire.quantity"
                min="1"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea
              v-model="newTire.description"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Descreva as características do pneu..."
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Fornecedor</label>
              <input
                type="text"
                v-model="newTire.supplier"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Nome do fornecedor"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Condição</label>
              <select
                v-model="newTire.condition"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              >
                <option value="">Selecione a condição...</option>
                <option v-for="condition in conditions" :key="condition" :value="condition">
                  {{ condition }}
                </option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Preço</label>
              <input
                type="number"
                v-model="newTire.price"
                min="0"
                step="0.01"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Garantia (meses)</label>
              <input
                type="number"
                v-model="newTire.warranty"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Tipo</label>
              <select
                v-model="newTire.type"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              >
                <option value="">Selecione o tipo...</option>
                <option v-for="type in tireTypes" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Data de Compra</label>
              <input
                type="date"
                v-model="newTire.purchaseDate"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
          </div>

          <div class="flex justify-end space-x-3">
            <button
              type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Adicionar Pneu
            </button>
          </div>
        </form>
      </div>

      <!-- Right Side: Tires Table -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Lista de Pneus</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tamanho</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condição</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="tire in tires" :key="tire.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{{ tire.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ tire.brand }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ tire.model }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ tire.size }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ tire.condition }}
                </td>
              </tr>
              <tr v-if="tires.length === 0">
                <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                  Nenhum pneu disponível
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>