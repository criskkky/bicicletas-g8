export function isAdmin(role) {
    if (!role) {
        console.warn("Rol no proporcionado para la validación de administrador.");
        return false;
    }
    return role === 'administrador';
}

export function formatRUT(value) {
    // Remover puntos, guiones y caracteres no numéricos
    const cleaned = value.replace(/[^0-9kK]/g, "");

    // Separar dígito verificador
    const rutBody = cleaned.slice(0, -1);
    const verifier = cleaned.slice(-1);

    // Aplicar formato con puntos y guión
    const formatted = rutBody
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".") // Inserta puntos cada 3 dígitos
        .concat(verifier ? `-${verifier}` : ""); // Agrega guión y dígito verificador si existe

    return formatted.toUpperCase(); // Retorna en mayúscula por consistencia
}
