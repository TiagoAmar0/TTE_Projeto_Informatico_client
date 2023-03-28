import { createStore } from 'vuex';

import axios from 'axios';

export default createStore({
    state: {
        user: null,
        services: [],
        totalServices: 0,
        users: [],
        totalUsers: 0
    },
    mutations: {
        /**
         * Auth User
         */
        resetUser (state) {
            state.user = null
        },
        setUser (state, loggedInUser) {
            state.user = loggedInUser
        },
        /**
         * Services
         */
        setServices (state, services){
            state.services = services
        },
        setTotalServices(state, total){
          state.totalServices = total
        },
        resetServices(state){
            state.services = []
            state.totalServices = 0
        },
        deleteService (state, service) {
            let idx = state.services.findIndex((s) => s.id === service.id)
            if (idx >= 0) {
                state.services.splice(idx, 1)
            }

            state.totalServices = state.services.length
        },
        /**
         * Users
         *
         */
        setUsers(state, users){
            state.users = users
        },
        setTotalUsers(state, total){
            state.totalUsers = total
        },
        resetUsers(state){
            state.users = []
            state.totalUsers = 0
        }
    },
    getters: {
        /**
         * Services
         */
        services: (state) => {
            return state.services
        },
        servicesTotal: (state) => state.totalServices,
        serviceById: (state) => (id) => {
            return state.services.find(s => s.id === id)
        },

        /**
         * Users
         */
        usersWithoutService: (state) => state.users.filter(u => u.service === null && u.type !== 'admin')
    },
    actions: {
        /**
         * Authentication
         */
        async login(context, credentials){
            try {
                let response = await axios.post('/login', credentials)
                axios.defaults.headers.common.Authorization = 'Bearer ' + response.data.token
                sessionStorage.setItem('token', response.data.token)

            } catch(error) {
                delete axios.defaults.headers.common.Authorization
                sessionStorage.removeItem('token')
                context.commit('resetUser', null)
                throw error
            }
            await context.dispatch('refresh')
        },
        async logout (context) {
            try {
                await axios.delete('/logout')
            }
            finally {
                delete axios.defaults.headers.common.Authorization
                sessionStorage.removeItem('token')
                context.commit('resetUser', null)
            }
        },
        async restoreToken (context) {
            let storedToken = sessionStorage.getItem('token')
            if (storedToken) {
                axios.defaults.headers.common.Authorization = "Bearer " + storedToken
                return storedToken
            }
            delete axios.defaults.headers.common.Authorization
            context.commit('resetUser', null)
            return null
        },
        async loadLoggedInUser (context) {
            try {
                let response = await axios.get('/me')
                context.commit('setUser', response.data.data)
            } catch (error) {
                delete axios.defaults.headers.common.Authorization
                context.commit('resetUser', null)
                throw error
            }
        },
        async refresh (context) {
            let userPromise = context.dispatch('loadLoggedInUser')
            let servicesPromise = context.dispatch('loadServices')
            let usersPromise = context.dispatch('loadUsers')

            await userPromise
            await servicesPromise
            await usersPromise
        },

        /**
         * Services
         */
        async loadServices (context) {
            try {
                let response = await axios.get('/services')
                context.commit('setServices', response.data.data)
                context.commit('setTotalServices', response.data.data.length)
                return response.data.data
            } catch (error) {
                context.commit('resetServices', null)
                throw error
            }
        },
        async deleteService (context, service) {
            try{
                let response = await axios.delete("services/" + service.id)
                context.commit('deleteService', response.data.data)
                return response.data.data
            } catch (error){
                throw error
            }
        },


        /**
         * Users
         */
        async loadUsers(context) {
            try {
                let response = await axios.get('/users')
                context.commit('setUsers', response.data.data)
                context.commit('setTotalUsers', response.data.data.length)
                return response.data.data
            } catch (error) {
                context.commit('resetUsers', null)
                throw error
            }
        }
    }
})
