import React from 'react';
import moment from 'moment';

const AttendanceHistory = ({ attendance }) => {
  return (
    <div>
      <h3>Attendance History</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Check-in Time</th>
            <th>Check-out Time</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((log) => (
            <tr key={log._id}>
              <td>{moment(log.checkInTime).format('YYYY-MM-DD')}</td>
              <td>{moment(log.checkInTime).format('HH:mm:ss')}</td>
              <td>{log.checkOutTime ? moment(log.checkOutTime).format('HH:mm:ss') : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceHistory;