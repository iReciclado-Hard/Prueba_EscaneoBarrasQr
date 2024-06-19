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

// Función para encontrar datos del producto por código
async function findProductData(code) {
    const data = await fetchSheetData();
    if (!data) return null;

    const header = data[0]; // La primera fila se asume que es el encabezado de las columnas
    const rows = data.slice(1); // Las filas de datos, omitiendo el encabezado

    for (const row of rows) {
        const rowData = {};
        row.forEach((cell, index) => {
            rowData[header[index]] = cell; // Mapea las celdas de cada fila a sus respectivos nombres de columna
        });

        // Depuración: Mostrar el código escaneado y el código de la fila
        console.log(`Comparando código escaneado: ${code} con código en fila: ${rowData['Código']}`);

        if (rowData['Código'] === code) { // Busca en la columna "Código"
            console.log('Producto encontrado:', rowData); // Añade esta línea para depurar
            return rowData; // Devuelve la fila completa como un objeto si encuentra el código
        }
    }

    console.log('Producto no encontrado para el código:', code); // Añade esta línea para depurar
    return null; // Devuelve null si no se encuentra el código
}
