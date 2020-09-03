<template>
  <demo-section>
    <demo-block title="基础用法">
      <m-form v-model="form" :fields-config="fieldsConfig1">
        <div slot="alreadyLeave">我是 alreadyLeave 的slot</div>
      </m-form>
    </demo-block>

    <set-get />
    <validator-form />
  </demo-section>
</template>

<script>
import getFields from './fieldsConfig.js';
import SetGet from './SetGet';
import ValidatorForm from './ValidatorForm';
import typeMap from './typeMap';
import MForm from '../index';

MForm.setTypeMap(typeMap);

export default {
  components: { MForm, SetGet, ValidatorForm },

  data() {
    return {
      fieldsConfig1: getFields(this),
      form: {
        textArea: '',
      },
    };
  },
};
</script>
