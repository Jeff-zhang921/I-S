import { useRef, useState } from "react";
import { ScaleChoice } from "../types";

type SwipeScalePickerProps = {
  choices: ScaleChoice[];
  value?: number;
  onCommit: (value: number) => void;
};

function SwipeScalePicker({ choices, value, onCommit }: SwipeScalePickerProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [previewValue, setPreviewValue] = useState<number | null>(value ?? null);
  const [isDragging, setIsDragging] = useState(false);

  const fallbackChoice = choices[0];
  const activeValue = previewValue ?? value ?? fallbackChoice?.value ?? 1;
  const activeIndex = Math.max(
    0,
    choices.findIndex((choice) => choice.value === activeValue)
  );
  const activeChoice = choices[activeIndex] ?? fallbackChoice;
  const activePosition = choices.length > 1 ? (activeIndex / (choices.length - 1)) * 100 : 0;

  function getValueFromClientX(clientX: number) {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || !choices.length) {
      return fallbackChoice?.value ?? 1;
    }

    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const index = Math.round(ratio * (choices.length - 1));
    return choices[index]?.value ?? fallbackChoice?.value ?? 1;
  }

  function commitValue(nextValue: number) {
    setPreviewValue(nextValue);
    onCommit(nextValue);
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
    setPreviewValue(getValueFromClientX(event.clientX));
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging) {
      return;
    }

    setPreviewValue(getValueFromClientX(event.clientX));
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const nextValue = getValueFromClientX(event.clientX);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setIsDragging(false);
    commitValue(nextValue);
  }

  function handlePointerCancel(event: React.PointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setIsDragging(false);
    setPreviewValue(value ?? fallbackChoice?.value ?? 1);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!choices.length) {
      return;
    }

    const currentIndex = Math.max(
      0,
      choices.findIndex((choice) => choice.value === (value ?? activeChoice?.value))
    );

    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      commitValue(choices[Math.max(0, currentIndex - 1)].value);
    }

    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      commitValue(choices[Math.min(choices.length - 1, currentIndex + 1)].value);
    }

    if (event.key === "Home") {
      event.preventDefault();
      commitValue(choices[0].value);
    }

    if (event.key === "End") {
      event.preventDefault();
      commitValue(choices[choices.length - 1].value);
    }
  }

  return (
    <div className="swipe-scale-shell">
      <div className="swipe-scale-readout">
        <strong>{activeChoice?.value ?? "-"}/5</strong>
        <span>{activeChoice?.label ?? "Swipe to choose a level."}</span>
      </div>

      <div
        ref={trackRef}
        className="swipe-scale-track"
        role="slider"
        tabIndex={0}
        aria-label="Swipe to choose a level from one to five"
        aria-valuemin={choices[0]?.value ?? 1}
        aria-valuemax={choices[choices.length - 1]?.value ?? 5}
        aria-valuenow={activeChoice?.value ?? value ?? 1}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onKeyDown={handleKeyDown}
      >
        <div className="swipe-scale-rail" aria-hidden="true" />
        <div className="swipe-scale-fill" aria-hidden="true" style={{ width: `${activePosition}%` }} />
        <div className="swipe-scale-stops" aria-hidden="true">
          {choices.map((choice) => (
            <span
              key={choice.value}
              className={choice.value === activeChoice?.value ? "swipe-scale-stop active" : "swipe-scale-stop"}
            >
              {choice.value}
            </span>
          ))}
        </div>
        <div className="swipe-scale-thumb" aria-hidden="true" style={{ left: `${activePosition}%` }}>
          <strong>{activeChoice?.value ?? 1}</strong>
        </div>
      </div>

      <div className="swipe-scale-labels">
        <span>{choices[0]?.label ?? "Low"}</span>
        <span>{choices[choices.length - 1]?.label ?? "High"}</span>
      </div>

      <div className="swipe-scale-chips">
        {choices.map((choice) => (
          <button
            key={choice.value}
            type="button"
            className={choice.value === value ? "swipe-scale-chip active" : "swipe-scale-chip"}
            onClick={() => commitValue(choice.value)}
          >
            {choice.value}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SwipeScalePicker;
