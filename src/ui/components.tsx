import type { CSSProperties, ReactNode } from "react";
import type { MaterialQualityIndicator, PublicSignal, Source, Topic, TrackedMaterial } from "../content/types";

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric"
});

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="site-shell">
      <header className="site-header" data-testid="site-header">
        <a className="brand" href="/" aria-label="Signal Notes home">
          <span className="brand-mark" aria-hidden="true" />
          <span>Signal Notes</span>
        </a>
        <nav className="site-nav" aria-label="Primary navigation">
          <a href="/materials">Materials</a>
          <a href="/topics">Topics</a>
          <a href="/sources">Sources</a>
          <a href="/feed.xml">RSS</a>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <span>Signal Notes</span>
        <span>Public notes on tools, AI workflows, and useful source trails.</span>
      </footer>
    </div>
  );
}

export function HomePage({
  signals,
  topics,
  indicators,
  materials,
  feedErrors
}: {
  signals: PublicSignal[];
  topics: Topic[];
  indicators: MaterialQualityIndicator[];
  materials: TrackedMaterial[];
  feedErrors: string[];
}) {
  const featured = signals.filter((signal) => signal.featured).slice(0, 3);
  const watchCount = indicators.filter((indicator) => indicator.status !== "stable").length;

  return (
    <>
      <section className="hero-grid" aria-labelledby="home-title">
        <div className="hero-copy">
          <p className="eyebrow">Public research desk</p>
          <h1 id="home-title">Signal Notes</h1>
          <p className="lede">
            A compact index of tools, AI workflows, source trails, material quality stats, and leading-edge indicators worth returning to.
          </p>
          <div className="hero-stats" aria-label="Signal Notes index stats">
            <Stat value={signals.length.toString()} label="signals" />
            <Stat value={topics.length.toString()} label="topics" />
            <Stat value={watchCount.toString()} label="quality watches" />
          </div>
        </div>
        <img
          className="signal-visual"
          src="/signal-notes-og.png"
          alt="Signal Notes visual index board"
          width="1200"
          height="630"
        />
      </section>

      <section className="quality-preview" aria-labelledby="quality-preview-title">
        <div>
          <p className="eyebrow">Material quality desk</p>
          <h2 id="quality-preview-title">Stats that move before failure does.</h2>
          <p>
            Track traceability, variance, inspection coverage, critical-material exposure, and data completeness as early signals for better material decisions.
          </p>
        </div>
        <div className="quality-preview-grid">
          {indicators.slice(0, 3).map((indicator) => (
            <IndicatorMini indicator={indicator} key={indicator.slug} />
          ))}
        </div>
        <a className="source-link" href="/materials">
          Open materials tracker
        </a>
        <p className="preview-note">{materials.length} material families are in the starter watchlist.</p>
      </section>

      <section className="workbench" aria-labelledby="signals-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Latest signals</p>
            <h2 id="signals-title">Browse the working set</h2>
          </div>
          {feedErrors.length > 0 ? (
            <p className="feed-note" role="status">
              Some live feeds are temporarily unavailable.
            </p>
          ) : null}
        </div>

        <div className="filters" data-testid="filters">
          <label className="search-label" htmlFor="signal-search">
            Search signals
          </label>
          <input
            id="signal-search"
            name="q"
            type="search"
            placeholder="Search tools, workflows, feeds..."
            autoComplete="off"
            data-signal-search
          />
          <div className="topic-filter-group" aria-label="Filter by topic">
            <button className="topic-filter is-active" type="button" data-topic-filter="all" aria-pressed="true">
              All
            </button>
            {topics.map((topic) => (
              <button
                className="topic-filter"
                type="button"
                data-topic-filter={topic.slug}
                aria-pressed="false"
                key={topic.slug}
              >
                {topic.name}
              </button>
            ))}
          </div>
        </div>

        <div className="signal-list" data-signal-list>
          {signals.map((signal) => (
            <SignalCard signal={signal} key={signal.id} />
          ))}
        </div>
        <p className="empty-state" data-empty-state hidden>
          No matching signals yet.
        </p>
      </section>

      <section className="topic-strip" aria-labelledby="featured-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Pinned notes</p>
            <h2 id="featured-title">Start here</h2>
          </div>
        </div>
        <div className="compact-grid">
          {featured.map((signal) => (
            <SignalCard signal={signal} compact key={signal.id} />
          ))}
        </div>
      </section>
    </>
  );
}

