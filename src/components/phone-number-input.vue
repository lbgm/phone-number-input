<template>
  <div
    ref="selectPhone"
    data-widget-item="baseinput"
    class="flex flex-col relative"
    data-lbgm-phonenumberinput="component"
  >
    <!--phone-number-input core-->
    <div data-children="core" class="w-full flex flex-col relative">
      <!---->
      <label
        v-if="label"
        class="cursor-pointer baseinput-label text-sm text-left leading-1dt125 tracking-n0dt1 opacity-80 text-black font-semibold mb-2 select-none"
        :for="name"
        data-children="label"
      >
        <span data-children="labelText">{{ label }}</span>
        <!---->
        <span
          v-if="required"
          data-children="requiredStar"
          class="text-left text-DA1414 font-semibold opacity-80 text-xs"
          >&thinsp;*</span
        >
      </label>
      <!--input-->
      <div
        data-children="inputcore"
        ref="selectPhoneButton"
        class="bg-white baseinput-core border w-full border-gray rounded-lg py-3 px-4 flex flex-shrink flex-nowrap items-center space-x-2"
        :class="{ error: hasError, success: hasSuccess }"
      >
        <span
          @click="toggleSelect()"
          class="inline-flex flex-nowrap items-center space-x-2 cursor-pointer"
          ref="basePhoneArrow"
          data-children="arrowGroup"
        >
          <template v-if="arrow">
            <span v-if="$slots.arrow" class="inline-flex flex-shrink-0">
              <slot name="arrow" />
            </span>
            <span v-else class="inline-flex flex-shrink-0">
              <Down />
            </span>
          </template>
          <span
            class="opacity-50 select-none inline-flex flex-whrink-0 font-semibold text-black text-left text-sm leading-1dt125"
          >
            {{ `+${defaultSelected?.dialCode}` }}
          </span>
        </span>
        <!---->
        <input
          data-children="htmlInput"
          :placeholder="placeholder"
          class="border-0 outline-none appearance-none flex-shrink w-full bg-transparent"
          type="text"
          ref="inputBase"
          :name="name"
          :id="name"
          :value="phone"
          @input="onPhoneInput($event)"
          :autocomplete="'off'"
          spellcheck="false"
          v-typing="{
            finish: emitPhoneData,
            timing: 100,
          }"
        />
      </div>
      <!--select option-->
      <div
        ref="selectOptions"
        class="w-full rounded border border-DADEE3 bg-white absolute z-one lbgm-phone-scrll"
        v-if="openSelect"
        data-children="countriesList"
        :class="{
          'bottom-0': popupPos === 'top',
          'mt-mt0dt281 top-full': popupPos === 'bottom',
        }"
        :style="{
          maxHeight: `${listHeight}px`,
        }"
      >
        <div
          class="w-full py-2 px-4 cursor-pointer text-left hover:bg-217-242-236-dt5"
          v-for="(country, index) in allowedCountries"
          @click="choose(country)"
          :key="index"
          :data-country="country.iso2"
        >
          <span class="font-semibold text-xs text-394452">
            {{ country.name }}
          </span>
        </div>
      </div>
    <!-- end core-->
    </div>

    <!-- messages -->

    <!-- error message -->
    <div
      v-if="hasError"
      data-children="error"
      class="rounded-lg w-full bg-danger-light flex flex-row space-x-1 py-0dt375 px-2 mt-2 items-center select-none"
    >
      <span class="inline-flex flex-shrink-0">
        <Red />
      </span>
      <span class="text-xs text-danger font-medium">{{
        errorMessage ?? ""
      }}</span>
    </div>

    <!-- success message -->
    <div
      v-if="hasSuccess"
      data-children="success"
      class="rounded-lg w-full bg-primary-light flex flex-row space-x-1 py-0dt375 px-2 mt-2 items-center select-none"
    >
      <span class="inline-flex flexshrink-0">
        <Green />
      </span>
      <span class="text-xs text-primary font-medium">{{
        successMessage ?? ""
      }}</span>
    </div>

    <!-- any slot -->
    <slot />
  </div>
</template>

<script setup lang="ts">
export interface Props {
  value?: string;
  label?: string;
  hasError?: boolean;
  hasSuccess?: boolean;
  successMessage?: string;
  errorMessage?: string;
  placeholder?: string;
  name?: string;
  required?: boolean;
  defaultCountry?: string;
  arrow?: boolean;
  listHeight?: number;
  allowed?: string[];
}

import {
  computed,
  toRef,
  ref,
  onMounted,
  getCurrentInstance,
  watch,
type ComponentInternalInstance,
type Ref,
} from "vue";

import Down from "./icons/chevron-down.vue";
import Red from "./icons/red-info.vue";
import Green from "./icons/green-info.vue";

import countries from "./parts/all-countries";
import parsePhoneNumber from "libphonenumber-js";
import type { PhoneNumber } from "libphonenumber-js";
import { typing } from "../assets/directives";
import type { PhoneDATA, Country } from './parts/types';

const vTyping = { ...typing };

