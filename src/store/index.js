import { createStore } from 'vuex';

import axios from 'axios';

export default createStore({
    state: {
        user: null,
        services: [],
        totalServices: 0,
        users: [],
        totalUsers: 0,
        swapsProposedToUser: [],
        swapsProposedByUser: []
    },
    mutations: {
        /**
         * Auth User
         */
        resetUser (state) {
            state.swapsProposedByUser = []
            state.swapsProposedToUser = []
        },
        setUser (state, loggedInUser) {
            state.user = loggedInUser
        },
        /**
         * Swaps
         */
        setSwapsProposedByUser(state, swaps){
           state.swapsProposedByUser  = swaps ? swaps : []
        },
        setSwapsProposedToUser(state, swaps){
            state.swapsProposedToUser  = swaps ? swaps : []
        },
        /**
         * Services
         */
        setServices (state, services){
            state.services = services
        },
        addService(state, service){
            state.services.push(service)
            state.services = state.services.sort((a, b) => a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1)
            this.state.totalServices++;
        },
        updateService(state, service){
            let idx = state.services.findIndex((s) => s.id === service.id)
            state.services[idx] = service
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

            state.totalServices--
        },
        updateUserAndService (state, data){
            // update user
            let idx = state.users.findIndex(u => u.id === data.user.id)
            state.users[idx] = data.user

            // update service
            idx = state.services.findIndex((s) => s.id === data.service)
            state.services[idx] = data.service
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
        },
        deleteUser (state, user) {
            let idx = state.users.findIndex((u) => u.id === user.id)
            if (idx >= 0) {
                state.users.splice(idx, 1)
            }

            state.totalUsers--
        },
        updateUser(state, user){
            let idx = state.users.findIndex((u) => u.id === user.id)
            state.users[idx] = user
        },
        addUser(state, user){
            state.users.push(user)
            state.users = state.users.sort((a, b) => a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1)
            this.state.totalUsers++;
        },
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
        swapsProposedByUser: (state) => state.swapsProposedByUser,
        swapsProposedToUser: (state) => state.swapsProposedToUser,
        pendingSwapsProposedToUser: (state) => state.swapsProposedToUser.reduce((acc, swap) => swap.status === "Pendente" ? acc + 1 : acc, 0),
        pendingSwapsProposedByUser: (state) => state.swapsProposedByUser.reduce((acc, swap) => swap.status === "Pendente" ? acc + 1 : acc, 0),
        authUser: (state) => state.user,
        authUserType: (state) => state.user.type,
        users: (state) => state.users,
        usersTotal: (state) => state.totalUsers,
        usersWithoutService: (state) => state.users.filter(u => u.service === null && u.type !== 'admin')
    },
    actions: {
        /**
         * Authentication
         */
        async login(context, credentials){
            try {
                let response = await axios.post('/login', credentials)
                axios.defaults.headers.common.Authorization = "Bearer " + response.data.access_token
                sessionStorage.setItem('token', response.data.access_token)

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
        async loadSwapsProposedByUser(context){
            let response = await axios.get('/swaps/user-proposed')
            context.commit('setSwapsProposedByUser', response.data.data)
        },
        async loadSwapsProposedToUser(context){
            let response = await axios.get('/swaps/proposed-to-user')
            context.commit('setSwapsProposedToUser', response.data.data)
        },
        async refresh (context) {
            await context.dispatch('loadLoggedInUser')

            if(context.state.user.type !== 'admin'){
                let swapsProposedByUserPromise = context.dispatch('loadSwapsProposedByUser')
                let swapsProposedToUserPromise = context.dispatch('loadSwapsProposedToUser')

                await swapsProposedByUserPromise
                await swapsProposedToUserPromise
            }

            if(context.state.user.type === 'admin') {
                let servicesPromise = context.dispatch('loadServices')
                let usersPromise = context.dispatch('loadUsers')

                await servicesPromise
                await usersPromise
            }
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
        async storeService (context, payload) {
            try{
                let response = await axios.post("/services", payload)
                context.commit('addService', response.data.data)
                return response.data.data
            } catch (error){
                throw error
            }
        },
        async updateService (context, service) {
            try{
                let response = await axios.put("/services/" + service.id, service)
                context.commit('updateService', response.data.data)
                return response.data.data
            } catch (error){
                throw error
            }
        },
        async associateUserToService(context, params){
            try{
                let response = await axios.put("/services/" + params.service + '/users/' + params.user)
                context.commit('updateUserAndService', response.data.data)
                return response.data
            } catch (error){
                throw error
            }
        },
        async disassociateUserToService(context, params){
            try{
                let response = await axios.delete("/services/" + params.service + '/users/' + params.user)
                context.commit('updateUserAndService', { user: response.data.data, service: params.service })
                return response.data
            } catch (error){
                return { status: error.statusCode, message: error.response.data.message }
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
        },
        async deleteUser (context, user) {
            try{
                let response = await axios.delete("users/" + user.id)
                context.commit('deleteUser', response.data.data)
                return response.data.data
            } catch (error){
                throw error
            }
        },
        async updateUser (context, user) {
            try{
                let response = await axios.put("/users/" + user.id, user)
                context.commit('updateUser', response.data.data)
                return response.data.data
            } catch (error){
                throw error
            }
        },
        async storeUser (context, payload) {
            try{
                let response = await axios.post("/users", payload)
                context.commit('addUser', response.data.data)
                return response.data.data
            } catch (error){
                throw error
            }
        },
    }
})
