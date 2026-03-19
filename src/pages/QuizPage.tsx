import StatusBanner from "../components/StatusBanner";
import { parseProfileList } from "../lib/onboarding";
import {
  CategoryMeta,
  MatchTarget,
  PrivacyLevelOption,
  ProfileNotesState,
  Question,
  QuizAnswers,
  ScaleChoice,
  StatusState
} from "../types";

type QuizPageProps = {
  totalQuestions: number;
  answeredCount: number;
  quizProgress: number;
  questionIndex: number;
  currentQuestion: Question;
  nextQuestion: Question | null;
  currentCategory: CategoryMeta;
  currentCategoryQuestionsLength: number;
  currentCategoryQuestionNumber: number;
  categoryMeta: CategoryMeta[];
  categoryQuestionCounts: MatchTarget;
  activeQuestionBank: Question[];
  quizAnswers: QuizAnswers;
  profileNotes: ProfileNotesState;
  privacyLevelMeta: PrivacyLevelOption;
  scaleChoices: ScaleChoice[];
  status: StatusState;
  onAnswer: (value: number) => void;
  onBack: () => void;
  onTextChange: <K extends keyof ProfileNotesState>(field: K, value: ProfileNotesState[K]) => void;
  onTextSubmit: () => void;
  isQuestionAnswered: (question: Question) => boolean;
};

function QuizPage({
  totalQuestions,
  answeredCount,
  quizProgress,
  questionIndex,
  currentQuestion,
  nextQuestion,
  currentCategory,
  currentCategoryQuestionsLength,
  currentCategoryQuestionNumber,
  categoryMeta,
  categoryQuestionCounts,
  activeQuestionBank,
  quizAnswers,
  profileNotes,
  privacyLevelMeta,
  scaleChoices,
  status,
  onAnswer,
  onBack,
  onTextChange,
  onTextSubmit,
  isQuestionAnswered
}: QuizPageProps) {
  const currentTextValue = currentQuestion.type === "text" ? profileNotes[currentQuestion.field] : "";

  return (
    <section className="screen quiz-screen">
      <aside className="quiz-rail">
        <p className="eyebrow">Page 3 of 10</p>
        <h1>Answer one card at a time.</h1>
        <p className="lede">
          The onboarding stays focused and sequential. Privacy is set to {privacyLevelMeta.title.toLowerCase()}, so this version has {totalQuestions} questions total.
        </p>

        <div className="progress-card">
          <div className="progress-copy">
            <strong>{answeredCount} / {totalQuestions} answered</strong>
            <span>{Math.round(quizProgress)}% complete</span>
          </div>
          <div className="progress-track" aria-hidden="true">
            <span style={{ width: `${quizProgress}%` }} />
          </div>
        </div>

        <ul className="category-list">
          {categoryMeta.map((category) => {
            const categoryQuestionsAnswered = activeQuestionBank.filter(
              (question) => question.category === category.id && isQuestionAnswered(question)
            ).length;
            const state =
              category.id === currentQuestion.category
                ? "active"
                : categoryQuestionsAnswered === categoryQuestionCounts[category.id]
                  ? "done"
                  : "upcoming";

            return (
              <li key={category.id} className={`category-item ${state} tone-${category.accent}`}>
                <div>
                  <strong>{category.title}</strong>
                  <p>{category.summary}</p>
                </div>
                <span>
                  {categoryQuestionsAnswered}/{categoryQuestionCounts[category.id]}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="scale-note">
          <span>{privacyLevelMeta.title} privacy</span>
          <span>{privacyLevelMeta.questionCount} privacy questions</span>
        </div>
      </aside>

      <div className="quiz-stage">
        <div className="quiz-meta">
          <div>
            <p className="panel-kicker">Question {questionIndex + 1} of {totalQuestions}</p>
            <h2>{currentCategory.title}</h2>
          </div>
          <span className={`category-badge tone-${currentCategory.accent}`}>
            {currentCategoryQuestionNumber}/{currentCategoryQuestionsLength}
          </span>
        </div>

        <div className="question-stack">
          {nextQuestion ? (
            <article className="question-card question-card-ghost" aria-hidden="true">
              <p className="question-overline">Up next</p>
              <h3>{nextQuestion.prompt}</h3>
            </article>
          ) : null}

          <article key={currentQuestion.id} className={`question-card question-card-active tone-${currentCategory.accent}`}>
            <p className="question-overline">{currentCategory.summary}</p>
            <h3>{currentQuestion.prompt}</h3>
            <p className="question-hint">{currentQuestion.hint}</p>

            {currentQuestion.type === "scale" ? (
              <div className="rating-grid" role="group" aria-label={`Choose a level for: ${currentQuestion.prompt}`}>
                {scaleChoices.map((choice) => (
                  <button
                    key={choice.value}
                    type="button"
                    className={quizAnswers[currentQuestion.id] === choice.value ? "rating-choice selected" : "rating-choice"}
                    onClick={() => onAnswer(choice.value)}
                  >
                    <strong>{choice.value}</strong>
                    <span>{choice.label}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-card-flow">
                <label className="text-card-label">
                  Add profile notes
                  <textarea
                    className="question-textarea"
                    rows={5}
                    placeholder={currentQuestion.placeholder}
                    value={currentTextValue}
                    onChange={(event) => onTextChange(currentQuestion.field, event.target.value)}
                  />
                </label>

                <div className="tag-preview">
                  {parseProfileList(currentTextValue).length ? (
                    parseProfileList(currentTextValue).map((item) => (
                      <span key={item} className="tag-chip">
                        {item}
                      </span>
                    ))
                  ) : (
                    <p className="inline-note">Type items separated by commas or new lines.</p>
                  )}
                </div>
              </div>
            )}
          </article>
        </div>

        <StatusBanner status={status} />

        <div className="button-row quiz-actions">
          <button type="button" className="secondary-button" onClick={onBack}>
            Back
          </button>
          {currentQuestion.type === "scale" ? (
            <p className="inline-note">Tap any choice and the next question slides in.</p>
          ) : (
            <button type="button" className="primary-button" onClick={onTextSubmit}>
              {currentQuestion.buttonLabel}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default QuizPage;
