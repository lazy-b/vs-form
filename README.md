# Form json 配置表单

## 介绍

基于 Vue 的使用 js 对象 进行配置生成的表单，主要适用于移动端  

该表单的特点如下：  
  1. 可以**支持任意的表单组件库**，例如：vant、vux甚至自建组件库等  
  2. 表单内部**未内置任何表单项**  
  3. 

> 由于和表单项松耦合，所以表单项必须实现 v-model ，如果没有实现，则无法正常管理该表单项  

作者本人使用 VsForm 的原因：  
  1. **提供表单项的联动**，只需简单配置就能实现  
  2. 配置直接生成表单，**不用写一堆臃肿的模板**  
  3. **配置支持设置默认属性，使得能够统一表单项的默认设置**  
  4. 支持配置校验规则，**不用写一堆 if else 来手动校验**  
  5. 数据驱动视图，只需要修改配置对象，则会自动刷新UI  
  6. 支持在指定位置渲染 slot  
  7. 通过 v-model 直接拿到/设置 表单的值  
  8. 作者还在回忆...

由于内部没有内置表单项，下面演示代码均是配合组件库 vant 编写。（vant 不会告我侵权吧。。。）  

## 使用

### 安装
#### NPM

```shell
npm i --save vs-form
```

#### YARN

```shell
yarn add vs-form
```

### 简单使用

在最简单的情况下，无需其他配置就可以使用  

```js
// main.js
import VsForm from 'vs-form';
// Vant 可以换成任意的组件库，或者压根就不引入组件库而使用自定义组件
import Vant, { Toast } from 'vant';
Vue.use(Vant);

// 设置校验不通过提示方法
VsForm.showError = (errors) => {
  // 弹框提示未通过原因
  Toast(errors[0].message)
}

Vue.use(VsForm);
```

```html
<vs-form v-model="form" ref="form" :fieldsConfig="fieldsConfig" class="gc-mb60">
  <template slot="introduction">
    <div>我是 slot introduction</div>
  </template>
</vs-form>
```

```js
// 由于没有做其他配置，所以配置中 type 就是表单项组件名  
// 其中 slot 是特殊的，代表这里需要渲染一个 具名slot， slot 名是配置项中的 key  
export default {
  data() {
    return {
      // 如果需要绑定事件，则需要传 this 给配置数组
      fieldsConfig: [
        {
          label: '你的名字',
          key: 'name',
          type: 'van-field',
          props: {
            rules: [{ required: true, message: '请输入姓名' }],
          },
        },
        {
          label: '费用科目',
          key: 'costAccount',
          type: 'van-picker',
          props: {
            required: true,
            columns: ['杭州', '宁波', '温州', '绍兴', '湖州', '嘉兴', '金华', '衢州'],
          },
        },
        {
          key: 'introduction',
          type: 'slot',
          // 只有 vip 才配拥有这个 slot
          ifRender(form, config) {
            let render = false;
            if (form.name === 'vip') {
              render = true;
            }

            return render;
          },
        },
      ],
      form: {},
    };
  },
  methods: {
    // 校验表单
    validate() {
      return this.$refs.form.validate();
    },
  },
};
```

### 自定义 typeMap

VsForm 还有一个静态属性 typeMap ，这个映射表可以指定配置中的 type 指向的是什么组件。  
同时还可以对该组件进行默认配置，例如给所有的 textarea 设置一个最大长度  

```js
// main.js
import VsForm from 'vs-form';
import typeMap from '[你的自定义 typeMap 存放位置]';

Vue.use(VsForm, typeMap);
```

```js
// typeMap.js

// 表单项映射表
export default {
  // 普通输入框
  input: {
    // 指定实际的组件名
    // 使用懒加载的方式加载
    // 此处直接加载了组件，也可以指定一个已经注册了的组件名
    // 例如：component: 'van-field'
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
```

### 对表单进行校验

