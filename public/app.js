const searchInput = document.querySelector("[data-signal-search]");
const buttons = Array.from(document.querySelectorAll("[data-topic-filter]"));
const cards = Array.from(document.querySelectorAll("[data-signal-card]"));
const emptyState = document.querySelector("[data-empty-state]");

let activeTopic = "all";

function applyFilters() {
  const query = searchInput?.value?.trim().toLowerCase() ?? "";
  let visibleCount = 0;

  for (const card of cards) {
    const topics = card.getAttribute("data-topics") ?? "";
    const haystack = [
      card.getAttribute("data-title"),
      card.getAttribute("data-summary"),
      card.getAttribute("data-tags"),
      topics
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const topicMatches = activeTopic === "all" || topics.split(" ").includes(activeTopic);
    const queryMatches = !query || haystack.includes(query);
    const visible = topicMatches && queryMatches;

    card.toggleAttribute("hidden", !visible);
    if (visible) {
      visibleCount += 1;
    }
  }

  if (emptyState) {
    emptyState.hidden = visibleCount > 0;
  }
}

for (const button of buttons) {
  button.addEventListener("click", () => {
    activeTopic = button.getAttribute("data-topic-filter") ?? "all";

    for (const candidate of buttons) {
      const isActive = candidate === button;
      candidate.classList.toggle("is-active", isActive);
      candidate.setAttribute("aria-pressed", String(isActive));
    }

    applyFilters();
  });
}

searchInput?.addEventListener("input", applyFilters);
