import { VNode } from 'vue';
import { RuleItem } from 'async-validator';
import { TypeMap } from './typeMap.d';

// 表单配置项支持的 props
export type props = {
  required?: boolean; // 表单项是否必填，也可以定义在规则里面
  disabled?: boolean; // 表单项是否禁用
  rules?: RuleItem[]; // 表单项的验证规则
  name?: string; // slot 的插槽名
  [propName: string]: any; // 其他组件特有的属性
};

// 表单的配置中每一项的类型定义
export type Config = {
  // key?: string; // 表单项绑定值的属性名
  // on?: Object; // 表单项绑定的事件
  // nativeOn?: Object; // 表单项绑定的原生事件（.native 绑定的事件）
  type?: string; // 表单项的类型
  // label?: string; // 表单项的展示 label 名
  // required?: boolean; // 表单项是否必填，也可以定义在规则里面
  props?: props; // 表单项的props，透传进入表单项

  // {
  //   // 与 `v-bind:class` 的 API 相同，
  //   // 接受一个字符串、对象或字符串和对象组成的数组
  //   'class': {
  //     foo: true,
  //     bar: false
  //   },
  //   // 与 `v-bind:style` 的 API 相同，
  //   // 接受一个字符串、对象，或对象组成的数组
  //   style: {
  //     color: 'red',
  //     fontSize: '14px'
  //   },
  //   // 普通的 HTML attribute
  //   attrs: {
  //     id: 'foo'
  //   },
  //   // 组件 prop
  //   props: {
  //     myProp: 'bar'
  //   },
  //   // DOM property
  //   domProps: {
  //     innerHTML: 'baz'
  //   },
  //   // 事件监听器在 `on` 内，
  //   // 但不再支持如 `v-on:keyup.enter` 这样的修饰器。
  //   // 需要在处理函数中手动检查 keyCode。
  //   on: {
  //     click: this.clickHandler
  //   },
  //   // 仅用于组件，用于监听原生事件，而不是组件内部使用
  //   // `vm.$emit` 触发的事件。
  //   nativeOn: {
  //     click: this.nativeClickHandler
  //   },
  //   // 自定义指令。注意，你无法对 `binding` 中的 `oldValue`
  //   // 赋值，因为 Vue 已经自动为你进行了同步。
  //   directives: [
  //     {
  //       name: 'my-custom-directive',
  //       value: '2',
  //       expression: '1 + 1',
  //       arg: 'foo',
  //       modifiers: {
  //         bar: true
  //       }
  //     }
  //   ],
  //   // 作用域插槽的格式为
  //   // { name: props => VNode | Array<VNode> }
  //   scopedSlots: {
  //     default: props => createElement('span', props.text)
  //   },
  //   // 如果组件是其它组件的子组件，需为插槽指定名称
  //   slot: 'name-of-slot',
  //   // 其它特殊顶层 property
  //   key: 'myKey',
  //   ref: 'myRef',
  //   // 如果你在渲染函数中给多个元素都应用了相同的 ref 名，
  //   // 那么 `$refs.myRef` 会变成一个数组。
  //   refInFor: true
  // }
  // https://cn.vuejs.org/v2/guide/render-function.html#%E6%B7%B1%E5%85%A5%E6%95%B0%E6%8D%AE%E5%AF%B9%E8%B1%A1
  others?: {} | any; // 其他支持 jsx 的一些属性，如上所示，其中 on / nativeOn / props 专门移除了
  getProps?: Function; // 动态计算的表单项props，合并上面的属性值进行透传
  ifRender?: Function; // 动态计算的表单项显示和隐藏，实现表单项联动
  _ifRender?: boolean; // 动态计算的表单项显示和隐藏值（用户不可直接配置该属性）
  component?: VNode | string; // 本地引入的表单组件 或者 全局注册的表单项的组件名
};

export interface CustomConfig extends Config {
  itemKey?: string; // 表单项绑定项的 key 没有则取下方的属性 key
  key?: string; // 表单项绑定值的属性名
  on?: Record<string, any>; // 表单项绑定的事件
  nativeOn?: Record<string, any>; // 表单项绑定的原生事件（.native 绑定的事件）
  label?: string; // 表单项的展示 label 名
  required?: boolean; // 表单项是否必填，也可以定义在规则里面
}

export type FormProps = {
  value?: object; // 表单的值 一般使用 v-model 绑定
  fieldsConfig?: CustomConfig[]; // 表单的配置
  disabled?: boolean; // 表单是否是禁用状态
  [propName: string]: any; // 其他需要透传给所有表单项的配置
};

export interface Form {
  typeMap: TypeMap; // 全局的表单项类型映射
  setTypeMap: Function; // 自定义全局的表单项类型映射
  defaultType: string; // 不写定义表单项类型时默认的类型
}
