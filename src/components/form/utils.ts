// eslint-disable-next-line
import { RuleItem } from 'async-validator';
import Form from './index';
import { Form as FormType, CustomConfig } from './index.d.ts';

/**
 *判断是模板是否是函数
 * @param target 被判断的目标
 */
/* eslint-disable-next-line */
const isFunction = (target: any): boolean => target instanceof Function;

/**
 * 判断指定对象上是否存在指定属性名
 * @param obj 被判断对象
 * @param key 被判断属性名
 */
// eslint-disable-next-line no-prototype-builtins
const has = (obj: {}, key: string): boolean => obj.hasOwnProperty(key);

// 计算表单项配置
// props 取值顺序是：typeMap.props -> item.props -> typeMap.getProps() -> item.getProps()
// 后面对象的同名属性会覆盖前面的对象的同名属性，使用的Object.assign实现
function computeFormItem(config: CustomConfig, form: {}, formInherit: {}) {
  // 返回结构体
  const item: CustomConfig = { ...config };

  item.on = item.on || {};
  item.nativeOn = item.nativeOn || {};

  // 表单控件的类型
  const { type } = item;

  const { typeMap, defaultType } = Form as FormType;

  // 对应到组件映射表
  const def: CustomConfig = typeMap[`${type}`] || typeMap[defaultType];

  item.component = item.component || def.component;
  // 继承为每个表单项的默认配置
  item.props = { ...formInherit, ...def.props, ...item.props };

  // 获取默认动态 props
  if (isFunction(def.getProps)) {
    Object.assign(item.props, (def.getProps as Function)({ ...form }, item));
  }
  // 获取动态 props
  if (isFunction(item.getProps)) {
    Object.assign(item.props, (item.getProps as Function)({ ...form }, item));
  }
  // 条件渲染
  // eslint-disable-next-line no-underscore-dangle
  const _if: boolean = item.ifRender ? item.ifRender({ ...form }, item) : true;
  item._ifRender = _if;

  // form-item 配置
  return item;
}

// 获取表单项的验证规则
function getDescriptor(fields: Array<CustomConfig>) {
  const descriptor: { [propName: string]: RuleItem[] } = {};
  fields.forEach(item => {
    const props = item.props || {};
    const rules = props.rules ? [...props.rules] : [];
    // 在 rules 中定义了 required
    const requiredInRules = rules.some(rule => has(rule, 'required'));
    // 在 props 中定义了 required
    const requiredInProps = item.required || props.required;
    if (requiredInProps && !requiredInRules) {
      rules.unshift({
        required: requiredInProps,
        message: `${item.label}不能为空`,
      });
    }

    if (rules.length > 0) {
      descriptor[item.key as string] = rules;
    }
  });

  return descriptor;
}

export { computeFormItem, getDescriptor };