可以通过在配置参数中的`props`参数里面传入`rules`进行表单表单项的规则配置，表单校验采用了 [async-validator](https://www.npmjs.com/package/async-validator) 作为底层，规则与之一致。

表单支持使用插件注册处理校验结果的方法，此处未做演示。

```html
<vs-form ref="form" v-model="form" :fields-config="fieldsConfig" />
<div>
  <p v-if="errors.length > 0">我是校验不通过的提示</p>
  <p style="{ color: red }" v-for="(err, i) in errors" :key="err + i">
    {{ err.message }}
  </p>
</div>

<div @click="submit" type="default">提交</div>
```

```js
export default {
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

| 参数            | 说明               | 类型       | 默认值 |
| --------------- | ------------------ | ---------- | ------ |
| v-model (value) | 当前表单的值       | _object_   | -      |
| fieldsConfig    | 当前表单的配置参数 | _config[]_ | -      |

> 表单赋值采用的合并操作，并不是替换操作，类似 Object.assign ，所以不会删除 val 中没有的键名的值  
> 例如表单值为: { a: 2, b: 1 }, val 值为 { a: 1 }，则赋值后的结果为 { a: 1, b: 1 }  
> 如果需要清空值，请使用 reset()  

### config

| 参数        | 说明                                                                                                                                                                    | 类型              | 默认值 |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------ |
| type        | 表单项的类型/表单项的名称                                                                                                                                               | _string_          | -      |
| key         | 当前表单项绑定的属性名/slot的具名名称                                                                                                                                   | _string_          | -      |
| on          | 当前表单项绑定的事件（需要自行处理 this 指向）                                                                                                                          | _object: {event}_ | -      |
| nativeOn    | .native 绑定的事件                                                                                                                                                      | _object: {event}_ | -      |
| component   | 表单项的标签名/表单项（直接引入）                                                                                                                                       | _VNode \| string_ | -      |
| label       | 表单项展示的 label 名（如果必填项未提供校验message则会使用这个 label 进行提示）                                                                                         | _string_          | -      |
| required    | 表单项是否必填（也可以写在 rules 里面）（ui部分需要自行处理）                                                                                                           | _boolean_         | -      |
| others      | 其他支持 [jsx](https://cn.vuejs.org/v2/guide/render-function.html#%E6%B7%B1%E5%85%A5%E6%95%B0%E6%8D%AE%E5%AF%B9%E8%B1%A1) 的一些属性，其中 on / nativeOn / props 被移除 | _object_          | -      |
| props       | 表单项的配置参数，直接透传给对应表单项                                                                                                                                  | _object_          | -      |
| getProps    | 表单项的动态参数计算方法，计算出结果后和上面的 props 合并                                                                                                               | _function_        | -      |
| ifRender    | 表单项的是否渲染计算方法，根据计算出的结果决定是否渲染表单项，表单联动的实现机制                                                                                        | _function_        | -      |
| \$$ifRender | 表单项是否渲由上面方法计算出的结果                                                                                                                                      | _function_        | -      |

> getProps({...form}, config) 的入参为：form 的当前值 和 当前表单项当时的配置值（可能前面已经被动态修改了）

> ifRender({...form}, config) 的入参为：form 的当前值 和 当前表单项当时的配置值（可能会由于其他表单项的改变而改变）

> props 取值顺序是：typeMap.props -> item.props -> typeMap.getProps() -> item.getProps()  
> 后面对象的同名属性会覆盖前面的对象的同名属性，使用的 Object.assign 实现  

> type 为 slot 类型的表单项，其实是一个 slot 占位，slot 名与 key 或者 name 属性的值相同  

### Events

VsForm 使用 v-model 进行值管理，所以会冒泡 input 事件  
其他表单项事件由各个表单项确定，监听事件需要自行定义在配置项中  

| 事件  | 说明               | 回调参数                       |
| ----- | ------------------ | ------------------------------ |
| input | 表单内容变化时触发 | _value: object (当前表单的值)_ |

### 方法

通过 ref 可以获取到 Form 实例并调用实例方法，详见[组件实例方法](#/zh-CN/quickstart#zu-jian-shi-li-fang-fa)

| 方法名    | 说明                           | 参数                                              | 返回值           |
| --------- | ------------------------------ | ------------------------------------------------- | ---------------- |
| validate  | 校验整个表单                   | noTips: Boolean（是否需要弹窗提示错误信息）       | promise: Promise |
| reset     | 重置表单值为指定的值           | val: Object                                       | -                |
| refreshUI | 强制重新计算配置项，进行UI刷新 | force: boolean （true：无论是否有更新，强制刷新） | -                |

> 理论上你永远都不需要使用 refreshUI 方法，如果你遇到了需要使用的场景，请联系我  
