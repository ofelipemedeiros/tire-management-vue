import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Vehicles from '../views/Vehicles.vue';
import Tires from '../views/Tires.vue';
import TireManagement from '../views/TireManagement.vue';
import Maintenance from '../views/Maintenance.vue';
import Reports from '../views/Reports.vue';

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/vehicles',
    name: 'Vehicles',
    component: Vehicles,
  },
  {
    path: '/tires',
    name: 'Tires',
    component: Tires,
  },
  {
    path: '/tire-management',
    name: 'TireManagement',
    component: TireManagement,
  },
  {
    path: '/maintenance',
    name: 'Maintenance',
    component: Maintenance,
  },
  {
    path: '/reports',
    name: 'Reports',
    component: Reports,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;