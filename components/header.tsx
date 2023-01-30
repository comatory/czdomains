import { asset, Head } from "$fresh/runtime.ts";

export default function Header() {
  return (
    <Head>
      <title>czdomains</title>
      <link rel="stylesheet" href={asset("/styles/main.css")} />
    </Head>
  );
}
