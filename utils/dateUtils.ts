// Formatear la fecha en un formato agradable
export const formatDate = (timestamp: Date) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
};
// Formatear el timestamp Unix en un formato agradable
export const formatUnixTimestamp = (unixTimestamp: number) => {
    const date = new Date(unixTimestamp * 1000); // Multiplicamos por 1000 porque el timestamp Unix está en segundos
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
};

// Formatear la fecha en dd-mm-aaaa h:min
export const formatDateToString = (date: Date, includeTime: boolean = true) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    const finalDateString = `${day}-${month}-${year}`;

    return includeTime ? `${finalDateString} ${hours}:${minutes}` : finalDateString;
};
