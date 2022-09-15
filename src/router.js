import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import LogIn from "./components/LogIn.vue";
import PrincipalPage from "./components/PrincipalPage.vue";
import Perfil from "./components/Perfil.vue";
import Cajas from "./components/Cajas.vue";
import Gastos from "./components/Gastos.vue";
import Deudas from "./components/Deudas.vue";
import Totales from "./components/Totales.vue";

const routes = [
  {
    path: '/',
    name: 'root',
    component: App
  },
  {
    path: "/login",
    name: "LogIn",
    component: LogIn,
  },
  {
    path: "/PrincipalPage",
    name: "PrincipalPage",
    component: PrincipalPage,
    props: true,
  },
  {
    path: "/Perfil",
    name: "Perfil",
    component: Perfil,
    props: true,
  },
  {
    path: "/Cajas",
    name: "Cajas",
    component: Cajas,
    props: true,
  },
  {
    path: "/Gastos",
    name: "Gastos",
    component: Gastos,
    props: true,
  },
  {
    path: "/Deudas",
    name: "Deudas",
    component: Deudas,
    props: true,
  },
  {
    path: "/Totales",
    name: "Totales",
    component: Totales,
    props: true,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
