/** Three cards explaining the shape of the intensive. */
function AboutSection() {
  return (
    <section className="c2-about">
      <div className="c2-about-grid">
        <div className="c2-about-card c2-about-card-wide c2-about-pink">
          <h3>1 день = 1 часть писательского процесса.</h3>
          <p>От заявки в издательство до нарративного профиля.</p>
          <img
            className="c2-about-card-deco"
            src="/courses/about-decoration1.svg"
            alt=""
            aria-hidden="true"
          />
        </div>

        <div className="c2-about-card c2-about-orange">
          <h3>7 тем = 7 гайдов</h3>
          <p>
            заполняем <strong>личные гайды</strong> к твоей рукописи. они в разы облегчат
            процесс и повысят шанс не забросить книгу
          </p>
          <img
            className="c2-about-card-deco"
            src="/courses/about-decoration2.svg"
            alt=""
            aria-hidden="true"
          />
        </div>

        <div className="c2-about-card c2-about-coral">
          <h3>правим отрывки</h3>
          <p>
            помимо общей теории для всей истории, мы работаем с{' '}
            <strong>ключевыми элементами</strong>: диалоги, лор и тд.
          </p>
          <img
            className="c2-about-card-deco"
            src="/courses/about-decoration3.svg"
            alt=""
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
