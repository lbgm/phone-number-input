<script setup lang="ts">
import { ref } from "vue";

import PhoneInput from "@/components/phone-number-input.vue";

const phone = ref("");
const country = ref("");
const phoneData = ref({});
</script>

<template>
  {{ phone }} <br />
  {{ country }} <br />
  {{ phoneData }}
  <!-- app -->
  <div class="w-[300px] m-auto mt-10 flex flex-col">
    <phone-input
      @phone="phone = $event"
      @country="country = $event"
      @phoneData="phoneData = $event"
      name="cphone"
      label="Entrer votre téléphone"
      required
      :allowed="['BJ', 'CI']"
      :value="'22995318207'"
    />
  </div>
</template>

<style scoped></style>
