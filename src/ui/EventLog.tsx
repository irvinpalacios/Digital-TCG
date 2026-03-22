import React from 'react';

type LogEntryType = 'turn' | 'attack' | 'death' | 'evolution' | 'resource' | 'cardplay' | 'move' | 'warning';

function classifyEntry(text: string): LogEntryType {
  if (text.startsWith('Turn') || text.includes('turn begins')) return 'turn';
  if (text.includes('attacked') || text.includes('damage')) return 'attack';
  if (text.includes('destroyed') || text.includes('died')) return 'death';
  if (text.includes('evolved')) return 'evolution';
  if (text.includes('Charge') || text.includes('drew') || text.includes('Energy')) return 'resource';
  if (text.includes('played') || text.includes('equipped') || text.includes('sacrificed') || text.includes('used')) return 'cardplay';
  if (text.includes('moved')) return 'move';
  if (text.includes('⚠')) return 'warning';
  return 'attack';
}

type EntryStyle = React.CSSProperties;

function getEntryStyle(type: LogEntryType): EntryStyle {
  switch (type) {
    case 'turn':
      return { color: '#666', fontStyle: 'italic', borderLeft: '2px solid #666', marginTop: 4 };
    case 'attack':
      return { color: '#eee', borderLeft: '2px solid #555' };
    case 'death':
      return { color: '#c04040', borderLeft: '2px solid #c04040' };
    case 'evolution':
      return {
        color: '#f0c040',
        fontWeight: 'bold',
        fontSize: 13,
        borderLeft: '3px solid #f0c040',
        background: 'rgba(240, 192, 64, 0.06)',
        paddingLeft: 6,
        paddingTop: 2,
        paddingBottom: 2,
      };
    case 'resource':
      return { color: '#a0c040', borderLeft: '2px solid #a0c040' };
    case 'cardplay':
      return { color: '#4a8aff', borderLeft: '2px solid #4a8aff' };
    case 'move':
      return { color: '#aaa', borderLeft: '2px solid #aaa' };
    case 'warning':
      return { color: '#f08040', fontStyle: 'italic', borderLeft: '2px solid #f08040' };
  }
}

type EventLogProps = {
  log: string[];
};

export function EventLog({ log }: EventLogProps) {
  const entries = log.slice(-8);

  return (
    <div
      style={{
        height: 200,
        overflowY: 'scroll',
        border: '1px solid #444',
        padding: '6px 8px',
        fontSize: 12,
        fontFamily: 'monospace',
        background: '#181818',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      {entries.map((entry, i) => {
        const type = classifyEntry(entry);
        const style = getEntryStyle(type);
        return (
          <div key={i} style={{ paddingLeft: 4, marginBottom: 1, ...style }}>
            {entry}
          </div>
        );
      })}
    </div>
  );
}
