export function makeTable(data: any[][], thead: string | string[] = '', styles = '') {
  const tbody = data
    .map(row => {
      const cells = row.map(cell => `<td>${cell ?? ''}</td>`).join('');
      return `<tr>${cells}</tr>`;
    })
    .join('');

  thead = Array.isArray(thead)
    ? '<tr>' + thead.map(cell => `<th>${cell ?? ''}</th>`).join('') + '</tr>'
    : thead;

  return `<style>${styles}</style>
    <table>
      <thead>${thead}</thead>
      <tbody>${tbody}</tbody>
    </table>`;
}
