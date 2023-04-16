<script setup lang="ts">
import { ref, type Ref } from "vue";

import PhoneInput from "@/components/phone-number-input.vue";
import type { PhoneDATA } from "./components/parts/types";

const phone: Ref<string> = ref("");
const country: Ref<string> = ref("");
const phoneData: Ref<PhoneDATA> = ref({});
</script>

<template>
  <!-- app -->
  <div class="w-64 m-auto mt-10 pb-80 flex flex-col">
    <span class="text-xs leading-4">
      {{ phone }} - {{ country }} - {{ phoneData }}
    </span>
    <!-- component -->
    <phone-input
      @phone="phone = $event"
      @country="country = $event"
      @phoneData="phoneData = $event"
      name="phone-number-input"
      label="Enter your phone"
      required
      :value="'22997788842'"
    />
  </div>
</template>

<style scoped></style>
