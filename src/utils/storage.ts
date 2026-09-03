export function getStoredJson<T>(key: string): T | null {
    try {
        const rawValue = localStorage.getItem(key);

        if(!rawValue) {
            return null;
        }

        return JSON.parse(rawValue) as T;
    } catch {
        return null;
    }
}