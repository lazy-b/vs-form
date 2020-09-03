<template>
  <demo-block title="带校验规则的表单">
    <m-form ref="form" v-model="form" :fields-config="fieldsConfig" />
    <div>
      <p v-if="errors.length > 0">我是错误信息</p>
      <p v-for="(err, i) in errors" :key="err + i">{{ err.message }}</p>
    </div>
  </demo-block>
</template>

<script>
// import Toast from '../../toast';
import MForm from '../index';

export default {
  components: { MForm },

  data() {
    return {
      fieldsConfig: [
        {
          label: '请假事由',
          key: 'leaveReason',
          type: 'input',
          props: {
            required: true,
            rules: [
              { type: 'string', required: true, message: '请假事由必填' },
              {
                type: 'string',
                message: '请假事由不能小于6个字符',
                pattern: /\w{6,}/,
              },
            ],
          },
          // 事件绑定
          on: {
            input() {
              console.log('input');
            },
            change() {
              console.log('change');
            },
          },
        },
        {
          type: 'separate',
        },
      ],
      form: {
        leaveReason: '',
      },

      errors: [],
    };
  },

  methods: {
    submit() {
      this.$refs.form.validate().then(
        () => {
          console.log('校验通过');
          this.errors = [];
        },
        err => {
          this.errors = err;
          // Toast({ message: err[0].message });
        }
      );
    },
  },
};
</script>
