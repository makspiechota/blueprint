import { useMode } from "../context/ModeContext";

const WIDGET_CONTENT = {
  blueprint: {
    title: "Business Blueprint",
    description:
      "Complete business architecture visualization system defined in plain-text DSL optimized for autonomous AI workflows.",
  },
  "software-factory": {
    title: "Software Factory",
    description:
      "Visual workflow orchestration for AI coding agents. Design, execute, and monitor autonomous SDLC workflows.",
  },
};

export default function SidebarWidget() {
  const { mode } = useMode();
  const content = WIDGET_CONTENT[mode];

  return (
    <div
      className={`
        mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/[0.03]`}
    >
      <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
        {content.title}
      </h3>
      <p className="mb-4 text-gray-500 text-theme-sm dark:text-gray-400">
        {content.description}
      </p>
    </div>
  );
}
