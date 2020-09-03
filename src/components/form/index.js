import { pick, keys, noop, isFunction, cloneDeep } from 'lodash';
import Schema from 'async-validator';
import { computeFormItem, getDescriptor } from './utils';
import typeMap from './typeMap';

const jsonCopy = val => JSON.parse(JSON.stringify(val));
const { stringify } = JSON;

const CLASS_PREFEX = 'mform';

let start = 0;
// 添加独一无二的表单项的key值
const setItemKey = (arr = [], map) => {
  return arr.map((item, i) => {
    const _key = item.key || i;
    const _componentKey = map[_key];
    if (_componentKey) {
      // eslint-disable-next-line
      item.componentKey = map[_key];
    } else {
      // eslint-disable-next-line
      map[_key] = `${_key}_${start++}`;
      // eslint-disable-next-line
      item.componentKey = map[_key];
    }

    return item;
  });
};

let showError = null;

const Form = {
  beforeCreate() {
    this.fieldsKeyMap = {};

    // 使得自定义组件能够在父组件注册
    const currentComponents = this.$options.components;
    const parentComponents = this.$parent.$options.components;
    Object.keys(parentComponents).forEach(key => {
      if (!(key in currentComponents)) {
        currentComponents[key] = parentComponents[key];
      }
    });
  },

  created() {
    // 手动监听主要是为了保证执行的顺序
    const update = () => this._updateFields();
    const unWatchA = this.$watch('assistStr', update, { immediate: true });
    const unWatchC = this.$watch('fieldsConfig', update);
    // formValue 的取值需要等 _updateFields 运行后才能正确取值
    const unWatchF = this.$watch(
      'formValue',
      (val, oldValue) => {
        const same = stringify(val) === stringify(oldValue);
        if (same) return;

        this.$emit('input', val);
      },
      { immediate: true, deep: true }
    );

    this.$once('hook:beforeDestroy', function cb() {
      unWatchA && unWatchA();
      unWatchC && unWatchC();
      unWatchF && unWatchF();
    });
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

    // 给所有表单传递的属性值，例如禁用状态
    formInherit: Object,

    // 自定义取值函数
    // 入参为：当前 form 的值，当前配置文件中应该展示的组件的key列表以及根据该keys默认得到的表单值
    getValue: Function,

    // 自定义赋值函数
    setValue: Function,
  },

  data() {
    return {
      form: {},

      fields: [],
    };
  },

  computed: {
    // 辅助动态计算 fields
    assistStr() {
      const {
        form,
        formInherit,
        $attrs: { disabled, readonly },
      } = this;
      return stringify({ form, formInherit, disabled, readonly });
    },
    validator() {
      const { fields } = this;
      const descriptor = getDescriptor(fields);
      const validator = new Schema(descriptor);

      return validator;
    },
    // 暴露给外界的表单值
    formValue() {
      const { fields, form } = this;
      const _keys = fields.map(item => item.key).filter(key => key);
      let target = pick(form, _keys);

      // 如果用户定义了自定义获取值的方法
      const { getValue } = this;
      if (getValue && isFunction(getValue)) {
        target = getValue(this.form, _keys, cloneDeep(target));
      }

      return target;
    },
  },

  watch: {
    // 给 form 赋值，只更新
    value: {
      handler(val) {
        // 如果用户定义了自定义设置值的方法，用该方法将 value 先进行转换
        const { setValue } = this;
        let value = cloneDeep(val);
        if (setValue && isFunction(setValue)) {
          value = setValue(value);
        }

        const { form } = this;
        keys(value).forEach(key => {
          if (key in form) {
            // 用户对form里面的引用值进行循环引用，可能导致死循环
            const noSet =
              form[key] === value[key] ||
              stringify(form[key]) === stringify(value[key]);
            if (noSet) return;
            form[key] = value[key];
          } else {
            this.$set(form, key, value[key]);
          }
        });
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
        this.validateFields((err, value) => {
          if (!err) {
            resolve(value);
          } else {
            reject(err);
          }
        }, noTips);
      });
    },

    validateFields(cb = noop, noTips) {
      this.validator.validate(this.value, errors => {
        if (!noTips && errors && errors.length > 0) {
          if (!showError) {
            showError = Form.showError || noop;
          }

          showError(errors);
        }
        cb(errors, { ...this.value });
      });
    },

    // 重置表单
    reset(val = {}) {
      this.form = { ...val };
    },

    // 更新表单项的配置列表
    _updateFields() {
      const {
        fieldsConfig,
        form,
        formInherit,
        $attrs: { disabled, readonly },
      } = this;

      // 兼容直接给表单传禁用或者只读
      const cOthers = jsonCopy({ ...formInherit, disabled, readonly });
      const cForm = jsonCopy(form);

      // TODO:
      let fields = setItemKey(fieldsConfig, this.fieldsKeyMap);
      fields = fields.map(config => computeFormItem(config, cForm, cOthers));

      // 过滤不符合条件的项
      fields = fields.filter(item => item._ifRender);

      this.fields = fields;
    },

    /**
     * 渲染表单的一个元素
     * @param field 当前元素的配置信息
     * @param i 当前元素在配置列表中的索引
     */
    renderItem(field) {
      const {
        component,
        key,
        componentKey,
        label,
        on = {},
        nativeOn = {},
        props,
      } = field;
      const { name } = props;
      let item = null;
      const Tag = component || 'div';

      switch (component) {
        case 'slot':
          item = this.$slots[name || key];
          break;
        case 'separate':
          // TODO:
          item = (
            <div key={componentKey} class={`${CLASS_PREFEX}-separate`}></div>
          );
          break;

        default:
          item = (
            <Tag
              key={componentKey}
              label={label}
              props={{ ...props }}
              on={{ ...on }}
              nativeOn={{ ...nativeOn }}
              vModel={this.form[key]}
            />
          );
          break;
      }

      return item;
    },
  },

  render() {
    const { fields, renderItem, $attrs = {} } = this;
    const items = fields.map((field, i) => renderItem(field, i));
    const others = { ...$attrs };
    delete others.formInherit;

    return (
      <div class={`${CLASS_PREFEX}`} {...others}>
        {items}
      </div>
    );
  },
};

Form.typeMap = { ...typeMap };
Form.setTypeMap = (_typeMap = {}) => {
  Object.assign(Form.typeMap, _typeMap);
};
Form.defaultType = 'input';
Form.showError = console.log;

export default Form;
