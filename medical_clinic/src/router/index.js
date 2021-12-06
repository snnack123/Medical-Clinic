import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Register from "../views/Register.vue";
import Appointment from "../views/Appointment.vue";
import Login from "../views/Login.vue";
import store from "../store";
import MyAppointments from '../views/MyAppointments.vue';
import RaportAppointments from '../views/RaportAppointments.vue';
import ChangeUserData from '../views/ChangeUserData.vue';

const routes = [{
    path: "/",
    name: "Home",
    component: Home,
},
{
    path: "/register",
    name: "Register",
    component: Register,
},
{
    path: "/login",
    name: "Login",
    component: Login,
},
{
    path: "/new_appointment",
    name: "Appointment",
    component: Appointment,
},
{
    path: "/my_appointments",
    name: "MyAppointments",
    component: MyAppointments,
},
{
    path: "/raport_appointments",
    name: "RaportAppointments",
    component: RaportAppointments,
},
{
    path: "/change_data",
    name: "ChangeUserData",
    component: ChangeUserData,
},
];


const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.name === "Register" || to.name === "Login" || to.name === "Home" ||
        to.name === "RaportAppointments") {
        next();
    } else if (to.name !== "Login" && !store.state.isAuthenticated) {
        next({ name: "Login" });
    } else {
        next();
    }
});

export default router;