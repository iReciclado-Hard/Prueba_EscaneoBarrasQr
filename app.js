document.addEventListener('DOMContentLoaded', () => {
    const codeReader = new ZXing.BrowserMultiFormatReader();
    const videoElement = document.getElementById('video-preview');
    const beepSound = document.getElementById('beep-sound');
    const resultElement = document.getElementById('result');
    let scanning = false;

    document.getElementById('startScan').addEventListener('click', async () => {
        if (!scanning) {
            resultElement.innerText = "Escaneando...";
            resultElement.style.display = 'block';

            try {
                const cameras = await codeReader.listVideoInputDevices();
                if (cameras.length > 0) {
                    codeReader.decodeFromVideoDevice(cameras[0].deviceId, 'video-preview', (result, err) => {
                        if (result) {
                            beepSound.play();
                            const scannedCode = result.text;
                            resultElement.innerText = `Último Código Escaneado: ${scannedCode}`;
                            displayProductData(scannedCode);
                            codeReader.reset();
                            scanning = false;
                        } else if (err && !(err instanceof ZXing.NotFoundException)) {
                            console.error('Error al escanear el código:', err);
                        }
                    });
                    scanning = true;
                } else {
                    console.error('No se encontraron cámaras.');
                }
            } catch (err) {
                console.error('Error al acceder a la cámara:', err);
                alert('Error al acceder a la cámara. Por favor, verifica los permisos y vuelve a intentarlo.');
            }
        }
    });

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
            console.log('Datos obtenidos de la hoja:', data.values); // Añade esta línea para depurar
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

            if (rowData['BarCode'] === code) { // Busca en la columna "Código"
                console.log('Producto encontrado:', rowData); // Añade esta línea para depurar
                return rowData; // Devuelve la fila completa como un objeto si encuentra el código
            }
        }
        console.log('Producto no encontrado para el código:', code); // Añade esta línea para depurar
        return null; // Devuelve null si no se encuentra el código
    }

    // Función para mostrar los datos del producto en la página
    function displayProductData(code) {
        findProductData(code).then(productData => {
            if (productData) {
                const productContainer = document.getElementById('result');
                productContainer.innerHTML = `
                    <p><strong>Nombre del Artículo:</strong> ${productData['Nombre del Artículo']}</p>
                    <p><strong>Precio:</strong> ${productData['Precio']}</p>
                    <p class="sugerido"><strong>Sugerido:</strong> ${productData['Sugerido']}</p>
                `;
            } else {
                alert('Producto no encontrado.');
            }
        }).catch(err => {
            console.error('Error al buscar el producto:', err);
        });
    }
});
