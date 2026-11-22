"use client";

/**
 * Photo planner — plan a pair on real photos of the shoe, one canvas per
 * side (left/right × outer/inner/heel/toe), plus "together" views that
 * compose them live. Home screen: the pair overview.
 *
 * Mobile first: switcher, stage, then tabbed panels; on large screens the
 * panels sit beside the stage.
 */

import { useEffect, useRef, useState } from "react";
import { japanPair, togetherViews, viewOrder, type PlannerPair, type PlannerViewKey } from "@/data/planner";
import { cn } from "@/lib/utils";
import { askPersistentStorage, idb } from "./db";
import { hydrate } from "./io";
import { AdjustPanel, LayersPanel, LibraryPanel, ProjectPanel, TogetherPanel } from "./panels";
import { preloadViews, setImageListener, zoneData, zonesAt } from "./render";
import { projectOf, usePlanner } from "./store";
import { TogetherStage } from "./TogetherStage";
import { ViewEditor } from "./ViewEditor";

type Tab = "library" | "layers" | "adjust" | "together" | "project";

/** Debounced save of the project to IndexedDB whenever it changes. */
function useAutosave() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const unsub = usePlanner.subscribe((s, prev) => {
      if (!s.hydrated || s.saveState === "unavailable") return;
      if (s.layers === prev.layers && s.feetTogether === prev.feetTogether && s.innerLayout === prev.innerLayout) return;
      clearTimeout(timer);
      if (s.saveState !== "saving") s.setSaveState("saving");
      timer = setTimeout(async () => {
        const st = usePlanner.getState();
        try {
          await idb.putProject({ ...projectOf(st), savedAt: Date.now() });
          st.setSaveState("saved");
        } catch {
          st.setSaveState("unavailable");
        }
      }, 500);
    });
    return () => {
      clearTimeout(timer);
      unsub();
    };
  }, []);
}

