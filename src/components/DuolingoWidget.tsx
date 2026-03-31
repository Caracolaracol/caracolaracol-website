export type DuolingoCourse = {
  title: string;
  xp: number;
  id: string;
};

export type DuolingoUser = {
  username: string;
  streak: number;
  totalXp: number;
  courses: DuolingoCourse[];
};

interface DuolingoWidgetProps {
  data: DuolingoUser | null;
}

export default function DuolingoWidget({ data: user }: DuolingoWidgetProps) {

  return (
    <div className="w-full rounded-2xl border border-snow/12 border-dotted px-5 py-5 backdrop-blur-[2px]">
      <div className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.28em] text-timberwolf tablet:text-xs mb-4">
        <span className="h-2 w-2 rounded-full bg-[#58cc02]" />
        <span>Duolingo</span>
      </div>

        {!user && (
          <p className="text-sm text-timberwolf">
            Could not load Duolingo stats.
          </p>
        )}

        {user && (
          <>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-chrono text-[#ff9600]">
                  🔥 {user.streak}
                </p>
                <p className="text-xs text-timberwolf">Streak</p>
              </div>
              <div>
                <p className="text-2xl font-chrono text-[#58cc02]">
                  ⭐ {user.totalXp.toLocaleString()}
                </p>
                <p className="text-xs text-timberwolf">XP</p>
              </div>
            </div>

            {user.courses.length > 0 && (() => {
              const sorted = [...user.courses].sort((a, b) => b.xp - a.xp);
              const maxXp = sorted[0]?.xp || 1;

              return (
                <div className="mt-5">
                  <h3 className="text-sm font-tommyBold text-timberwolf mb-2">
                    Languages
                  </h3>
                  <div className="space-y-3">
                    {sorted.map((course) => {
                      const pct = Math.max(2, Math.round((course.xp / maxXp) * 100));
                      return (
                        <div key={course.id || course.title}>
                          <div className="flex justify-between text-xs text-timberwolf mb-1">
                            <span>{course.title}</span>
                            <span>{course.xp.toLocaleString()} XP</span>
                          </div>
                          <div className="w-full bg-snow/10 rounded-full h-2">
                            <div
                              className="bg-[#58cc02] h-2 rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </>
        )}
    </div>
  );
}
