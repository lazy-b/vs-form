import { pick, noop, cloneDeep } from 'lodash';
import Schema from 'async-validator';
import { computeFormItem, getDescriptor } from './utils';

const jsonCopy = (val) => JSON.parse(JSON.stringify(val));
const { stringify } = JSON;

const CLASS_PREFEX = 'mform';

// TODO: ui.show = false 隐藏但是保留该值

const Form = {
  created() {
    this._setParentComponents();
  },

  props: {
    // 表单值
    value: {
      type: Object,
      default() {
        return {};
      },
    },

    // 表单配置项
    fieldsConfig: {
      type: Array,
      default() {
        return [];
      },
    },
  },

  data() {
    return {
      form: {},

      fields: [],

      valueChangeCount: 0,
    };
  },

  computed: {
    // 校验器
    validator() {
      const { fields } = this;
      const descriptor = getDescriptor(fields);
      const validator = new Schema(descriptor);

      return validator;
    },
    // 暴露给外界的表单值
    formValue() {
      const { fields, form } = this;
      const _keys = fields.map((item) => item.key).filter((key) => key);
      const target = pick(form, _keys);

      return target;
    },
  },

  watch: {
    // value 改变了就给 form 赋值，只更新
    value: {
      handler(val) {
        // 由于 valueChangeCount 标记的作用，只有主动对 value 赋值才触发后面的逻辑
        if (this.valueChangeCount > 0) {
          this.valueChangeCount--;
          return;
        }

        const value = cloneDeep(val || {});
        const { form } = this;
        // 直接替换就行
        this.form = { ...form, ...value };
      },
      immediate: true,
      deep: true,
    },
    // form 改变了，可能触发了联动规则，重新计算各项的 _ifRender
    form: {
      handler() {
        this._updateFields();
      },
      immediate: true,
      deep: true,
    },
    // formValue 改变了 则派发一次 input 事件 并计数，
    // 防止和 value 的watch 形成死循环
    formValue: {
      handler(val, oldValue) {
        const same = stringify(val) === stringify(oldValue);
        if (same) return;
        this.valueChangeCount++;
        this.$emit('input', val);
      },
      // immediate: true,
      deep: true,
    },
    // fieldsConfig 配置发生了改变则重新计算 fields
    fieldsConfig: {
      handler() {
        this._updateFields();
      },
      immediate: true,
      deep: true,
    },
  },

  methods: {
    /** --------------- 说明 -------------  */
    // 添加对外暴露校验方法
    // noTips 校验未通过的时候不弹提示 toast
    validate(noTips) {
      return new Promise((resolve, reject) => {
        this._validateFields((err, value) => {
          if (!err) {
            resolve(value);
          } else {
            reject(err);
          }
        }, noTips);
      });
    },

    // 校验表单
    _validateFields(cb = noop, noTips) {
      this.validator.validate(this.value, (errors) => {
        if (!noTips && errors && errors.length > 0) {
          Form.showError(errors);
        }
        cb(errors, { ...this.value });
      });
    },

    // 重置表单
    reset(val = {}) {
      this.form = { ...val };
    },

    // 提供给外部强制刷新列表的方法
    refreshUI(force) {
      this._updateFields(force);
    },

    // 更新表单项的配置列表
    _updateFields(force) {
      const { fieldsConfig, form } = this;

      const cForm = jsonCopy(form);

      let fields = fieldsConfig.map((config) => computeFormItem(config, cForm));

      // 过滤不符合条件的项
      fields = fields.filter((item) => item._ifRender);

      if (!force && stringify(this.fields) === stringify(fields)) {
        return;
      }

      this.fields = fields;
    },

    /**
     * 渲染表单的一个元素
     * @param field 当前元素的配置信息
     * @param defProps 其他需要所有元素继承的属性
     */
    _renderItem(field, defProps) {
      const { component, key, itemKey, label, on = {}, nativeOn = {}, props, others } = field;
      const { name } = props;
      let item = null;
      const Tag = component || 'div';

      const events = {};
      switch (component) {
        case 'slot':
          item = this.$slots[name || key];
          break;

        default:
          if (Object.keys(nativeOn).length > 0) {
            // 直接赋值会导致死循环
            events.nativeOn = { ...nativeOn };
          }
          if (Object.keys(on).length > 0) {
            // 直接赋值会导致死循环
            events.on = { ...on };
          }
          item = (
            <Tag
              key={itemKey || key}
              label={label}
              {...others}
              props={{ ...defProps, ...props }}
              {...events}
              // on={{ ...on }}
              // nativeOn={{ ...nativeOn }}
              vModel={this.form[key]}
            />
          );
          break;
      }

      return item;
    },

    // 将父组件注册的局部组件也注册进来，方便用户使用自定义组件
    _setParentComponents() {
      // 使得自定义组件能够在父组件注册
      const currentComponents = this.$options.components;
      const parent = this._findParent();
      const parentComponents = parent.$options.components;
      Object.keys(parentComponents).forEach((key) => {
        if (!(key in currentComponents)) {
          currentComponents[key] = parentComponents[key];
        }
      });
    },
    // 查找当前组件配置文件所在的组件，也就是当前组件的父组件
    _findParent() {
      let p = this.$parent;
      const { fieldsConfig } = this;
      // 如果某个 vm 对象定义的数据中，有属性值和传入的 fieldsConfig 为同一地址
      // 则该 vm 为调用当前组件的父组件
      const isTarget = (t) => {
        const data = t.$data;
        return Object.keys(data).some((k) => data[k] === fieldsConfig);
      };

      while (p && !isTarget(p)) {
        p = p.$parent;
      }

      return p;
    },
  },

  render() {
    const { fields, _renderItem, $attrs = {} } = this;
    const { disabled, readonly } = $attrs;
    const others = { disabled, readonly };
    const items = fields.map((field) => _renderItem(field, others));

    return (
      <div class={`${CLASS_PREFEX}`} {...$attrs}>
        {items}
      </div>
    );
  },
};

Form.typeMap = {};
Form.setTypeMap = (_typeMap = {}) => {
  Object.assign(Form.typeMap, _typeMap);
};
Form.defaultType = 'input';
Form.showError = noop;

export default Form;
