import React from 'react';
import { json2csv } from 'json-2-csv'; // You might need a library for CSV conversion

const ExportButton = ({ data }) => {
  const handleExportCSV = async () => {
    try {
      const csv = await json2csv(data, {
        fields: ['userEmail', 'checkInTime', 'checkOutTime'], // Specify the fields to export
      });

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', 'attendance.csv');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      // Handle the error appropriately (e.g., display an error message to the user)
    }
  };

  const handleExportJSON = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'attendance.json');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div>
      <button onClick={handleExportCSV}>Export to CSV</button>
      <button onClick={handleExportJSON}>Export to JSON</button>
    </div>
  );
};

export default ExportButton;
