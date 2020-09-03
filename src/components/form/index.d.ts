import { VNode } from 'vue';
import { RuleItem } from 'async-validator';
import { TypeMap } from './typeMap.d.ts';

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
  getProps?: Function; // 动态计算的表单项props，合并上面的属性值进行透传
  ifRender?: Function; // 动态计算的表单项显示和隐藏，实现表单项联动
  _ifRender?: boolean; // 动态计算的表单项显示和隐藏值（用户不可直接配置该属性）
  component?: VNode | string; // 本地引入的表单组件 或者 全局注册的表单项的组件名
};

export interface CustomConfig extends Config {
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
