const csvTable = document.getElementById("csvTable");

// Specify the file name you want to read
const csvFileName = "VIC_LGA_unemployment.csv";

fetch(csvFileName)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch the CSV file.");
    }
    return response.text();
  })
  .then((csvText) => {
    const csvData = d3.csvParse(csvText);

    // Create the table header
    const tableHeader = Object.keys(csvData[0]);
    let tableHTML = '<thead><tr>';
    tableHeader.forEach((header) => {
      tableHTML += `<th>${header}</th>`;
    });
    tableHTML += '</tr></thead>';

    // Create the table rows
    tableHTML += '<tbody>';
    csvData.forEach((row) => {
      tableHTML += '<tr>';
      tableHeader.forEach((header) => {
        tableHTML += `<td>${row[header]}</td>`;
      });
      tableHTML += '</tr>';
    });
    tableHTML += '</tbody>';

    // Set the table content
    csvTable.innerHTML = tableHTML;
  })
  .catch((error) => {
    console.error(error);
  });
