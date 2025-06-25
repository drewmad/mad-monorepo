declare global {
    interface Window {
        gtag: (
            command: 'config' | 'set' | 'event',
            targetId: string,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            config?: Record<string, any>
        ) => void;
    }
}

export { }; 