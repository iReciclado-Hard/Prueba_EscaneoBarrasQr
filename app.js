// Función para obtener datos de Google Sheets
async function fetchSheetData() {
    const sheetId = '1OyOanAl_4iX9iOZcAjdbkpOZ4NdeU20dgicUSuxxwds'; // Reemplaza con el ID de tu hoja de Google
    const sheetName = 'Hoja1'; // Reemplaza con el nombre de la hoja
    const apiKey = 'AIzaSyDm6d6BmC8Kco00EspVcmpUHIzxu0K5vG4'; // Reemplaza con tu clave de API de Google
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error al obtener los datos');
        const data = await response.json();
        
        // Depuración: Mostrar los datos obtenidos en la consola
        console.log('Datos obtenidos de la hoja:', data.values);
        
        return data.values; // Devuelve los valores de la hoja de cálculo
    } catch (error) {
        console.error('Error fetching sheet data:', error);
        return null;
    }
}
