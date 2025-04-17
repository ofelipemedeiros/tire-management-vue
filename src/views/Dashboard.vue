<script setup>
import { ref, onMounted, computed } from 'vue';
import { useTireStore } from '../stores/tire';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const store = useTireStore();

const statistics = ref({
  totalVehicles: 0,
  totalTires: 0,
  tiresNeedingMaintenance: 0,
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1
      }
    }
  }
};

const chartData = computed(() => ({
  labels: ['Bom', 'Atenção', 'Crítico'],
  datasets: [{
    label: 'Distribuição do Estado dos Pneus',
    data: [
      store.tires.filter(t => t.status === 'good').length,
      store.tires.filter(t => t.status === 'warning').length,
      store.tires.filter(t => t.status === 'critical').length
    ],
    backgroundColor: ['#10B981', '#F59E0B', '#EF4444']
  }]
}));

onMounted(() => {
  updateStatistics();
});

function updateStatistics() {
  statistics.value = {
    totalVehicles: store.vehicles.length,
    totalTires: store.tires.length,
    tiresNeedingMaintenance: store.tires.filter(t => t.status === 'warning' || t.status === 'critical').length
  };
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Painel</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-700">Total de Veículos</h3>
        <p class="text-3xl font-bold text-blue-600">{{ statistics.totalVehicles }}</p>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-700">Total de Pneus</h3>
        <p class="text-3xl font-bold text-green-600">{{ statistics.totalTires }}</p>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-700">Necessita Manutenção</h3>
        <p class="text-3xl font-bold text-red-600">{{ statistics.tiresNeedingMaintenance }}</p>
      </div>
    </div>
    
    
  </div>
</template>