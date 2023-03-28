import { createStore } from 'vuex';

import axios from 'axios';

export default createStore({
    state: {
        user: null,
        services: [],
        totalServices: 0,
        users: []
    },
    mutations: {
        /**
         * User mutations
         * @param state
         */
        resetUser (state) {
            state.user = null
        },
        setUser (state, loggedInUser) {
            state.user = loggedInUser
        },
        /**
         * Services mutations
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
        }
    },
    getters: {
        services: (state) => state.services,
        totalServices: (state) => state.totalServices
    },
    actions: {
        /**
         * Authentication
         * @param context
         * @param credentials
         * @returns {Promise<void>}
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
            await userPromise
        },

        /**
         * Services
         */
        async loadServices (context, params) {
            try {
                let response = await axios.get('/services', {
                    params
                })
                context.commit('setServices', response.data.data)
                context.commit('setTotalServices', response.data.total)
                return response.data.data
            } catch (error) {
                context.commit('resetServices', null)
                throw error
            }
        }
    }
})
