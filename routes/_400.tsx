import { ErrorPageProps } from "$fresh/server.ts";

export default function ({ error }: ErrorPageProps) {
  return (
    <>
      <h2>Bad request</h2>
      <p>
        <pre>{error?.toString()}</pre>
      </p>
    </>
  );
}
