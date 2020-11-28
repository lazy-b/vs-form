# Form json 配置表单

### 介绍

使用 json 进行配置生成的表单

### 引入

```js
import Vue from 'vue';
import { Form } from 'vant';

Vue.use(Form);
```

## 代码演示

### 基础用法

可以通过`v-model`双向绑定表单的值，通过`fieldsConfig`进行表单配置，通过`formInherit`对所有表单项进行配置，例如表单禁用。

```html
<!-- Form 表单内置了一些基于 Vant 组件的基础组件，同时支持用户自定义其他组件 -->
<van-form :fields-config="fieldsConfig1">
  <div slot="alreadyLeave">我是 alreadyLeave 的slot</div>
</van-form>
```

```js
import getFields from './fieldsConfig.js';

export default {
  data() {
    return {
      fieldsConfig1: getFields(this),
      form: {},
    };
  },
};
```

```js
// fieldsConfig.js
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
  return fields;
};

export default getFields;
```

### 自定义表单的 get set

可以通过`set-value` 和 `get-value` 在表单传值之前进行操作。

```html
<van-form
  v-model="form"
  :fields-config="fieldsConfig"
  :set-value="setValue"
  :get-value="getValue"
/>
```

```js
export default {
  components: {},
  i18n: {
    'zh-CN': {
      setGet: '自定义表单 set 和 get',
    },
    'en-US': {
      setGet: 'Custom form set get',
    },
  },

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
      if (val.switch) {
        val.cell = val.leaveReason + ' （我是请假事由的复制）';
      } else {
        val.cell = '';
      }
      return val;
    },
    getValue(form, keys, target) {
      if (target.cell) {
        target.cell = target.cell.split(' ')[0];
      }
      return target;
    },
  },
};
```

### 对表单进行校验

可以通过在配置参数中的`props`参数里面传入`rules`进行表单表单项的规则配置，表单校验采用了 [async-validator](https://www.npmjs.com/package/async-validator) 作为底层，规则与之一致。

表单支持使用插件注册处理校验结果的方法，此处未做演示。

```html
<van-form ref="form" v-model="form" :fields-config="fieldsConfig" />
<div>
  <p v-if="errors.length > 0">{{ $t('i am error message') }}</p>
  <p style="{color: red}" v-for="(err, i) in errors" :key="err + i">
    {{ err.message }}
  </p>
</div>

<van-button @click="submit" type="default">{{ $t('submit') }}</van-button>
```

```js
import Toast from '../../toast';

export default {
  components: {},
  i18n: {
    'zh-CN': {
      validator: '校验表单',
      submit: '提交表单',
      'i am error message': '我是错误信息',
    },
    'en-US': {
      validator: 'validator form',
      submit: 'submit form',
      'i am error message': 'i am error message',
    },
  },

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
      form: {},

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
          Toast({ message: err[0].message });
        }
      );
    },
  },
};
```

## API

### Props

| 参数            | 说明                            | 类型       | 默认值 |
| --------------- | ------------------------------- | ---------- | ------ |
| v-model (value) | 当前表单的值                    | _object_   | -      |
| fieldsConfig    | 当前表单的配置参数              | _config[]_ | -      |
| formInherit     | 继承给所有表单项的 props 的配置 | _object_   | -      |
| getValue        | 在表单将表单值传出来之前做处理  | _function_ | -      |
| setValue        | 在给表单赋值之前做处理          | _function_ | -      |

> getValue(form, keys, val): form 当前表单的值，包括被隐藏表单项的值 keys 当前应该展示的所有项的键名数组 val 默认返回的值
> setValue(val): val 默认会赋给表单的值
> 表单赋值采用的合并操作，并不是替换操作，类似 Object.assign ，所以不会删除 val 中没有的键名的值
> 例如表单值为: { a: 2, b: 1 }, val 值为 { a: 1 }，则赋值后的结果为 { a: 1, b: 1 }

### config

| 参数        | 说明                                                                             | 类型              | 默认值 |
| ----------- | -------------------------------------------------------------------------------- | ----------------- | ------ |
| type        | 表单项的类型                                                                     | _string_          | -      |
| key         | 当前表单项绑定的属性名                                                           | _string_          | -      |
| on          | 当前表单项绑定的事件（需要自行处理 this 指向）                                   | _object: {event}_ | -      |
| nativeOn    | .native 绑定的事件                                                               | _object: {event}_ | -      |
| component   | 表单项的标签或者表单项（可用于自定义表单项）                                     | _VNode \| string_ | -      |
| label       | 表单项展示的 label 名                                                            | _string_          | -      |
| required    | 表单项是否必填                                                                   | _boolean_         | -      |
| props       | 表单项的配置参数，直接透传给对应表单项                                           | _object_          | -      |
| getProps    | 表单项的动态参数计算方法，计算出结果后和上面的 props 合并                        | _function_        | -      |
| ifRender    | 表单项的是否渲染计算方法，根据计算出的结果决定是否渲染表单项，表单联动的实现机制 | _function_        | -      |
| \$$ifRender | 表单项是否渲由上面方法计算出的结果                                               | _function_        | -      |

> getProps({...form}, config) 的入参为：form 的当前值 和 当前表单项当时的配置值（可能前面已经被动态修改了）

> ifRender({...form}, config) 的入参为：form 的当前值 和 当前表单项当时的配置值（可能会由于其他表单项的改变而改变）

> props 取值顺序是：typeMap.props -> item.props -> typeMap.getProps() -> item.getProps()
> 后面对象的同名属性会覆盖前面的对象的同名属性，使用的 Object.assign 实现

> type 为 slot 类型的表单项，其实是一个 slot 占位，slot 名与 key 或者 name 属性的值相同

### Events

除下列事件外，Field 默认支持 Input 标签所有的原生事件

| 事件  | 说明               | 回调参数                       |
| ----- | ------------------ | ------------------------------ |
| input | 表单内容变化时触发 | _value: object (当前表单的值)_ |

### 方法

通过 ref 可以获取到 Form 实例并调用实例方法，详见[组件实例方法](#/zh-CN/quickstart#zu-jian-shi-li-fang-fa)

| 方法名   | 说明                 | 参数                                        | 返回值           |
| -------- | -------------------- | ------------------------------------------- | ---------------- |
| validate | 校验整个表单         | noTips: Boolean（是否需要弹窗提示错误信息） | promise: Promise |
| reset    | 重置表单值为指定的值 | val: Object                                 | -                |
