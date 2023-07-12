<template>
  <DashboardLayout title="Histórico de Trocas">
    <div v-if="sortedAcceptedSwaps && sortedAcceptedSwaps.length"  class="list has-hoverable-list-items has-overflow-ellipsis">
      <div class="list-item" v-for="swap in sortedAcceptedSwaps">
        <div class="list-item-content">
          <div class="list-item-title is-flex is-justify-content-space-between">
            <span>
              {{ swap.proposing_user.name === authUserName ? 'Eu' : swap.proposing_user.name }}
              {{ '&#8594;' }}
              {{ swap.target_user.name === authUserName ? 'Eu' : swap.target_user.name }}</span>
          </div>
          <div class="list-item-description" v-if="swap.direct">
            <u>{{ swap.payment_shift_user.day_name }}. {{ swap.payment_shift_user.day }} {{ swap.payment_shift_user.month }}</u>
            <br>
            <span v-if="swap.proposing_user.name === authUserName">
              - Fazer <u><strong>{{ swap.target_shift_user.shift.description }}</strong></u> em vez de <u><strong>{{ swap.payment_shift_user.shift.description }}</strong></u>
            </span>
            <span v-else>
              - Fazer <u><strong>{{ swap.payment_shift_user.shift.description }}</strong></u> em vez de <u><strong>{{ swap.target_shift_user.shift.description }}</strong></u>
            </span>
          </div>
          <div class="list-item-description" v-else>
            <u>{{ swap.target_shift_user.day_name }}. {{ swap.target_shift_user.day }} {{ swap.target_shift_user.month }}</u>
            <br>
            <span v-if="swap.proposing_user.name === authUserName">
            - <u><strong>Folga</strong></u> em vez de <u><strong>{{ swap.target_shift_user.shift.description }}</strong></u>
            </span>
            <span v-else>
            - Fazer <u><strong>{{ swap.target_shift_user.shift.description }}</strong></u> em vez de <u><strong>Folga</strong></u>
            </span>
            <br>
            <u>{{ swap.payment_shift_user.day_name }}. {{ swap.payment_shift_user.day }} {{ swap.payment_shift_user.month }}</u>
            <br>
            <span v-if="swap.proposing_user.name === authUserName">
            - Fazer <u><strong>{{ swap.payment_shift_user.shift.description }}</strong></u> em vez de <u><strong>Folga</strong></u>
            </span>
            <span v-else>
              - <u><strong>Folga</strong></u> em vez de <u><strong>{{ swap.payment_shift_user.shift.description }}</strong></u>
            </span>
          </div>
        </div>
      </div>
    </div>
    <h1 v-else class="is-size-5">Não existem trocas aceites</h1>
  </DashboardLayout>
</template>

<script>

import axios from "axios";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import 'bulma-list/css/bulma-list.css'

export default {
  name: 'swaps-history',
  components: { DashboardLayout },
  data(){
    return {
      acceptedSwaps: [],
    }
  },
  methods: {
    parseDate(dateString){
      const [day, month, year] = dateString.split('/');
      return new Date(`${year}-${month}-${day}`);
    },
  },
  computed: {
    authUserName(){
      return this.$store.getters.authUser.name
    },
    sortedAcceptedSwaps(){
      if(!this.acceptedSwaps || !this.acceptedSwaps.length)
        return []

      return this.acceptedSwaps.sort((a,b) => {
        return this.parseDate(b.target_shift_user.date) - this.parseDate(a.target_shift_user.date);
      })
    }
  },
  mounted(){
    axios.get('swaps/history')
        .then(response => {
          this.acceptedSwaps = response.data.data
        })
        .catch(error => {
          console.log(error)
        })
  }
}
</script>