const props = withDefaults(defineProps<Props>(), {
  value: "",
  label: "",
  hasError: false,
  hasSuccess: false,
  successMessage: "",
  errorMessage: "",
  placeholder: "",
  name: "",
  required: false,
  defaultCountry: "BJ",
  arrow: true,
  listHeight: 150,
  allowed: () => [],
});

const emit = defineEmits(["phone", "country", "phoneData"]);

const openSelect: Ref<boolean> = ref(false);
const defaultSelected: Ref<Country> = ref<Country>() as Ref<Country>;
const defaultCountry: Ref<string> = toRef(props, "defaultCountry");
const filterCountries: Ref<string[]> = toRef(props, "allowed");
const basePhoneArrow: Ref<HTMLElement | null> = ref(null);
const phone: Ref<string> = ref("");
const inputBase: Ref<HTMLInputElement | null> = ref(null);

const popupPos = ref("bottom");
const listHeight = toRef(props, "listHeight");
const that: ComponentInternalInstance | null = getCurrentInstance();

/**
 * used to send custom Event: usable in case of scroll turning off when popup is under
 */
const cev_dash_select = () => {
  const event = new CustomEvent("CEV_SELECT_POPUP", {
    detail: { opened: openSelect.value, target: that?.refs.selectPhone },
  });
  document.body.dispatchEvent(event);
};

/**
 * filt allowedCountries from props
 */
const allowedCountries = computed((): Country[] => {
  const tbl: Country[] =
    filterCountries.value.length !== 0
      ? countries.filter((o: Country) => filterCountries.value.includes(o.iso2))
      : countries;
  return tbl;
});

/**
 * ToggleSelect
 * to open countries list
 */
const toggleSelect = () => {
  openSelect.value = !openSelect.value;

  // calculate popup position: top or bottom
  const selectRect = (that?.refs.selectPhone as HTMLElement).getBoundingClientRect();
  // y
  popupPos.value = selectRect.bottom < listHeight.value ? "top" : "bottom";
};

/**
 * formatPhoneInput
 * used to format Phone Input
 * @param val
 */
const formatPhoneInput = (val: string): Country => {
  const phoneNumber: PhoneNumber | undefined = parsePhoneNumber(`+${val}`);
  if (phoneNumber) {
    phone.value = phoneNumber?.nationalNumber as string;

    return {
      iso2: phoneNumber?.country as string,
      dialCode: phoneNumber?.countryCallingCode as string,
      name: countries.find((o: Country) => o.iso2 === phoneNumber?.country as string)?.name as string,
    };
  }
  // else
  return {
    ...countries.find((o: Country) => o.iso2 === defaultCountry.value) as Country,
  };
};

/**
 * emitPhone
 * used to emit phone in internationalFormat
 */
const emitPhone = (): void => {
  if (phone.value)
    emit("phone", `${defaultSelected.value.dialCode}${phone.value}`);
  else emit("phone", "");
};

/**
 * emitPhoneData
 * Used to emit phoneData as an object
 * @returns {}
 */
const emitPhoneData = (): void => {
  const ph = parsePhoneNumber(
    `+${defaultSelected.value.dialCode}${phone.value}`
  );
  emit("phoneData", {
    country: ph?.country,
    dialCode: ph?.countryCallingCode,
    nationalNumber: ph?.nationalNumber,
    number: ph?.number,
    isValid: ph?.isValid(),
  } as PhoneDATA);
};

/**
 * emitAll
 * used to emit all event
 */
const emitAll = () :void => {
  emit("country", defaultSelected.value.iso2);
  emitPhone();
  emitPhoneData();
}

/**
 * to select any country
 * @param country
 */
const choose = (country: Country) => {
  defaultSelected.value = country;
  openSelect.value = false;
  emitAll();
};


/**
 * bind on input
 * @param event
 */
const onPhoneInput = (event: any) => {
  event.target.value = phone.value = String(event.target.value).replace(
    /\D/g,
    ""
  );
  emitPhone();
};

watch(openSelect, () => {
  // dispatch custom HTML event
  cev_dash_select();
});

onMounted(() => {
  // initialize default country selected
  defaultSelected.value = formatPhoneInput(props.value);
  emitAll();

  // outside
  document.addEventListener("click", (event) => {
    if (
      basePhoneArrow.value &&
      !(basePhoneArrow.value as HTMLElement).contains(event.target as Node)
    ) {
      openSelect.value = false;
    }
  });
});

defineExpose({
  defaultSelected,
  defaultCountry,
  phone,
  popupPos,
  listHeight,
});
</script>

<style scoped lang="scss">
@import '../assets/tailwind.scss';

[data-children="countriesList"] {
  overflow-y: auto;
  filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.15));
}

[data-children="inputcore"] {
  input {
    &::placeholder {
      font-weight: bold;
      color: gray;
    }

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
      transition: background-color 5000s ease-in-out 0s;
    }
  }

  &.error {
    background: #feefef;
    border: 1px solid #da1414;

    input {
      -webkit-box-shadow: 0 0 0px 1000px #feefef inset !important;
    }
  }

  &.success {
    background: #edf9f0;
    border: 1px solid #287d3c;

    input {
      -webkit-box-shadow: 0 0 0px 1000px #edf9f0 inset !important;
    }
  }
}
</style>
