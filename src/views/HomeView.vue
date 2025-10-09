<template>
    <v-container fluid>
        <metric-cards 
            compact
            palette="gradient"
            :passengers="12840"
            :drivers="512"
            :trips-done="34210"
            :trips-canceled="1760"
            :passengers-target="15000"
            :drivers-target="600"
            passengers-color="primary"
            drivers-color="info"
            done-color="success"
            canceled-color="error"
            :duration-ms="1400"    
        
        />
    </v-container>
</template>


<script setup>

import MetricCards from '@/components/MetricCards.vue'

</script>