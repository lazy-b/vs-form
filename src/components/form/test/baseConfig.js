import { cloneDeep } from 'lodash';

const getFields = function getFields() {
  const fields = [
    {
      key: 'alreadyLeave',
      type: 'slot',
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
          // console.log('input');
        },
        change() {
          // console.log('change');
        },
      },
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
      label: '开关',
      key: 'switch',
      type: 'switch',
      props: {
        title: '开关',
      },
    },
    {
      label: '多行输入',
      key: 'textArea',
      type: 'textArea',
      props: {},
    },
    {
      label: '图片选择',
      key: 'imgPic',
      type: 'imgPic',
      props: {},
    },
    {
      label: '纯文本展示',
      key: 'cell',
      type: 'cell',
      props: {},
    },
  ];
  return cloneDeep(fields);
};

export default getFields;
