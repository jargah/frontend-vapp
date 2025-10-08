// Permite: letras [A-Z a-z], números [0-9], espacios y el carácter @
export default {
    mounted(el, binding) {
        // Para Vuetify v-text-field u otros wrappers: busca el input real
        const input = el.matches('input,textarea') ? el : el.querySelector('input,textarea');
        if (!input) return;

        const max = binding.value?.max ?? null;
        let composing = false; // IME (teclados chinos/japoneses/etc.)

        const sanitize = (val) => {
            let clean = (val || '').replace(/[^a-zA-Z0-9 @]/g, ''); // <- permite @ y espacio
            if (typeof max === 'number') clean = clean.slice(0, max);
            return clean;
        };

        const onInput = (e) => {
            if (composing) return;
            const clean = sanitize(e.target.value);
            if (e.target.value !== clean) {
                const pos = e.target.selectionStart || clean.length;
                e.target.value = clean;
                // Notificar a Vue
                e.target.dispatchEvent(new Event('input'));
                // Restaurar caret
                requestAnimationFrame(() => {
                    e.target.setSelectionRange(pos, pos);
                });
            }
        };

        const onPaste = (e) => {
            e.preventDefault();
            const text = (e.clipboardData || window.clipboardData).getData('text');
            const clean = sanitize(text);
            // Inserta en la posición del caret
            const start = input.selectionStart;
            const end = input.selectionEnd;
            const next = (input.value || '').slice(0, start) + clean + (input.value || '').slice(end);
            input.value = sanitize(next);
            input.dispatchEvent(new Event('input'));
            const newPos = start + clean.length;
            requestAnimationFrame(() => input.setSelectionRange(newPos, newPos));
        };

        const onCompositionStart = () => (composing = true);
        const onCompositionEnd = (e) => {
            composing = false;
            onInput(e);
        };

        input.addEventListener('input', onInput);
        input.addEventListener('paste', onPaste);
        input.addEventListener('compositionstart', onCompositionStart);
        input.addEventListener('compositionend', onCompositionEnd);

        // Limpieza
        el._alphanumSpacesAtDestroy = () => {
            input.removeEventListener('input', onInput);
            input.removeEventListener('paste', onPaste);
            input.removeEventListener('compositionstart', onCompositionStart);
            input.removeEventListener('compositionend', onCompositionEnd);
        };
    },
    unmounted(el) {
        el._alphanumSpacesAtDestroy?.();
        delete el._alphanumSpacesAtDestroy;
    },
};
