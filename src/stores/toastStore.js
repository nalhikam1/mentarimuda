import { writable } from 'svelte/store';

export const toasts = writable([]);

export const addToast = (message, type = 'success', duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    toasts.update((all) => [{ id, message, type }, ...all]);

    if (duration) {
        setTimeout(() => {
            removeToast(id);
        }, duration);
    }
};

export const removeToast = (id) => {
    toasts.update((all) => all.filter((t) => t.id !== id));
};
