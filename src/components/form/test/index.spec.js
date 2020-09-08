import { mount } from '@vue/test-utils';
import Form from '@/components/form';
// import { mount, later } from '../../../test/utils';
import FormDemo from '@/components/form/demo';
import getFields from './baseConfig';

test('fields Config', () => {
  const wrapper = mount(Form, {
    propsData: {
      fieldsConfig: getFields(),
    },
  });
  expect(wrapper).toMatchSnapshot();
});

test('fields Config slot', () => {
  const wrapper = mount(Form, {
    propsData: {
      fieldsConfig: getFields(),
    },
    slots: {
      alreadyLeave: '<div class="alreadyLeave">1</div>',
    },
  });
  expect(wrapper.get('.alreadyLeave'));
  expect(wrapper).toMatchSnapshot();
});

test('Form demo render', () => {
  const wrapper = mount(FormDemo);
  expect(wrapper.get('.test'));
  expect(wrapper).toMatchSnapshot();
});
