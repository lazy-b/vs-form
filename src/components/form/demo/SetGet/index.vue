<template>
  <demo-block title="自定义表单 set 和 get">
    <m-form
      v-model="form"
      :fields-config="fieldsConfig"
      :set-value="setValue"
      :get-value="getValue"
    />
    {{ form }}
  </demo-block>
</template>

<script>
import MForm from '../../index';

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
          label: '开关',
          key: 'switch',
          type: 'switch',
          props: {
            title: '开关',
          },
        },
        {
          type: 'separate',
        },
        {
          type: 'separate',
        },
        {
          label: '纯文本展示',
          key: 'cell',
          type: 'cell',
          props: {},
        },
      ],
      form: {
        cell: '',
      },
    };
  },

  methods: {
    setValue(val) {
      const v = { ...val };
      if (v.switch) {
        v.cell = `${v.leaveReason} （我是请假事由的复制）`;
      } else {
        v.cell = '';
      }
      return v;
    },
    getValue(form, keys, target) {
      const t = { ...target };
      if (t.cell) {
        [t.cell] = t.cell.split(' ');
      }
      return t;
    },
  },
};
</script>
