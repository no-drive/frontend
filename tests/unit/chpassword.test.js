import { shallowMount } from '@vue/test-utils';
import CambiarContraseña from '../../src/components/chpassword.vue'; // Ajusta la ruta según tu estructura de archivos
import { describe, it, expect } from 'vitest';
describe('Componente cambiar contraseña', () => {
    it('renderiza el formulario para cambiar la contraseña', async () => {
        const wrapper = shallowMount(CambiarContraseña);

        expect(wrapper.find('form').exists()).toBe(true);
        expect(wrapper.find('#inputPass').exists()).toBe(true);
        expect(wrapper.find('#inputNewPass').exists()).toBe(true);
        expect(wrapper.find('#inputRepeatPass').exists()).toBe(true);
        expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
    });

    it('valida el formato de la contraseña', async () => {
        const wrapper = shallowMount(CambiarContraseña);

        // Simula la entrada de una contraseña válida
        await wrapper.find('#inputPass').setValue('password123');

        // Verifica si la contraseña es válida
        expect(wrapper.componentVM.validPwdPASS).toBe(false);
    });

    it('valida que la nueva contraseña y su repetición coincidan', async () => {
        const wrapper = shallowMount(CambiarContraseña);

        // Simula la entrada de una nueva contraseña
        await wrapper.find('#inputNewPass').setValue('newpassword123');
        await wrapper.find('#inputRepeatPass').setValue('differentpassword123');

        // Verifica si se muestra un mensaje de error cuando las contraseñas no coinciden
        expect(wrapper.find('#alertpwdREPEAT').isVisible()).toBe(true);
    });
});
