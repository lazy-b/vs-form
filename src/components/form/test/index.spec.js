import { mount } from '@vue/test-utils';
import Form from '..';
// import { mount, later } from '../../../test/utils';
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
  expect(wrapper.contains('.alreadyLeave')).toBe(true);
  expect(wrapper).toMatchSnapshot();
});
