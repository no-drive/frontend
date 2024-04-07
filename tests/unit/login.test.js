import { shallowMount } from '@vue/test-utils';
import Login from '../../src/components/login.vue'; // Ajusta la ruta según tu estructura de archivos
import { describe, it, expect } from 'vitest';
describe('Login.vue', () => {
  it('Cargar los formularios', async () => {
    // Monta el componente
    const wrapper = shallowMount(Login);

    // Verifica si se renderiza el formulario de inicio de sesión
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('input[type="text"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });
 
  it('validar el formato del input correo', async () => {
    const wrapper = shallowMount(Login);

    // Simula la entrada de un correo electrónico válido
    await wrapper.find('#inputCorreo').setValue('test@example.com');

    // Verifica si el correo electrónico es válido
    expect(wrapper.componentVM.validcorreo).toBe(true);
  });

  it('validar el formato del input contraseña', async () => {
    const wrapper = shallowMount(Login);

    // Simula la entrada de una contraseña válida
    await wrapper.find('#inputPass').setValue('password123');

    // Verifica si la contraseña es válida
    expect(wrapper.componentVM.validPwd).toBe(true);
  });


  it('Visualizar el cambio de visibilidad del campo contraseña', async () => {
    // Monta el componente
    const wrapper = shallowMount(Login);

    // Verifica la visibilidad inicial del campo de contraseña
    expect(wrapper.find('input[type="password"]').element.type).toBe('password');

    // Haz clic en el botón de alternar visibilidad de contraseña
    await wrapper.find('#btnView').trigger('click');

    // Verifica si la visibilidad del campo de contraseña ha cambiado
    expect(wrapper.find('input[type="text"]').element.type).toBe('text');
  });

});
