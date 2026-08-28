/** Hero: the cloud-shaped WRITER AUTUMN title and the one-line pitch. */
function HeaderSection() {
  return (
    <header className="c2-header">
      <div className="c2-title-cloud">
        <h1>
          WRITER
          <br />
          AUTUMN
        </h1>
        <span className="c2-subtitle">уютная осень со своей книгой</span>
      </div>

      <div className="c2-header-bottom">
        <p className="c2-header-lead">
          Осенний писательский интенсив, где мы НЕ пишем черновик на скорость, а пошагово
          конструируем книгу.
        </p>
        <div className="c2-header-deco" aria-hidden="true">
          <div className="c2-header-deco-sun" />
          <span className="c2-header-pill c2-pill-writer">WRITER</span>
          <span className="c2-header-pill c2-pill-autumn">AUTUMN</span>
          <div className="c2-header-deco-pen" />
        </div>
      </div>
    </header>
  );
}

export default HeaderSection;