export function MaterialsPage({
  indicators,
  materials,
  signals,
  feedErrors
}: {
  indicators: MaterialQualityIndicator[];
  materials: TrackedMaterial[];
  signals: PublicSignal[];
  feedErrors: string[];
}) {
  const riskCount = indicators.filter((indicator) => indicator.status === "risk").length;
  const watchCount = indicators.filter((indicator) => indicator.status === "watch").length;
  const stableCount = indicators.filter((indicator) => indicator.status === "stable").length;
  const updatedAt = indicators
    .map((indicator) => Date.parse(indicator.updatedAt))
    .filter((value) => !Number.isNaN(value))
    .sort((a, b) => b - a)[0];

  return (
    <section className="page-section materials-page" aria-labelledby="materials-title">
      <div className="materials-hero">
        <div>
          <p className="eyebrow">Automated quality tracker</p>
          <h1 id="materials-title">Material quality signals</h1>
          <p className="lede constrained">
            A working desk for measurement quality, process drift, inspection coverage, supply exposure, and other leading indicators that should move before failures do.
          </p>
        </div>
        <div className="materials-summary" aria-label="Material quality tracker summary">
          <Stat value={indicators.length.toString()} label="indicators" />
          <Stat value={materials.length.toString()} label="materials" />
          <Stat value={signals.length.toString()} label="source signals" />
        </div>
      </div>

      <div className="status-strip" aria-label="Indicator status summary">
        <StatusPill label="Risk" value={riskCount} status="risk" />
        <StatusPill label="Watch" value={watchCount} status="watch" />
        <StatusPill label="Stable" value={stableCount} status="stable" />
        <span>Updated {updatedAt ? formatDate(new Date(updatedAt).toISOString()) : "as sources refresh"}</span>
      </div>

      {feedErrors.length > 0 ? (
        <p className="feed-note materials-feed-note" role="status">
          Some live feeds are temporarily unavailable; manual indicators are still shown.
        </p>
      ) : null}

      <section className="quality-section" aria-labelledby="indicator-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Leading indicators</p>
            <h2 id="indicator-title">Quality stats to watch</h2>
          </div>
          <a className="source-link" href="/api/material-quality.json">
            JSON endpoint
          </a>
        </div>
        <div className="indicator-grid">
          {indicators.map((indicator) => (
            <IndicatorCard indicator={indicator} key={indicator.slug} />
          ))}
        </div>
      </section>

      <section className="quality-section" aria-labelledby="materials-watchlist-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Material watchlist</p>
            <h2 id="materials-watchlist-title">Families worth tracking first</h2>
          </div>
        </div>
        <div className="material-grid">
          {materials.map((material) => (
            <MaterialCard material={material} indicators={indicators} key={material.slug} />
          ))}
        </div>
      </section>

      <section className="quality-section" aria-labelledby="quality-source-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Automated source trail</p>
            <h2 id="quality-source-title">Latest material-adjacent signals</h2>
          </div>
        </div>
        <div className="signal-list">
          {signals.slice(0, 8).map((signal) => (
            <SignalCard signal={signal} key={signal.id} />
          ))}
        </div>
      </section>
    </section>
  );
}

