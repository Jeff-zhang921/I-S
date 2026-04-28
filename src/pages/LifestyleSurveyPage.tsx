import { useState } from "react";
import ChipInputField from "../components/ChipInputField";
import StatusBanner from "../components/StatusBanner";
import SwipeScalePicker from "../components/SwipeScalePicker";
import TopBackButton from "../components/TopBackButton";
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

type LifestyleSurveyPageProps = {
  totalQuestions: number;
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
  onSaveAndExit: (nextProfileNotes?: Partial<ProfileNotesState>) => void;
  onTextChange: <K extends keyof ProfileNotesState>(field: K, value: ProfileNotesState[K]) => void;
  onTextSubmit: (nextValue?: string) => void;
  isQuestionAnswered: (question: Question) => boolean;
};

function LifestyleSurveyPage({
  totalQuestions,
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
  onSaveAndExit,
  onTextChange,
  onTextSubmit,
  isQuestionAnswered
}: LifestyleSurveyPageProps) {
  const [tagDrafts, setTagDrafts] = useState<ProfileNotesState>({ mustHaves: "", dealbreakers: "" });
  const currentTextValue = currentQuestion.type === "text" ? profileNotes[currentQuestion.field] : "";
  const currentTextDraft = currentQuestion.type === "text" ? tagDrafts[currentQuestion.field] : "";
  const textItems = currentQuestion.type === "text" ? parseProfileList(currentTextValue) : [];
  const previewTextItems = textItems.slice(0, 3);
  const hiddenTextItemsCount = Math.max(textItems.length - previewTextItems.length, 0);
  const sectionIndex = Math.max(
    categoryMeta.findIndex((category) => category.id === currentCategory.id),
    0
  );
  const totalSections = categoryMeta.length;
  const currentCategoryAnsweredCount = activeQuestionBank.filter(
    (question) => question.category === currentCategory.id && isQuestionAnswered(question)
  ).length;
  const sectionSummaries = categoryMeta.map((category, index) => {
    const answered = activeQuestionBank.filter(
      (question) => question.category === category.id && isQuestionAnswered(question)
    ).length;
    const total = categoryQuestionCounts[category.id];

    return {
      ...category,
      answered,
      total,
      index,
      state: category.id === currentQuestion.category ? "active" : answered === total ? "done" : "upcoming"
    };
  });

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

  function handleSaveAndExitAction() {
    if (currentQuestion.type === "text") {
      const trimmedDraft = currentTextDraft.trim();
      if (trimmedDraft) {
        const nextValue = buildNextTextValue(trimmedDraft);
        setTagDrafts((current) => ({ ...current, [currentQuestion.field]: "" }));
        onSaveAndExit({ [currentQuestion.field]: nextValue });
        return;
      }
    }

    onSaveAndExit();
  }

  return (
    <section className="screen quiz-screen quiz-screen-fixed">
      <aside className="quiz-rail">
        <p className="eyebrow">Page 6 of 12</p>
        <h1>Move through the lifestyle survey one section at a time.</h1>
        <p className="lede">
          The lifestyle survey is split into manageable sections. Visibility is set to {privacyLevelMeta.summaryLabel.toLowerCase()},
          so this version has {totalQuestions} questions total.
        </p>

        <div className="progress-card">
          <div className="progress-copy">
            <strong>Step {sectionIndex + 1} of {totalSections}: {currentCategory.title}</strong>
            <span>{Math.round(quizProgress)}% complete</span>
          </div>
          <div className="progress-track" aria-hidden="true">
            <span style={{ width: `${quizProgress}%` }} />
          </div>
          <p className="inline-note quiz-progress-note">
            Section progress: {currentCategoryAnsweredCount} of {currentCategoryQuestionsLength} answered.
          </p>
        </div>

        <ul className="category-list">
          {sectionSummaries.map((category) => {
            return (
              <li key={category.id} className={`category-item ${category.state} tone-${category.accent}`}>
                <div>
                  <strong>Step {category.index + 1}: {category.title}</strong>
                  <p>{category.summary}</p>
                </div>
                <span>
                  {category.answered}/{category.total}
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
        <div className="quiz-stage-top">
          <TopBackButton label="Back" onClick={onBack} />
          <div className="quiz-stage-topline">
            <span className="tag-chip">Step {sectionIndex + 1} of {totalSections}</span>
            <span className="inline-note">Save & Quit any time</span>
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
                    <p className="inline-note">Saved items will appear here.</p>
                  )}
                </div>

                <button type="button" className="primary-button" onClick={handleSubmitTextQuestion}>
                  {currentQuestion.buttonLabel}
                </button>
              </div>
            )}
          </article>
        </div>

        <div className="quiz-footer">
          <StatusBanner status={status} />

          <div className="button-row quiz-actions">
            <button type="button" className="secondary-button quiz-exit-button" onClick={handleSaveAndExitAction}>
              Save & Quit
            </button>
            <p className="inline-note">
              Answers save locally in this prototype and feed the matching results after the survey is complete.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export type { LifestyleSurveyPageProps };

export default LifestyleSurveyPage;