export function PhotoPlanner({ pair = japanPair }: { pair?: PlannerPair }) {
  const screen = usePlanner((s) => s.screen);
  const hydrated = usePlanner((s) => s.hydrated);
  const saveState = usePlanner((s) => s.saveState);
  const layers = usePlanner((s) => s.layers);
  const setScreen = usePlanner((s) => s.setScreen);
  const [tab, setTab] = useState<Tab>("together");
  const stageRef = useRef<HTMLDivElement>(null);

  /** On phones the panels sit below the stage: bring the shoe back into view. */
  const showStage = () => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top < 64 || r.bottom > window.innerHeight) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
    }
  };

  useEffect(() => {
    setImageListener(() => usePlanner.getState().bumpImages());
    preloadViews(pair);
    askPersistentStorage();
    void hydrate(pair.id);
  }, [pair]);
  useAutosave();

  // layers made before paint zones existed get the panel under their centre
  useEffect(() => {
    const run = () => {
      const st = usePlanner.getState();
      if (!st.hydrated) return;
      for (const v of Object.values(pair.views)) {
        if (!v.zonesSrc || !zoneData(v)) continue;
        st.assignMissingZones(v.key, (l) => zonesAt(v, l.x, l.y) ?? [v.defaultZone ?? "side"]);
      }
    };
    run();
    return usePlanner.subscribe((s, p) => {
      if (s.imagesVersion !== p.imagesVersion || s.hydrated !== p.hydrated || s.layers !== p.layers) run();
    });
  }, [pair]);

  const view = screen.kind === "view" ? pair.views[screen.key] : null;

  // keep a sensible tab for the screen
  const tabs: { key: Tab; label: string }[] = view
    ? [
        { key: "library", label: "Library" },
        { key: "layers", label: `Layers${layers[view.key].length ? ` · ${layers[view.key].length}` : ""}` },
        { key: "adjust", label: "Adjust" },
        { key: "project", label: "Project" },
      ]
    : [
        { key: "together", label: "Together" },
        { key: "library", label: "Library" },
        { key: "project", label: "Project" },
      ];
  const activeTab: Tab = tabs.some((t) => t.key === tab) ? tab : tabs[0].key;

  // selecting something on the shoe opens its controls (unless browsing layers)
  useEffect(
    () =>
      usePlanner.subscribe((s, prev) => {
        if (s.selectedId && s.selectedId !== prev.selectedId && s.screen.kind === "view")
          setTab((t) => (t === "layers" ? t : "adjust"));
      }),
    [],
  );

  const go = (key: PlannerViewKey) => {
    setScreen({ kind: "view", key });
    setTab((t) => (t === "together" ? "library" : t));
  };

  const title = view ? view.label : togetherViews.find((t) => screen.kind === "together" && t.key === screen.key)!.label;
  const hint = view
    ? view.approximate
      ? `From a ${view.from}: ${view.approximate}.`
      : `From ${view.from}.`
    : togetherViews.find((t) => screen.kind === "together" && t.key === screen.key)!.hint + " Tap a shoe to edit it.";

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
      <div className="min-w-0 lg:col-span-7 xl:col-span-8">
        {/* switcher */}
        <nav aria-label="Planner views" className="space-y-2">
          <div className="grid grid-cols-3 gap-1.5 rounded-full border border-line bg-coal/60 p-1">
            {togetherViews.map((t) => {
              const on = screen.kind === "together" && screen.key === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  aria-current={on ? "page" : undefined}
                  onClick={() => (setScreen({ kind: "together", key: t.key }), setTab("together"))}
                  className={cn(
                    "min-h-11 rounded-full px-2 text-sm transition-colors",
                    on ? "bg-olive text-paper shadow-soft" : "text-cream-2 hover:bg-cream-soft/70",
                  )}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {viewOrder.map((k) => {
              const v = pair.views[k];
              const on = screen.kind === "view" && screen.key === k;
              const n = layers[k].length;
              return (
                <button
                  key={k}
                  type="button"
                  aria-current={on ? "page" : undefined}
                  onClick={() => go(k)}
                  className={cn(
                    "relative min-h-11 rounded-xl border px-1 text-[0.8rem] leading-tight transition-colors",
                    on ? "border-olive bg-sage/20 text-cream" : "border-line bg-cream-soft/60 text-cream-2 hover:border-olive/40",
                  )}
                >
                  {v.short}
                  {v.approximate && (
                    <span className="ml-0.5 text-brown-ink" aria-hidden title="mirrored copy, approximate">
                      ≈
                    </span>
                  )}
                  {v.approximate && <span className="sr-only"> (mirrored, approximate)</span>}
                  {n > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-olive px-1 text-[0.65rem] text-paper">
                      {n}
                      <span className="sr-only"> layers</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        <div ref={stageRef} className="mt-4 mb-2 flex scroll-mt-24 items-baseline justify-between gap-3">
          <h2 className="font-display text-xl text-cream">{title}</h2>
          <span className="shrink-0 text-xs text-muted" aria-live="polite">
            {!hydrated ? "opening…" : saveState === "saving" ? "saving…" : saveState === "saved" ? "saved" : saveState === "unavailable" ? "not saving" : ""}
          </span>
        </div>

        {view ? <ViewEditor key={view.key} view={view} /> : <TogetherStage which={screen.kind === "together" ? screen.key : "pair"} pair={pair} />}
        <p className="mt-2 text-xs text-muted">{hint}</p>
      </div>

      {/* panels */}
      <section aria-label="Planner tools" className="min-w-0 lg:col-span-5 xl:col-span-4">
        <div className="lg:sticky lg:top-24">
          <div role="tablist" aria-label="Tools" className="flex gap-1 overflow-x-auto rounded-full border border-line bg-coal/60 p-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                id={`tab-${t.key}`}
                aria-selected={activeTab === t.key}
                aria-controls="planner-panel"
                onClick={() => setTab(t.key)}
                className={cn(
                  "min-h-11 flex-1 rounded-full px-3 text-sm whitespace-nowrap transition-colors",
                  activeTab === t.key ? "bg-cream-soft text-cream shadow-soft" : "text-cream-2 hover:bg-cream-soft/60",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div
            id="planner-panel"
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
            className="mt-3 rounded-blob border border-line bg-coal p-4 sm:p-5"
          >
            {activeTab === "library" && <LibraryPanel view={view} onAdded={() => (setTab("adjust"), showStage())} />}
            {activeTab === "layers" && view && <LayersPanel view={view} onPick={showStage} />}
            {activeTab === "adjust" && view && <AdjustPanel view={view} />}
            {activeTab === "together" && screen.kind === "together" && <TogetherPanel which={screen.key} pair={pair} />}
            {activeTab === "project" && <ProjectPanel view={view} pair={pair} />}
          </div>
        </div>
      </section>
    </div>
  );
}
