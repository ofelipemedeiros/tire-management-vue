<script setup>
import { ref, computed } from 'vue';
import { useTireStore } from '../stores/tire';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';
import Draggable from 'vuedraggable';

const store = useTireStore();
const tires = ref(store.tires);
const selectedVehicle = ref(null);
const isModalOpen = ref(false);
const draggedTire = ref(null);
const searchQuery = ref('');

// New refs for tire selection
const showTireSelectionModal = ref(false);
const selectedTireIds = ref(new Set());
const selectedTires = ref([]); // <-- ADICIONADO: lista de pneus selecionados

const vehicles = computed(() => store.vehicles);

// Get tires for the selected vehicle
const vehicleTires = computed(() => {
  if (!selectedVehicle.value) return [];
  return store.getTiresByVehicle(selectedVehicle.value.id);
});

// Unassigned tires (tires without a position ou vehicle)
const unassignedTires = computed(() => {
  return tires.value.filter(tire => !tire.position || !tire.vehicleId);
});

// Available tires for selection (tires that aren't assigned to any vehicle)
const availableTires = computed(() => {
  return store.tires.filter(tire => !tire.vehicleId);
});

// Filtered tires based on search query
const filteredTires = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return availableTires.value.filter(tire => 
    tire.identification?.toLowerCase().includes(query) ||
    tire.brand?.toLowerCase().includes(query) ||
    tire.model?.toLowerCase().includes(query) ||
    tire.size?.toLowerCase().includes(query)
  );
});

// A lista exibida na tabela principal agora será os pneus selecionados
const displayedTires = computed(() => selectedTires.value);

// Status color mapping
const statusColors = {
  new: 'bg-green-100 text-green-800',
  good: 'bg-blue-100 text-blue-800',
  warning: 'bg-yellow-100 text-yellow-800',
  critical: 'bg-red-100 text-red-800'
};

const statusTranslations = {
  new: 'Novo',
  good: 'Bom',
  warning: 'Atenção',
  critical: 'Crítico'
};

function getStatusClass(status) {
  return statusColors[status] || 'bg-gray-100 text-gray-800';
}

function getStatusText(status) {
  return statusTranslations[status] || status;
}

// Dynamic tire layout based on number of axles
const tireLayout = computed(() => {
  if (!selectedVehicle.value) return [];
  
  const axles = selectedVehicle.value.axles;
  let layout = [
    // Front axle (always present)
    { position: 'DE', x: 100, y: 50 },
    { position: 'DD', x: 300, y: 50 },
  ];
  
  if (axles === 2) {
    // Veículo de passeio: apenas um pneu em cada ponta no eixo traseiro, alinhados com o eixo
    layout.push(
      { position: 'TE', x: 100, y: 250 }, // Traseiro Esquerdo (alinhado)
      { position: 'TD', x: 300, y: 250 }  // Traseiro Direito (alinhado)
    );
  } else {
    // Caminhões/ônibus: layout duplo nos eixos traseiros
    for (let i = 1; i <= axles - 1; i++) {
      const yPosition = 150 + (i * 100);
      layout.push(
        { position: `${i}EE`, x: 50, y: yPosition },
        { position: `${i}EI`, x: 100, y: yPosition },
        { position: `${i}DI`, x: 300, y: yPosition },
        { position: `${i}DE`, x: 350, y: yPosition },
      );
    }
  }
  
  return layout;
});

// Dynamic chassis lines based on number of axles
const chassisLines = computed(() => {
  if (!selectedVehicle.value) return [];
  
  const axles = selectedVehicle.value.axles;
  let lines = [
    // Front axle line (always present)
    { x: 100, y: 50, width: 200, height: 1 },
    // Vertical line
    { x: 200, y: 50, width: 1, height: (axles === 2 ? 200 : (axles - 1) * 100 + 100) },
  ];
  
  // Linha do eixo traseiro
  if (axles === 2) {
    // Só um eixo traseiro, alinhar em y: 250
    lines.push({ x: 100, y: 250, width: 200, height: 1 });
  } else {
    // Caminhões/ônibus: linhas horizontais para cada eixo traseiro
    for (let i = 1; i <= axles - 1; i++) {
      const yPosition = 150 + (i * 100);
      lines.push({ x: 100, y: yPosition, width: 200, height: 1 });
    }
  }
  
  return lines;
});