export function TopicsPage({ topics, signals }: { topics: Topic[]; signals: PublicSignal[] }) {
  return (
    <section className="page-section" aria-labelledby="topics-title">
      <p className="eyebrow">Topic map</p>
      <h1 id="topics-title">Topics</h1>
      <div className="topic-list">
        {topics.map((topic) => {
          const count = signals.filter((signal) => signal.topicSlugs.includes(topic.slug)).length;

          return (
            <article className="topic-card" key={topic.slug} style={{ "--accent": topic.accent } as CSSProperties}>
              <a href={`/topics/${topic.slug}`}>
                <span className="topic-dot" aria-hidden="true" />
                <h2>{topic.name}</h2>
                <p>{topic.summary}</p>
                <span>{count} signals</span>
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function TopicPage({ topic, signals }: { topic: Topic; signals: PublicSignal[] }) {
  return (
    <section className="page-section" aria-labelledby="topic-title">
      <p className="eyebrow">Topic</p>
      <h1 id="topic-title">{topic.name}</h1>
      <p className="lede constrained">{topic.summary}</p>
      <div className="signal-list">
        {signals.map((signal) => (
          <SignalCard signal={signal} key={signal.id} />
        ))}
      </div>
    </section>
  );
}

export function SignalPage({ signal }: { signal: PublicSignal }) {
  return (
    <article className="article-page" aria-labelledby="signal-title">
      <a className="back-link" href="/">
        Back to signals
      </a>
      <p className="eyebrow">{signal.kind}</p>
      <h1 id="signal-title">{signal.title}</h1>
      <p className="lede constrained">{signal.summary}</p>
      <div className="article-meta">
        <span>{formatDate(signal.publishedAt)}</span>
        <span>{signal.source.name}</span>
      </div>
      <div className="topic-row">
        {signal.topics.map((topic) => (
          <TopicBadge topic={topic} key={topic.slug} />
        ))}
      </div>
      <div className="article-body">
        {signal.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {signal.url ? (
        <a className="source-link" href={signal.url}>
          Open primary source
        </a>
      ) : null}
    </article>
  );
}

export function SourcesPage({ sources }: { sources: Source[] }) {
  return (
    <section className="page-section" aria-labelledby="sources-title">
      <p className="eyebrow">Source trail</p>
      <h1 id="sources-title">Sources</h1>
      <div className="source-list">
        {sources.map((source) => (
          <article className="source-card" key={source.slug}>
            <div>
              <p className="source-type">{source.type}</p>
              <h2>{source.name}</h2>
              <p>{source.description}</p>
            </div>
            <a href={source.url}>Open source</a>
          </article>
        ))}
      </div>
    </section>
  );
}

export function NotFoundPage() {
  return (
    <section className="page-section" aria-labelledby="not-found-title">
      <p className="eyebrow">404</p>
      <h1 id="not-found-title">This signal is not in the index.</h1>
      <p className="lede constrained">The route may be mistyped, or the note may not exist yet.</p>
      <a className="source-link" href="/">
        Return home
      </a>
    </section>
  );
}

function SignalCard({ signal, compact = false }: { signal: PublicSignal; compact?: boolean }) {
  const href = signal.origin === "manual" ? `/signals/${signal.slug}` : signal.url ?? "/";

  return (
    <article
      className={compact ? "signal-card compact" : "signal-card"}
      data-signal-card
      data-title={signal.title}
      data-summary={signal.summary}
      data-topics={signal.topicSlugs.join(" ")}
      data-tags={signal.tags.join(" ")}
    >
      <div className="card-topline">
        <span>{signal.origin === "manual" ? signal.kind : "feed"}</span>
        <time dateTime={signal.publishedAt}>{formatDate(signal.publishedAt)}</time>
      </div>
      <h3>
        <a href={href}>{signal.title}</a>
      </h3>
      <p>{signal.summary}</p>
      <div className="topic-row">
        {signal.topics.map((topic) => (
          <TopicBadge topic={topic} key={topic.slug} />
        ))}
      </div>
      <div className="card-footer">
        <span>{signal.source.name}</span>
        <a href={href}>{signal.origin === "manual" ? "Read note" : "Open source"}</a>
      </div>
    </article>
  );
}

function IndicatorMini({ indicator }: { indicator: MaterialQualityIndicator }) {
  return (
    <article className="indicator-mini">
      <span className={`status-dot ${indicator.status}`} aria-hidden="true" />
      <div>
        <h3>{indicator.value}{indicator.unit ? ` ${indicator.unit}` : ""}</h3>
        <p>{indicator.title}</p>
      </div>
    </article>
  );
}

function IndicatorCard({ indicator }: { indicator: MaterialQualityIndicator }) {
  return (
    <article className={`indicator-card ${indicator.status}`}>
      <div className="card-topline">
        <span>{indicator.category}</span>
        <span>{indicator.trend}</span>
      </div>
      <div className="indicator-value">
        <strong>
          {indicator.value}
          {indicator.unit ? <span>{indicator.unit}</span> : null}
        </strong>
        <small>target {indicator.target}</small>
      </div>
      <h3>{indicator.title}</h3>
      <p>{indicator.summary}</p>
      <p className="why-it-matters">{indicator.whyItMatters}</p>
      <div className="card-footer">
        <span>{indicator.cadence}</span>
        <span className={`status-label ${indicator.status}`}>{indicator.status}</span>
      </div>
    </article>
  );
}

function MaterialCard({
  material,
  indicators
}: {
  material: TrackedMaterial;
  indicators: MaterialQualityIndicator[];
}) {
  const linkedIndicators = material.indicatorSlugs
    .map((slug) => indicators.find((indicator) => indicator.slug === slug))
    .filter(Boolean) as MaterialQualityIndicator[];

  return (
    <article className="material-card">
      <p className="source-type">{material.family}</p>
      <h3>{material.name}</h3>
      <p>{material.summary}</p>
      <div className="quality-stat-list">
        {material.qualityStats.map((stat) => (
          <div className="quality-stat" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}{stat.unit ? ` ${stat.unit}` : ""}</strong>
            <span className={`status-label ${stat.status}`}>{stat.status}</span>
          </div>
        ))}
      </div>
      <div>
        <p className="mini-heading">Leading indicators</p>
        <ul className="leading-list">
          {material.leadingIndicators.map((indicator) => (
            <li key={indicator}>{indicator}</li>
          ))}
        </ul>
      </div>
      <div className="topic-row">
        {linkedIndicators.map((indicator) => (
          <span className={`status-label ${indicator.status}`} key={indicator.slug}>
            {indicator.title}
          </span>
        ))}
      </div>
    </article>
  );
}

function StatusPill({ label, value, status }: { label: string; value: number; status: "risk" | "watch" | "stable" }) {
  return (
    <span className={`status-pill ${status}`}>
      <strong>{value}</strong>
      {label}
    </span>
  );
}

function TopicBadge({ topic }: { topic: Topic }) {
  return (
    <a className="topic-badge" href={`/topics/${topic.slug}`} style={{ "--accent": topic.accent } as CSSProperties}>
      {topic.name}
    </a>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Undated" : dateFormatter.format(date);
}
