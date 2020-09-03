import { deepClone } from 'lodash';

const getFields = function() {
  const fields = [
    {
      key: 'alreadyLeave',
      type: 'slot',
    },
    {
      type: 'separate',
    },
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
      type: 'separate',
    },
    {
      label: '进度条',
      key: 'progress',
      type: 'progress',
      props: {
        percentage: 20,
      },
      // 表单联动
      ifRender(form /* form, config */) {
        const render = form.switch;
        return render;
      },
    },
    {
      type: 'separate',
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
      label: '多行输入',
      key: 'textArea',
      type: 'textArea',
      props: {},
    },
    {
      type: 'separate',
    },
    {
      label: '图片选择',
      key: 'imgPic',
      type: 'imgPic',
      props: {},
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
    {
      type: 'separate',
    },
  ];
  return deepClone(fields);
};

export default getFields;
