import Header from "../components/header.tsx";
import Heading from "../components/heading.tsx";
import NavBar from "../components/nav-bar.tsx";
import Section from "../components/section.tsx";

export default function Browse() {
  return (
    <>
      <Header />
      <Heading />
      <Section>
        <NavBar />
        <h4>Browse</h4>
      </Section>
    </>
  );
}