function getTireColor(position) {
  if (!selectedVehicle.value) return 'bg-gray-300';
  
  const tire = vehicleTires.value.find(t => t.position === position);
  if (!tire) return 'bg-gray-300';

  const depth = tire.depth || 0;
  if (depth > 24) return 'bg-green-500';
  if (depth > 20) return 'bg-blue-500';
  if (depth > 15) return 'bg-yellow-400';
  if (depth > 10) return 'bg-pink-400';
  return 'bg-red-500';
}

function handleTireClick(position) {
  newTire.value.position = position;
  newTire.value.vehicleId = selectedVehicle.value?.id;
  isModalOpen.value = true;
}

function handleDragStart(event, tire) {
  draggedTire.value = tire;
  
  // Create drag image
  const dragImage = document.createElement('div');
  dragImage.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-8 h-8">
      <circle cx="12" cy="12" r="10" fill="#4B5563" stroke="#374151" stroke-width="2"/>
      <circle cx="12" cy="12" r="3" fill="#9CA3AF"/>
      <path d="M12 6V4M12 20v-2M6 12H4m16 0h-2" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;
  dragImage.style.position = 'absolute';
  dragImage.style.top = '-1000px';
  document.body.appendChild(dragImage);

  // Set the drag image
  event.dataTransfer.setDragImage(dragImage, 16, 16);
  
  // Clean up the temporary element after drag starts
  setTimeout(() => document.body.removeChild(dragImage), 0);
}

function handleDrop(position) {
  // if (draggedTire.value && selectedVehicle.value) {
  //   const updatedTire = {
  //     ...draggedTire.value,
  //     position: position,
  //     vehicleId: selectedVehicle.value.id
  //   };
    
  //   // Update the tire in the store
  //   const tireIndex = tires.value.findIndex(t => t.id === draggedTire.value.id);
  //   if (tireIndex !== -1) {
  //     tires.value[tireIndex] = updatedTire;
  //   }
    
  //   draggedTire.value = null;
  // }

  if(draggedTire.value && selectedVehicle.value){
    store.installTireOnVehicle(
      draggedTire.value.id,
      selectedVehicle.value.id,
      selectedVehicle.value.plate,
      selectedVehicle.value.kmInicio,
      selectedVehicle.value.name,
      position
    )
    console.log('Pneu instalado',draggedTire.value);
    console.log('veículo', selectedVehicle.value);
    
    
    


  }
}

function handleDragOver(event) {
  event.preventDefault();
}

function selectTires() {
  // Adiciona os pneus selecionados na lista selectedTires, sem duplicar
  selectedTireIds.value.forEach(id => {
    const tire = store.tires.find(t => t.id === id);
    if (tire && !selectedTires.value.find(t => t.id === id)) {
      selectedTires.value.push(tire);
    }
  });
  // Limpa seleção e fecha modal
  selectedTireIds.value.clear();
  showTireSelectionModal.value = false;
}

