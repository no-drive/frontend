import { shallowMount } from '@vue/test-utils';
import Register from '../../src/components/register.vue'; // Ajusta la ruta según tu estructura de archivos
import { describe, it, expect } from 'vitest';
const wrapper = shallowMount(Register);

describe('Componente de registro', () => {

    it('Validar el formato del input email', async () => {
        console.log(wrapper.componentVM.validPwd);

        // Entrada de un correo electrónico válido
        await wrapper.find('#inputCorreo').setValue('test@example.com');
        expect(wrapper.componentVM.validcorreo).toBe(true);

        // Entrada de un correo electrónico inválido
        await wrapper.find('#inputCorreo').setValue('invalid-email');
        expect(wrapper.componentVM.validcorreo).toBe(false);
    });
    it('Validar el tamaño del campo nombre de usuario', async () => {

        // Entrada de un nombre de usuario con menos de 8 caracteres
        await wrapper.find('#inputUser').setValue('user');
        expect(wrapper.componentVM.validUsername).toBe(true);

        // Entrada de un nombre de usuario con 8 caracteres (el mínimo permitido)
        await wrapper.find('#inputUser').setValue('username');
        expect(wrapper.componentVM.validUsername).toBe(true);

        // Entrada de un nombre de usuario con más de 8 caracteres
        await wrapper.find('#inputUser').setValue('usernameLongerThan8Characters');
        expect(wrapper.componentVM.validUsername).toBe(false);
    });

    it('Validar el tamaño de las contraseñas y que sean iguales', async () => {

        // Entrada de una contraseña con menos de 4 caracteres
        await wrapper.find('#inputPass').setValue('pwd');
        await wrapper.find('#inputNewPass').setValue('pwd');
        expect(wrapper.componentVM.validPwd).toBe(false);

        // Entrada de una contraseña que no coincide con la repetición
        await wrapper.find('#inputPass').setValue('password');
        await wrapper.find('#inputNewPass').setValue('passwordMismatch');
        expect(wrapper.componentVM.validPwd).toBe(false);

        // Entrada de una contraseña con 4 caracteres (el mínimo permitido)
        await wrapper.find('#inputPass').setValue('pwd');
        await wrapper.find('#inputNewPass').setValue('pwd');
        expect(wrapper.componentVM.validPwd).toBe(false);

        // Entrada de una contraseña con más de 16 caracteres
        await wrapper.find('#inputPass').setValue('passwordLongerThan16Characters');
        await wrapper.find('#inputNewPass').setValue('passwordLongerThan16Characters');
        expect(wrapper.componentVM.validPwd).toBe(false);

        // Entrada de una contraseña que coincide con la repetición
        await wrapper.find('#inputPass').setValue('password');
        await wrapper.find('#inputNewPass').setValue('password');
        expect(wrapper.componentVM.validPwd).toBe(true);
    });
});
