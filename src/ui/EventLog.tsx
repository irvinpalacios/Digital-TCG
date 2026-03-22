import React from 'react';

type EventLogProps = {
  log: string[];
};

export function EventLog({ log }: EventLogProps) {
  const entries = log.slice(-8);

  return (
    <div
      style={{
        height: 160,
        overflowY: 'scroll',
        border: '1px solid #ccc',
        padding: '6px 8px',
        fontSize: 12,
        fontFamily: 'monospace',
        background: '#fafafa',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      {entries.map((entry, i) => (
        <div key={i}>{entry}</div>
      ))}
    </div>
  );
}
