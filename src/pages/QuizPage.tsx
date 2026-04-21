import { useState } from "react";
import ChipInputField from "../components/ChipInputField";
import TopBackButton from "../components/TopBackButton";
import StatusBanner from "../components/StatusBanner";
import SwipeScalePicker from "../components/SwipeScalePicker";
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
  onScaleCommit: (value: number) => void;
  onBack: () => void;
  onTextChange: <K extends keyof ProfileNotesState>(field: K, value: ProfileNotesState[K]) => void;
  onTextSubmit: (nextValue?: string) => void;
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
  onScaleCommit,
  onBack,
  onTextChange,
  onTextSubmit,
  isQuestionAnswered
}: QuizPageProps) {
  const [tagDrafts, setTagDrafts] = useState<ProfileNotesState>({ mustHaves: "", dealbreakers: "" });
  const currentTextValue = currentQuestion.type === "text" ? profileNotes[currentQuestion.field] : "";
  const currentTextDraft = currentQuestion.type === "text" ? tagDrafts[currentQuestion.field] : "";
  const textItems = currentQuestion.type === "text" ? parseProfileList(currentTextValue) : [];
  const previewTextItems = textItems.slice(0, 3);
  const hiddenTextItemsCount = Math.max(textItems.length - previewTextItems.length, 0);

  function buildNextTextValue(rawValue: string) {
    if (currentQuestion.type !== "text") {
      return "";
    }

    const item = rawValue.trim().replace(/,+$/, "");
    if (!item) {
      return currentTextValue;
    }

    const nextItems = [...textItems];
    if (!nextItems.some((existingItem) => existingItem.toLowerCase() === item.toLowerCase())) {
      nextItems.push(item);
    }

    return nextItems.join("\n");
  }

  function handleAddChip(rawValue: string) {
    if (currentQuestion.type !== "text") {
      return;
    }

    const trimmedValue = rawValue.trim().replace(/,+$/, "");
    const nextValue = buildNextTextValue(rawValue);
    if (nextValue === currentTextValue) {
      if (trimmedValue) {
        setTagDrafts((current) => ({ ...current, [currentQuestion.field]: "" }));
      }
      return;
    }

    onTextChange(currentQuestion.field, nextValue);
    setTagDrafts((current) => ({ ...current, [currentQuestion.field]: "" }));
  }

  function handleRemoveChip(item: string) {
    if (currentQuestion.type !== "text") {
      return;
    }

    const nextItems = textItems.filter((existingItem) => existingItem !== item);
    onTextChange(currentQuestion.field, nextItems.join("\n"));
  }

  function handleSubmitTextQuestion() {
    if (currentQuestion.type !== "text") {
      return;
    }

    const trimmedDraft = currentTextDraft.trim();
    const nextValue = trimmedDraft ? buildNextTextValue(trimmedDraft) : currentTextValue;

    if (trimmedDraft) {
      onTextChange(currentQuestion.field, nextValue);
      setTagDrafts((current) => ({ ...current, [currentQuestion.field]: "" }));
    }

    onTextSubmit(nextValue);
  }

  return (
    <section className="screen quiz-screen quiz-screen-fixed">
      <aside className="quiz-rail">
        <TopBackButton label="Back" onClick={onBack} className="top-back-button-desktop" />

        <p className="eyebrow">Page 3 of 10</p>
        <h1>Answer one card at a time.</h1>
        <p className="lede">
          The onboarding stays focused and sequential. Visibility is set to {privacyLevelMeta.summaryLabel.toLowerCase()}, so this version has {totalQuestions} questions total.
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
          <span>{privacyLevelMeta.summaryLabel}</span>
          <span>{privacyLevelMeta.questionCount} privacy questions</span>
        </div>
      </aside>

      <div className="quiz-stage">
        <TopBackButton label="Back" onClick={onBack} className="top-back-button-mobile" />

        <div className="quiz-mobile-summary">
          <div className="quiz-mobile-topline">
            <p className="eyebrow">Page 3 of 10</p>
            <span className={`category-badge tone-${currentCategory.accent}`}>
              {currentCategoryQuestionNumber}/{currentCategoryQuestionsLength}
            </span>
          </div>

          <div className="quiz-mobile-progress">
            <strong>
              {questionIndex + 1}/{totalQuestions}
            </strong>
            <span>
              {answeredCount} answered | {privacyLevelMeta.summaryLabel}
            </span>
          </div>

          <div className="progress-track" aria-hidden="true">
            <span style={{ width: `${quizProgress}%` }} />
          </div>
        </div>

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
              <SwipeScalePicker
                key={currentQuestion.id}
                choices={scaleChoices}
                value={quizAnswers[currentQuestion.id]}
                onCommit={onScaleCommit}
              />
            ) : (
              <div className="text-card-flow">
                <ChipInputField
                  label="Add profile notes"
                  placeholder={currentQuestion.placeholder}
                  helperText="Press Enter to add each item. Suggestions below can be tapped straight into your profile."
                  items={textItems}
                  draftValue={currentTextDraft}
                  suggestions={currentQuestion.suggestions}
                  onDraftChange={(value) =>
                    setTagDrafts((current) => ({ ...current, [currentQuestion.field]: value }))
                  }
                  onAddItem={handleAddChip}
                  onRemoveItem={handleRemoveChip}
                />

                <div className="tag-preview quiz-tag-preview">
                  {textItems.length ? (
                    <>
                      {previewTextItems.map((item) => (
                        <span key={item} className="tag-chip">
                          {item}
                        </span>
                      ))}
                      {hiddenTextItemsCount ? <span className="tag-chip">+{hiddenTextItemsCount} more</span> : null}
                    </>
                  ) : (
                    <p className="inline-note">Type items separated by commas or new lines.</p>
                  )}
                </div>
              </div>
            )}
          </article>
        </div>

        <div className="quiz-footer">
          <StatusBanner status={status} />

          <div className="button-row quiz-actions">
            {currentQuestion.type === "scale" ? (
              <p className="inline-note">Tap 1-5 or drag the slider. The next card opens immediately.</p>
            ) : (
              <button type="button" className="primary-button" onClick={handleSubmitTextQuestion}>
                {currentQuestion.buttonLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default QuizPage;
