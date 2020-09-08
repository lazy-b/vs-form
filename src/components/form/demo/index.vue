<template>
  <div>
    <div title="基础用法">
      <m-form v-model="form" :fields-config="fieldsConfig1">
        <template slot="alreadyLeave">
          <div key="alreadyLeave" class="test">sssss</div>
          <div key="test" class="test2">sssss1</div>
        </template>
        <!-- <div slot="alreadyLeave">我是 alreadyLeave 的slot</div> -->
      </m-form>
    </div>

    <set-get />
    <validator-form />
  </div>
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

<style lang="scss" scoped>
.test222 {
  color: red;
}
.ssss {
  color: blue;
}
</style>
