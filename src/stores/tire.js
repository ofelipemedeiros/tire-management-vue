import { defineStore } from 'pinia';

export const useTireStore = defineStore('tire', {
  state: () => ({
    vehicles: [],
    tires: [],
    historicoUso: [],
    maintenanceRecords: [],
  }),
  
  getters: {
    getTiresByVehicle: (state) => (vehicleId) => {
      return state.tires.filter(tire => tire.vehicleId === vehicleId);
    },
    getVehicleById: (state) => (id) => {
      return state.vehicles.find(vehicle => vehicle.id === id);
    },
    getTireMaintenanceHistory: (state) => (tireId) => {
      return state.maintenanceRecords.filter(record => record.tireId === tireId);
    },
  },
  
  actions: {
    installTireOnVehicle(tireId, vehicleId, plate, kmInicio, name, position){
      const tire = this.tires.find(t => t.id === tireId);
      if(tire){
        //criar historico se não existir
        if(!tire.histocoUso) tire.historicoUso = [];
        tire.historicoUso.push({
          veiculoId: vehicleId,
          'Placa do Veículo': plate,
          'Nome do Veículo': name,
          'Data de Instalação': new Date().toLocaleString('pt-BR', {timeZone: 'America/Sao_Paulo'}),
          'Km inicial':kmInicio,
          kmFim:null,
          position
        });
        tire.vehicleId = vehicleId;
        console.log(tire);
        

      }

    },

    removeTireFromVehicle(tireId, kmFim){
      const tire = this.tires.find(t => t.id === tireId);
      if(tire && tire.historicoUso && tire.historicoUso.length > 0){
        const lastUsage = tire.historicoUso[tire.historicoUso.length - 1];
      if(!lastUsage.dataFim){
        lastUsage.dataFim = new Date().toISOString();
        lastUsage.kmFim = kmFim;
      }
      //pneu não está mais em nenhum veículo
      tire.vehicleId = null;
    }
  },


    addVehicle(vehicle) {
      this.vehicles.push({
        id: Date.now().toString(),
        ...vehicle,
        createdAt: new Date().toISOString(),
      });
    },
    
    addTire(tire) {
      this.tires.push({
        id: Date.now().toString(),
        ...tire,
        createdAt: new Date().toISOString(),
        mileage: 0,
        status: 'new',
      });
    },
    
    recordMaintenance(record) {
      this.maintenanceRecords.push({
        id: Date.now().toString(),
        ...record,
        date: new Date().toISOString(),
      });
    },
    
    updateTireMileage(tireId, mileage) {
      const tire = this.tires.find(t => t.id === tireId);
      if (tire) {
        tire.mileage = mileage;
        this.updateTireStatus(tire);
      }
    },
    
    updateTireStatus(tire) {
      // Lógica simples para status do pneu baseado na quilometragem
      if (tire.mileage > 50000) {
        tire.status = 'critical';
      } else if (tire.mileage > 30000) {
        tire.status = 'warning';
      } else {
        tire.status = 'good';
      }
    },
  },
});