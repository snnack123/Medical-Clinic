import { createStore } from "vuex";

export default createStore({
    state: {
        isAuthenticated: false,
        client: {},
        doctors: [],
        my_doctor: {},
        all_appointments: [],
        all_appointments_without_token: [],
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
            state.client.id = status.id;
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
        SET_ALL_APPOINTMENTS_WITHOUT_TOKEN: (state, status) => {
            while (state.all_appointments_without_token.length) state.all_appointments.pop();
            state.all_appointments_without_token = status;
        },
        ADD_APPOINTMENT: (state, status) => {
            state.all_appointments.push(status);
        },
        DELETE_APPOINTMENT: (state, status) => {
            state.all_appointments = state.all_appointments.filter(element => element.status !== status);
        },
        CLEAR_ALL: (state) => {
            state.isAuthenticated = false;
            for (const prop of Object.getOwnPropertyNames(state.client)) {
                delete state.client[prop];
            }
            for (const prop of Object.getOwnPropertyNames(state.my_doctor)) {
                delete state.client[prop];
            }
            while (state.doctors.length) state.doctors.pop();
            while (state.all_appointments.length) state.all_appointments.pop();
        },
        CLEAR_APP_WITHOUT_TOKEN: (state) => {
            while (state.all_appointments_without_token.length) state.all_appointments_without_token.pop();
        },
        EDIT_APPOINTMENT: (state, status) => {
            for (let i = 0; i < state.all_appointments.length; i++) {
                if (state.all_appointments[i].id === status.id) {
                    state.all_appointments[i].price = status.price;
                }
            }
        },
        EDIT_CLIENT: (state, status) => {
            if (state.client.yearsOld !== status.yearsOld) {
                state.client.yearsOld = status.yearsOld;
            }
            if (state.client.phone !== status.yearsOld) {
                state.client.phone = status.phone;
            }
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
        setAllAppointmentsWithoutToken: ({ commit }, payload) => {
            commit("SET_ALL_APPOINTMENTS_WITHOUT_TOKEN", payload);
        },
        addAppointment: ({ commit }, payload) => {
            commit("ADD_APPOINTMENT", payload);
        },
        deleteAppointment: ({ commit }, payload) => {
            commit('DELETE_APPOINTMENT', payload);
        },
        clearAll: ({ commit }) => {
            commit('CLEAR_ALL');
        },
        clearAllAppointmentsWithoutToken: ({ commit }) => {
            commit('CLEAR_APP_WITHOUT_TOKEN');
        },
        editAppointment: ({ commit }, payload) => {
            commit('EDIT_APPOINTMENT', payload);
        },
        editClient: ({ commit }, payload) => {
            commit('EDIT_CLIENT', payload);
        },
    },
    modules: {},
});