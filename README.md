# phone-number-input

Simple Phone Number Input for VueJs

<img width="599" alt="image" src="https://user-images.githubusercontent.com/92580505/182828046-989095ca-f6bf-420e-92fc-98fb99dab25e.png">


## install
```sh
npm i @lbgm/phone-number-input
```


## Props
  Interface:
  ```ts
  interface Props {
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
  ```

 Default values:
 ```js
 {
  value: "", // like '22997000000', ${dialCode}${nationalNumber}
  label: "",
  hasError: false,
  hasSuccess: false,
  successMessage: "",
  errorMessage: "",
  placeholder: "",
  name: "",
  required: false,
  defaultCountry: "CI",
  arrow: true,
  listHeight: 150,
  allowed: () => ["BJ", "CI"],
 }
 ```

 ## Slots

 ### arrow
 ```html
 <!-- to change arrow icon-->
 <phone-input>
  <template #arrow><icon /><template>
 </phone-input>
 ```

 use global slot to append content at the end of the component.
 ```html
 <phone-input>
   <div>Hello</div>
 </phone-input>
 ```


## Use
 main.ts :
 ```js
  import { PhoneInput } from '@lbgm/phone-number-input';

  // register as global component
  app.component('PhoneInput', PhoneInput);
 ```
 App.vue :
 ```js
 // import component style
 import '@lbgm/phone-number-input/dist/style.css';
 ```

 use component:
 ```html
    <phone-input
      @phone="phone = $event"
      @country="country = $event"
      @phoneData="phoneData = $event"
      name="cphone"
      label="Entrer votre téléphone"
      required
      :allowed="[]"
      :value="'22997788842'"
    />
 ```
 <img width="675" alt="image" src="https://user-images.githubusercontent.com/92580505/182823223-6be9aa4c-b4d8-4835-aaae-8b79052c0caf.png">

 ```js
  console.log(phone) : 22997788842
  console.log(country) : BJ
  console.log(phoneData) : { "country": "BJ", "dialCode": "229", "nationalNumber": "97788842", "number": "+22997788842", "isValid": true }
 ```

 ## Use it with Vee-validate

 Sample wrapper code:
 ```html
 <template>
  <phone-input
    :has-error="hasError"
    :errorMessage="errorMessage"
    @phoneData="validatePhone"
    ref="phoneInput"
  />
</template>
```
```ts
<script lang="ts">
import { useField } from 'vee-validate';
import { computed, onMounted, getCurrentInstance } from 'vue';

interface IPhoneData {
  country?: string;
  dialCode?: string;
  nationalNumber?: string;
  number?: string;
  isValid?: boolean;
}

export default {
  setup(props: any, context: any) {
    const that: any = getCurrentInstance();

    const {
      value: inputValue,
      errorMessage,
      handleBlur,
      handleChange,
      meta,
    } = useField(context.attrs.name, undefined, {
      initialValue: context.attrs.value ? context.attrs.value : '',
      validateOnValueUpdate: false,
    });

    // compute error from vee-validate
    const hasError = computed((): boolean => {
      return errorMessage.value !== undefined;
    });

    const validatePhone = (data: IPhoneData) => {
      handleChange(data.nationalNumber, false);
      context.emit('phoneData', data);
    };

    onMounted(() => {
      if (that.refs.phoneInput.phone) {
        handleChange(that.refs.phoneInput.phone);
      }
    });

    return {
      hasError,
      errorMessage,
      validatePhone,
    };
  },
};
</script>
```

