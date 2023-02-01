import type { Domain } from "../models/index.ts";

export default function ({ list }: { list: Domain[] }) {
  return (
    <table>
      <thead>
        <tr>
          <td>ID</td>
          <td>URL</td>
          <td>date</td>
        </tr>
      </thead>
      {list.map(({ id, value, createdAt }) => (
        <tr key={id}>
          <td>{id}</td>
          <td>{value}</td>
          <td>{createdAt}</td>
        </tr>
      ))}
    </table>
  );
}
