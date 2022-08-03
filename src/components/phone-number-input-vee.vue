<template>
  <div
    ref="selectPhone"
    data-widget-item="baseinput"
    class="flex flex-col items-baseline relative"
  >
    <label
      class="cursor-pointer baseinput-label text-sm text-left leading-[1.125rem] -tracking-[0.1px] opacity-80 text-black font-semibold mb-2 select-none"
      :for="name"
      v-if="label"
    >
      <span>{{ label }}</span
      >&thinsp;<span
        v-if="required"
        class="text-left text-DA1414 font-semibold opacity-80 text-xs leading-5"
        >*</span
      >
    </label>
    <!--input-->
    <div
      ref="selectPhoneButton"
      class="bg-white baseinput-core border w-full border-gray rounded-lg py-3 px-4 flex flex-shrink flex-nowrap items-center space-x-2"
      :class="{ error: hasError, success: hasSuccess }"
    >
      <span
        @click="toggleSelect()"
        class="inline-flex flex-nowrap items-center space-x-2 cursor-pointer"
        ref="basePhoneArrow"
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
          class="opacity-50 select-none inline-flex flex-whrink-0 font-semibold text-black text-left text-sm leading-[1.225rem]"
        >
          {{ `+${defaultSelected.dialCode}` }}
        </span>
      </span>
      <!---->
      <input
        :placeholder="placeholder"
        class="border-0 outline-none appearance-none flex-shrink w-full bg-transparent"
        type="text"
        ref="inputBase"
        :name="name"
        :id="name"
        :value="inputValue"
        @input="onPhoneInput($event)"
        @blur="handleBlur"
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
      class="w-full rounded border border-DADEE3 bg-white absolute mt-[0.281rem] z-[1] custom-scrll"
      v-if="openSelect"
      data-widget-item="base-phone-select-group"
      :class="{
        'bottom-0': popupPos === 'top',
        'mt-[0.281rem]': popupPos === 'bottom',
      }"
      :style="{
        maxHeight: `${listHeight}px`,
      }"
    >
      <div
        class="w-full py-2 px-4 cursor-pointer text-left hover:bg-[rgba(217,242,236,.5)]"
        v-for="(country, index) in allowedCountries"
        @click="choose(country)"
        :key="index"
      >
        <span class="font-semibold text-xs text-394452">
          {{ country.name }}
        </span>
      </div>
    </div>

    <!-- errors messages -->

    <!-- error message -->
    <div
      v-if="hasError"
      class="rounded-lg w-full bg-danger-light flex flex-row space-x-1 py-1.5 px-2 mt-2 items-center select-none"
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
      class="rounded-lg w-full bg-primary-light flex flex-row space-x-1 py-1.5 px-2 mt-2 items-center select-none"
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
  hasSuccess?: boolean;
  successMessage?: string;
  placeholder?: string;
  name: string;
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
} from "vue";

import { useField } from "vee-validate";

import Down from "./icons/chevron-down.vue";
import Red from "./icons/red-info.vue";
import Green from "./icons/green-info.vue";

import countries from "./parts/all-countries";
import parsePhoneNumber from "libphonenumber-js";
import { find } from "lodash";
import { typing } from "../assets/directives";

const vTyping = { ...typing };

interface Country {
  name: string;
  dialoCode: string;
  iso2: string;
}

const props = withDefaults(defineProps<Props>(), {
  value: "",
  label: "",
  hasSuccess: false,
  successMessage: "",
  placeholder: "",
  required: true,
  defaultCountry: "CI",
  arrow: true,
  listHeight: 150,
  allowed: () => ["BJ", "CI"],
});

const {
  value: inputValue,
  errorMessage,
  handleBlur,
  handleChange,
  meta,
} = useField(props.name, undefined, {
  initialValue: props.value ? props.value : "",
});

// compute error from vee-validate
const hasError = computed((): boolean => {
  return errorMessage.value !== undefined;
});

const emit = defineEmits(["phone", "country", "phoneData"]);

const openSelect = ref(false);
const defaultSelected = ref<Record<string, string>>({});
const defaultCountry = toRef(props, "defaultCountry");
const filterCountries = toRef(props, "allowed");
const basePhoneArrow = ref(null);
const phone = ref("");
const inputBase = ref(null);

const popupPos = ref("bottom");
const listHeight = toRef(props, "listHeight");
const that: any = getCurrentInstance();

/**
 * use to send custom Event usable in case of scroll turning off when popup is under
 */
const cev_dash_select = () => {
  const event = new CustomEvent("CEV_SELECT_POPUP", {
    detail: { opened: openSelect.value, target: that.refs.selectPhone },
  });
  document.body.dispatchEvent(event);
};

/**
 * filt allowedCountries from props
 */
const allowedCountries = computed((): Country[] => {
  const tbl: any =
    filterCountries.value.length !== 0
      ? countries.filter((o: any) => filterCountries.value.includes(o.iso2))
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
  const selectRect = that.refs.selectPhone.getBoundingClientRect();
  const bodyRect = document.body.getBoundingClientRect();
  // y
  popupPos.value =
    Math.abs(bodyRect.height - selectRect.bottom) <= listHeight.value
      ? "top"
      : "bottom";
};

/**
 * formatPhoneInput
 * used to format Phone Input
 * @param val
 */
const formatPhoneInput = (val: string): Record<any, any> | undefined => {
  const phoneNumber: any = parsePhoneNumber(`+${val}`);
  if (phoneNumber) {
    phone.value = phoneNumber.nationalNumber;

    return {
      iso2: phoneNumber.country,
      dialCode: phoneNumber.countryCallingCode,
      name: function () {
        return (
          find(countries, { iso2: this.iso2 }) as unknown as { name: string }
        ).name;
      },
    };
  }
  // else
  return {
    ...find(countries, { iso2: defaultCountry.value }),
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
  });
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
  defaultSelected.value = country as unknown as Record<string, string>;
  openSelect.value = false;
  emitAll();
};

/**
 *
 * @param event bind on input
 */
const onPhoneInput = (event: any) => {
  handleChange(event);
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
  defaultSelected.value = formatPhoneInput(props.value) as Record<any, any>;
  emitAll();
  // initialize vee validate input value
  inputValue.value = phone.value;

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
</script>

<style scoped lang="scss">
::placeholder {
  font-weight: bold;
  color: gray;
}

.error {
  background: #feefef;
  border: 1px solid #da1414;
  //-webkit-box-shadow: 0 0 0 30px #feefef inset !important;
}

.success {
  background: #edf9f0;
  border: 1px solid #287d3c;
}

.error input {
  -webkit-box-shadow: 0 0 0px 1000px #feefef inset !important;
}

.success input {
  -webkit-box-shadow: 0 0 0px 1000px #edf9f0 inset !important;
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  transition: background-color 5000s ease-in-out 0s;
}

div [data-widget-item="base-phone-select-group"] {
  overflow-y: auto;
  filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.15));
}
</style>
