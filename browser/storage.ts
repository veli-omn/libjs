export const STORAGE = {
    local: {
        get(name: string): unknown {
            const item = localStorage.getItem(name);

            try {
                return item ? JSON.parse(item) : null;
            } catch {
                return item;
            }
        },

        set(name: string, data: any): void {
            try {
                localStorage.setItem(name, JSON.stringify(data));
            } catch {
                localStorage.setItem(name, data);
            }
        },

        remove: (name: string): void => localStorage.removeItem(name)
    },

    session: {
        get(name: string): unknown {
            const item = sessionStorage.getItem(name);

            try {
                return item ? JSON.parse(item) : null;
            } catch {
                return item;
            }
        },

        set(name: string, data: any): void {
            try {
                sessionStorage.setItem(name, JSON.stringify(data));
            } catch {
                sessionStorage.setItem(name, data);
            }
        },

        remove: (name:string): void => sessionStorage.removeItem(name)
    }
}