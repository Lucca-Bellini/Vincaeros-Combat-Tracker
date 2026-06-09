<script>
  export let event;
  export let selected = false;

  import { combatStore } from '../stores/combatStore';

  function handleSelect() {
    combatStore.toggleSelect(event.id);
  }
</script>

<div
  class="event-card {selected ? 'selected' : ''}"
  class:expired={event.currentTurns === 0}
  role="button"
  tabindex="0"
  on:click={handleSelect}
  on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelect()}
>
  <button class="remove" on:click|stopPropagation={() => combatStore.removeEvent(event.id)}>✖</button>

  <h3>📅 {event.name}</h3>
  <p class="source">{event.source}</p>
  <div class="turns">
    ⏳ {event.currentTurns} / {event.maxTurns} rodada(s)
  </div>
</div>

<style>
  .event-card {
    background: #1e1e2a;
    border-left: 6px solid #ffb74d;
    border-radius: 8px;
    padding: 12px;
    margin: 8px;
    position: relative;
    cursor: pointer;
    transition: all 0.2s;
  }
  .event-card.selected {
    background: #2a2a3a;
    border-left-color: #ffd966;
    box-shadow: 0 0 0 2px #ffd966;
  }
  .event-card.expired {
    opacity: 0.6;
    border-left-color: #888;
  }
  .remove {
    position: absolute;
    top: 8px;
    right: 8px;
    background: transparent;
    border: none;
    color: #aaa;
    cursor: pointer;
    font-size: 1.2rem;
  }
  .remove:hover {
    color: #ef5350;
  }
  h3 {
    margin: 0 0 4px 0;
    font-size: 1rem;
  }
  .source {
    font-size: 0.75rem;
    color: #ffb74d;
    margin: 0 0 8px 0;
    font-style: italic;
  }
  .turns {
    font-size: 0.8rem;
    color: #ccc;
  }
</style>