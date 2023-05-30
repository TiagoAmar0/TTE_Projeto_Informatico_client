<template>
  <DashboardLayout title="Histórico de Trocas">
    <div v-if="sorted_accepted_swaps && sorted_accepted_swaps.length"  class="list has-hoverable-list-items has-overflow-ellipsis">
      <div class="list-item" v-for="swap in sorted_accepted_swaps">
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
              - Fazer <u><strong>{{ swap.payment_shift_user.shift.description }}</strong></u> em vez de <u><strong>{{ swap.target_shift_user.shift.description }}</strong></u>
            </span>
            <span v-else>
              - Fazer <u><strong>{{ swap.target_shift_user.shift.description }}</strong></u> em vez de <u><strong>{{ swap.payment_shift_user.shift.description }}</strong></u>
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
      accepted_swaps: [],
    }
  },
  methods: {
    parseDate(date_string){
      const [day, month, year] = date_string.split('/');
      return new Date(`${year}-${month}-${day}`);
    },
  },
  computed: {
    authUserName(){
      return this.$store.getters.authUser.name
    },
    sorted_accepted_swaps(){
      if(!this.accepted_swaps || !this.accepted_swaps.length)
        return []

      return this.accepted_swaps.sort((a,b) => {
        return this.parseDate(b.target_shift_user.date) - this.parseDate(a.target_shift_user.date);
      })
    }
  },
  mounted(){
    axios.get('swaps/history')
        .then(response => {
          this.accepted_swaps = response.data.data
        })
        .catch(error => {
          console.log(error)
        })
  }
}
</script>
