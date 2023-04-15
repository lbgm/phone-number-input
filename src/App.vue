<script setup lang="ts">
import { ref, type Ref } from "vue";

import PhoneInput from "@/components/phone-number-input.vue";
import type { PhoneDATA } from "./components/parts/types";

const phone: Ref<string> = ref("");
const country: Ref<string> = ref("");
const phoneData: Ref<PhoneDATA> = ref({});
</script>

<template>
  {{ phone }} - {{ country }} - {{ phoneData }}
  <!-- app -->
  <div class="w-64 m-auto mt-10 flex flex-col">
    <phone-input
      @phone="phone = $event"
      @country="country = $event"
      @phoneData="phoneData = $event"
      name="cphone"
      label="Entrer votre téléphone"
      required
      :allowed="[]"
      :value="'22995318207'"
    />
  </div>
</template>

<style scoped></style>