// Função para remover pneu da lista selecionada e limpar dos slots
function removeTireFromSelected(id) {
  // Remove da lista de selecionados
  selectedTires.value = selectedTires.value.filter(tire => tire.id !== id);
  // Limpa o slot do eixo se o pneu estiver alocado
  const tire = store.tires.find(t => t.id === id);
  if (tire) {
    tire.position = null;
    tire.vehicleId = null;
  }
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Gestão de Pneus</h1>
    
    <!-- Vehicle Selection -->
    <div class="mb-6">
      <label for="vehicle-select" class="block text-sm font-medium text-gray-700">Selecionar Veículo</label>
      <select
        id="vehicle-select"
        v-model="selectedVehicle"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      >
        <option :value="null">Selecione um veículo...</option>
        <option v-for="vehicle in vehicles" :key="vehicle.id" :value="vehicle">
          {{ vehicle.name }}
        </option>
      </select>
    </div>

    <div class="grid grid-cols-2 gap-6">
      <!-- Left Side: Tires Table -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">Lista de Pneus</h2>
          <button
            @click="showTireSelectionModal = true"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Selecionar Pneu
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quilometragem</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Veículo</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr 
                v-for="tire in displayedTires" 
                :key="tire.id"
                draggable="true"
                @dragstart="(e) => handleDragStart(e, tire)"
                class="cursor-move hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                  <svg class="w-7 h-7 mr-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2"/>
                    <circle cx="12" cy="12" r="3" fill="currentColor"/>
                    <path d="M12 6V4M12 20v-2M6 12H4m16 0h-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  #{{ tire.id }}
                  <button @click="removeTireFromSelected(tire.id)" class="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs">Remover</button>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span :class="['px-2 py-1 rounded-full text-xs font-medium', getStatusClass(tire.status)]">
                    {{ getStatusText(tire.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ tire.mileage }} km
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ store.getVehicleById(tire.vehicleId)?.name || 'N/A' }}
                </td>
              </tr>
              <tr v-if="displayedTires.length === 0">
                <td colspan="4" class="px-6 py-4 text-center text-gray-500">
                  Nenhum pneu disponível
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Right Side: Vehicle Axle Visualization -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Visualização dos Eixos</h2>
        <div v-if="!selectedVehicle" class="text-center text-gray-500 py-20">
          Selecione um veículo para ver a configuração dos eixos
        </div>
        <div 
          v-else 
          class="relative w-[500px] h-[600px] bg-gray-100 border rounded-lg p-4"
        >
          <!-- Chassis Lines -->
          <div
            v-for="(line, index) in chassisLines"
            :key="index"
            class="absolute bg-black"
            :style="{
              left: `${line.x}px`,
              top: `${line.y}px`,
              width: `${line.width}px`,
              height: `${line.height}px`,
            }"
          />

          <!-- Tire Positions -->
          <div
            v-for="(tire, index) in tireLayout"
            :key="index"
            class="absolute w-12 h-12 rounded-md flex items-center justify-center cursor-pointer shadow-md"
            :style="{
              left: `${tire.x}px`,
              top: `${tire.y}px`,
              transform: 'translate(-50%, -50%)',
            }"
            :class="[getTireColor(tire.position)]"
            @dragover="handleDragOver"
            @drop="handleDrop(tire.position)"
          >
            <span class="text-xs font-semibold text-white">{{ tire.position }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tire Selection Modal -->
    <Dialog
      as="div"
      class="relative z-10"
      @close="showTireSelectionModal = false"
      :open="showTireSelectionModal"
    >
      <div class="fixed inset-0 bg-black bg-opacity-25" />

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <DialogPanel class="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
            <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 mb-4">
              Selecionar Pneus
            </DialogTitle>

            <!-- Search Filter -->
            <div class="mb-4">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Pesquisar pneus..."
                class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Tires Table -->
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        :checked="filteredTires.length > 0 && selectedTireIds.size === filteredTires.length"
                        @change="e => {
                          if (e.target.checked) {
                            filteredTires.forEach(tire => selectedTireIds.add(tire.id));
                          } else {
                            selectedTireIds.clear();
                          }
                        }"
                        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tamanho</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condição</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="tire in filteredTires" :key="tire.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        :checked="selectedTireIds.has(tire.id)"
                        @change="e => {
                          if (e.target.checked) {
                            selectedTireIds.add(tire.id);
                          } else {
                            selectedTireIds.delete(tire.id);
                          }
                        }"
                        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {{ tire.identification }}
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
                  <tr v-if="filteredTires.length === 0">
                    <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                      Nenhum pneu disponível
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                @click="showTireSelectionModal = false"
              >
                Cancelar
              </button>
              <button
                type="button"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                @click="selectTires"
                :disabled="selectedTireIds.size === 0"
              >
                Selecionar {{ selectedTireIds.size }} pneu(s)
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  </div>
</template>