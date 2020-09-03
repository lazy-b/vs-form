// 表单项映射表
export default {
  // 普通输入框
  input: {
    // 指定实际的组件名
    // 使用懒加载的方式加载
    component: () => {
      import('vant/lib/field/style');
      return import('vant/lib/field');
    },
    props: {},
  },

  // 进度条
  progress: {
    // 指定实际的组件名
    component: () => {
      import('vant/lib/progress/style');
      return import('vant/lib/progress');
    },
    props: {},
  },

  // 开关
  switch: {
    // 指定实际的组件名
    component: () => {
      import('vant/lib/switch-cell/style');
      return import('vant/lib/switch-cell');
    },
    props: {},
  },

  // 多行输入
  textArea: {
    // 指定实际的组件名
    component: () => {
      import('vant/lib/field/style');
      return import('vant/lib/field');
    },
    props: {
      rows: '2',
      autosize: true,
      type: 'textarea',
      maxlength: '50',
      'show-word-limit': true,
    },
  },

  // 数字输入
  inputNumber: {
    // 指定实际的组件名
    component: () => {
      import('vant/lib/field/style');
      return import('vant/lib/field');
    },
    props: {
      type: 'number',
    },
  },

  // 图片选择
  imgPic: {
    // 指定实际的组件名
    component: () => {
      import('vant/lib/uploader/style');
      return import('vant/lib/uploader');
    },
    props: {},
  },

  // // slot 插槽
  // slot: {
  //   component: 'slot',
  //   getProps(form, config) {
  //     // 没有定义 slot 的 name 则使用 key
  //     const name = config.props.name || config.key;
  //     return {
  //       name,
  //     };
  //   },
  // },

  // // 分隔
  // separate: {
  //   component: 'separate',
  // },

  // 纯文本展示
  cell: {
    component: () => {
      import('vant/lib/cell/style');
      return import('vant/lib/cell');
    },
    // 动态 props
    // props 取值顺序是：typeMap.props -> item.props -> typeMap.getProps() -> item.getProps()
    // 后面对象的同名属性会覆盖前面的对象的同名属性，使用的Object.assign实现
    getProps(form, config) {
      return {
        title: config.label || config.key,
      };
    },
  },
};
