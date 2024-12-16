export function isAdmin(role) {
    if (!role) {
        console.warn("Rol no proporcionado para la validación de administrador.");
        return false;
    }
    return role === 'administrador';
}