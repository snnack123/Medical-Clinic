import { createStore } from "vuex";

export default createStore({
    state: {
        isAuthenticated: false,
        client: {},
        doctors: [],
        my_doctor: {},
        all_appointments: {},
    },
    mutations: {
        SET_AUTH: (state, status) => {
            state.isAuthenticated = status;
        },
        CHECK_AUTHENTICATED: (state) => {
            if (window.localStorage.getItem("token")) {
                state.isAuthenticated = true;
            }
        },
        SET_EMAIL: (state, status) => {
            state.client.email = status;
        },
        SET_CLIENT: (state, status) => {
            state.client.name = status.name;
            state.client.phone = status.phone;
            state.client.yearsOld = status.yearsOld;
        },
        SET_DOCTORS: (state, status) => {
            state.doctors = status;
        },
        SET_MY_DOCTOR: (state, status) => {
            state.my_doctor.name = status.name;
            state.my_doctor.specialization = status.specialization;
        },
        SET_ALL_APPOINTMENTS: (state, status) => {
            while (state.all_appointments.length) state.all_appointments.pop();
            state.all_appointments = status;
        },
    },
    actions: {
        login: ({ commit }, payload) => {
            commit("SET_AUTH", payload);
        },
        checkAuthenticated: ({ commit }) => {
            commit("CHECK_AUTHENTICATED");
        },
        setEmailClient: ({ commit }, payload) => {
            commit("SET_EMAIL", payload);
        },
        setClient: ({ commit }, payload) => {
            commit("SET_CLIENT", payload);
        },
        setDoctors: ({ commit }, payload) => {
            commit("SET_DOCTORS", payload);
        },
        setMyDoctor: ({ commit }, payload) => {
            commit("SET_MY_DOCTOR", payload);
        },
        setAllAppointments: ({ commit }, payload) => {
            commit("SET_ALL_APPOINTMENTS", payload);
        },
    },
    modules: {},
});