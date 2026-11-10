export function clearEmptyParams(params) {
    const qs = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            qs.set(key, value);
        }
    });
    return qs.toString();
}