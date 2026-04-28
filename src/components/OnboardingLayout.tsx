import { ReactNode } from "react";

type OnboardingLayoutProps = {
  sectionClassName?: string;
  shellClassName?: string;
  children: ReactNode;
};

function OnboardingLayout({ sectionClassName = "", shellClassName = "", children }: OnboardingLayoutProps) {
  const sectionClasses = ["screen", "onboarding-screen", sectionClassName].filter(Boolean).join(" ");
  const shellClasses = ["panel-shell", "onboarding-panel-shell", shellClassName].filter(Boolean).join(" ");

  return (
    <section className={sectionClasses}>
      <div className="panel-pane onboarding-panel-pane">
        <div className={shellClasses}>{children}</div>
      </div>
    </section>
  );
}

export default OnboardingLayout;
