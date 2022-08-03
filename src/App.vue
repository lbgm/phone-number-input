<script setup lang="ts">
import { ref } from "vue";
import PhoneInput from "@/components/phone-number-input.vue";
import PhoneInputVee from "@/components/phone-number-input-vee.vue";
import { Form } from "vee-validate";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
      dingovee: Yup.string().required('ce champ est requis'),
});

const onInvalidSubmit = (event: any) => {
  console.log(event)
}

const phone = ref("");
const country = ref("");
const phoneData = ref({});
</script>

<template>
  {{ phone }} <br />
  {{ country }} <br />
  {{ phoneData }}
  <!-- app -->
  <div class="w-5/12 m-auto mt-10 flex flex-col">
    <phone-input
      @phone="phone = $event"
      @country="country = $event"
      @phoneData="phoneData = $event"
      name="dingo"
      label="Entrer votre téléphone"
      required
      :allowed="[]"
    />
    <!---->
    <Form
      :validation-schema="validationSchema"
      @invalid-submit="onInvalidSubmit"
      @submit="void 0"
    >
    <phone-input-vee
      @phone="phone = $event"
      @country="country = $event"
      @phoneData="phoneData = $event"
      name="dingovee"
      label="Votre téléphone est requis"
      required
      :allowed="[]"
      class="mt-40"
    />
    </Form>
  </div>
</template>

<style scoped></style>
