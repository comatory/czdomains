export default function NavBar() {
  return (
    <>
      <hr />
      <nav>
        <ul class="navigation-list">
          <li class="navigation-list__item">
            <a href="/">Home</a>
          </li>
          <li class="navigation-list__item">
            <a href="/search">Search</a>
          </li>
          <li class="navigation-list__item">
            <a href="/browse/all">Browse</a>
          </li>
          <li class="navigation-list__item">
            <a href="/submit">Submit</a>
          </li>
        </ul>
      </nav>
      <hr />
    </>
  );
}
