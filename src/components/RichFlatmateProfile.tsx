import CommitmentBadge from "./CommitmentBadge";
import { RoommateMatch } from "../types";
import {
  getFlatmateProfile,
  getHabitAxisLabels,
  getHabitDescriptor,
  getHabitProgress,
  getLifeStageBadgeLabel,
  getLifeStageFieldLabel
} from "../lib/findRoom";

type RichFlatmateProfileProps = {
  match: RoommateMatch;
};

type HabitMeterProps = {
  label: string;
  value: number;
  descriptor: string;
  minLabel: string;
  maxLabel: string;
};

function HabitMeter({ label, value, descriptor, minLabel, maxLabel }: HabitMeterProps) {
  return (
    <article className="habit-meter-card">
      <div className="habit-meter-head">
        <div>
          <p className="panel-kicker">{label}</p>
          <strong>{descriptor}</strong>
        </div>
        <span>{value}/5</span>
      </div>

      <div className="habit-meter-track" aria-hidden="true">
        <span style={{ width: `${getHabitProgress(value)}%` }} />
      </div>

      <div className="habit-meter-scale">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </article>
  );
}

function RichFlatmateProfile({ match }: RichFlatmateProfileProps) {
  const profile = getFlatmateProfile(match.id);

  return (
    <section className="summary-panel rich-flatmate-panel">
      <div className="panel-headline">
        <div>
          <p className="panel-kicker">Flatmate profile</p>
          <h2>{match.roommate.name}</h2>
        </div>
        <div className="detail-badge-stack">
          <span className="tag-chip">{getLifeStageBadgeLabel(profile.lifeStage)}</span>
          <CommitmentBadge level={profile.commitmentLevel} />
        </div>
      </div>

      <div className="flatmate-basic-grid">
        <article className="detail-card">
          <strong>Age</strong>
          <span>{match.roommate.age}</span>
        </article>
        <article className="detail-card">
          <strong>{getLifeStageFieldLabel(profile.lifeStage)}</strong>
          <span>{profile.courseOrJob}</span>
        </article>
      </div>

      <div className="detail-text-block">
        <p className="panel-kicker">Vibe</p>
        <p className="flatmate-summary">{match.roommate.vibe}</p>
        <p>{match.roommate.bio}</p>
      </div>

      <div className="detail-text-block">
        <p className="panel-kicker">Interests</p>
        <div className="tag-preview">
          {profile.interests.map((interest) => (
            <span key={interest} className="tag-chip">
              {interest}
            </span>
          ))}
        </div>
      </div>

      <div className="habit-meter-grid">
        {(["cleanliness", "sleep", "noise"] as const).map((habit) => {
          const labels = getHabitAxisLabels(habit);

          return (
            <HabitMeter
              key={habit}
              label={habit === "sleep" ? "Sleep habits" : `${habit[0].toUpperCase()}${habit.slice(1)} level`}
              value={profile.habits[habit]}
              descriptor={getHabitDescriptor(habit, profile.habits[habit])}
              minLabel={labels.min}
              maxLabel={labels.max}
            />
          );
        })}
      </div>

      <blockquote className="intent-quote">
        <p className="panel-kicker">What I am looking for</p>
        <p>{profile.lookingFor}</p>
      </blockquote>
    </section>
  );
}

export default RichFlatmateProfile;
