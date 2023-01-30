import Header from "../components/header.tsx";
import Heading from "../components/heading.tsx";
import NavBar from "../components/nav-bar.tsx";
import Section from "../components/section.tsx";

export default function Home() {
  return (
    <>
      <Header />
      <Heading />
      <Section>
        <NavBar />
        <p>
          Simple database of Czechia TLD domains which were registered in the
          past. You can search by its name to get its detail.
        </p>
        <p>
          Some entries contain{" "}
          <a
            href="https://archive.org"
            target="_blank"
            rel="noreferrer noopener"
          >
            archive.org
          </a>{" "}
          links. You can also request these links on demand but beware{" "}
          <em>capacity is limited</em>.
        </p>
        <p>
          Submissions are welcome if the domain is not already in the database.
          Each submission is reviewed by the administrator.
        </p>
        <hr />
        <h4>FAQ</h4>
        <dl>
          <dt>What is Czechia?</dt>
          <dd>
            It is a small country of approximately 10.5 million inhabitants
            located in central Europe. It's also called Czech Republic, formerly
            it was known as Czechoslovakia (pre 1993). Read more
            <a
              href="https://en.wikipedia.org/wiki/Czech_Republic"
              rel="noreferrer noopener"
              target="_blank"
            >
              here
            </a>
          </dd>
          <dt>What is the story behind TLD</dt>
          <dd>TBD</dd>
        </dl>
      </Section>
    </>
  );
}
