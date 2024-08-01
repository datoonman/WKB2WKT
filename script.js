document.getElementById('uploadForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const fileInput = document.getElementById('fileInput');
    const columnName = document.getElementById('columnName').value;

    if (!fileInput.files.length) {
        alert('Please upload a file.');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const csv = event.target.result;
        convertCsv(csv, columnName);
    };

    reader.readAsText(file);
});

function convertCsv(csv, columnName) {
    const rows = csv.split('\n');
    const headers = rows[0].split(',');

    const columnIndex = headers.indexOf(columnName);
    if (columnIndex === -1) {
        alert(`Column "${columnName}" not found in the CSV file.`);
        return;
    }

    const convertedRows = [headers.join(',')];

    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].split(',');
        if (cells.length > 1) {
            const wkbHex = cells[columnIndex];
            if (wkbHex) {
                try {
                    const wkt = wellknown.stringify(wkbHex);
                    cells[columnIndex] = wkt;
                } catch (e) {
                    console.error(`Error converting WKB to WKT: ${e}`);
                }
            }
            convertedRows.push(cells.join(','));
        }
    }

    const convertedCsv = convertedRows.join('\n');
    downloadConvertedFile(convertedCsv);
}

function downloadConvertedFile(csv) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted_wkt.csv';
    a.textContent = 'Download converted file';
    document.getElementById('downloadLink').innerHTML = '';
    document.getElementById('downloadLink').appendChild(a);
}
