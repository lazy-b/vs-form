import { VueConstructor } from 'vue';
import { ErrorList } from 'async-validator';

export default {
  /**
   * 用来给 json form 进行个性化配置
   * @param Vue Vue 构造函数
   * @param options json 表单的配置参数
   */
  install(Vue: VueConstructor, options: FormOptions): void {
    // 给 Vue 添加一个全局属性，用来支持自定义扩展
    // eslint-disable-next-line
    (Vue as any).__form_config__ = { ...options };
  },
};

type FormOptions = {
  // 自定义的表单项映射关系
  typeMap?: object;
  // 自定义的错误校验提示
  showError?: (errors: ErrorList) => void;
};
