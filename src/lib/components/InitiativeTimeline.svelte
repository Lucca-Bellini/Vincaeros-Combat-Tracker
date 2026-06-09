<script>
  import { sortable } from '../actions/sortable';
  import { combatStore } from '../stores/combatStore';
  import CombatCard from './CombatCard.svelte';
  import EventCard from './EventCard.svelte';

  let container;

  function handleSortEnd(event) {
    const { oldIndex, newIndex } = event;
    if (oldIndex === newIndex) return;
    const currentItems = [...$combatStore.initiativeItems];
    const [moved] = currentItems.splice(oldIndex, 1);
    currentItems.splice(newIndex, 0, moved);
    combatStore.reorderInitiative(currentItems);
  }
</script>

<div class="timeline">
  <div
    bind:this={container}
    use:sortable={{ onEnd: handleSortEnd, animation: 200 }}
    class="dnd-container"
  >
    {#each $combatStore.initiativeItems as item (item.id + item.type)}
      {#if item.type === 'combatant'}
        {@const combatant = $combatStore.combatants.find(c => c.id === item.id)}
        {#if combatant}
          <div data-id={combatant.id}>
            <CombatCard
              combatant={combatant}
              selected={$combatStore.selectedIds.includes(combatant.id)}
            />
          </div>
        {/if}
      {:else if item.type === 'event'}
        {@const event = $combatStore.events.find(e => e.id === item.id)}
        {#if event}
          <div data-id={event.id}>
            <EventCard
              event={event}
              selected={$combatStore.selectedIds.includes(event.id)}
            />
          </div>
        {/if}
      {/if}
    {/each}
  </div>
  {#if $combatStore.initiativeItems.length === 0}
    <p class="empty">Timeline is empty. Add combatants or events.</p>
  {/if}
</div>

<style>
  .timeline {
    background: #111;
    border-radius: 8px;
    padding: 10px;
    margin: 10px 0;
  }
  .dnd-container {
    min-height: 200px;
  }
  .empty {
    text-align: center;
    color: #aaa;
    padding: 30px;
  }
</style>