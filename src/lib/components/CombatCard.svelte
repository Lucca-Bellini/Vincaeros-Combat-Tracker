<script>
  export let combatant;
  export let selected = false;

  import { combatStore } from '../stores/combatStore';

  let damageAmount = 5;
  let showConditionMenu = false;
  let showBuffMenu = false;

  const negativeConditions = [
    'blinded', 'charmed', 'deafened', 'frightened', 
    'grappled', 'incapacitated', 'paralyzed', 'petrified', 
    'poisoned', 'prone', 'restrained', 'sleeping',
    'slowed', 'stunned', 'unconscious'
    ];
  const positiveBuffs = ['blessed', 'hasted', 'invisible', 'protected', 'regenerating'];


  function takeDamage(amount) {
    if (amount > 0) combatStore.applyDamage([combatant.id], amount);
  }
  function heal(amount) {
    if (amount > 0) combatStore.applyHeal([combatant.id], amount);
  }
  function toggleCondition(cond) {
    combatStore.toggleCondition(combatant.id, cond);
    showConditionMenu = false;
    showBuffMenu = false;
  }
  function handleSelect() {
    combatStore.toggleSelect(combatant.id);
  }

  $: cardClass = `combat-card ${selected ? 'selected' : ''} ${combatant.conditions.map(c => `status-${c}`).join(' ')}`;
</script>

<div
  class={cardClass}
  role="button"
  tabindex="0"
  on:click={handleSelect}
  on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelect()}
>
  <button class="remove" draggable="false" on:click|stopPropagation={() => combatStore.removeCombatant(combatant.id)}>✖</button>

  <h3>{combatant.name}</h3>
  <div class="stats">AC {combatant.ac} | HP {combatant.hp}/{combatant.maxHp}</div>

  <div class="conditions-bar">
    <button class="effect-btn" draggable="false" on:click|stopPropagation={() => { showConditionMenu = !showConditionMenu; showBuffMenu = false; }}>
      ☠️ Condition
    </button>
    <button class="buff-btn" draggable="false" on:click|stopPropagation={() => { showBuffMenu = !showBuffMenu; showConditionMenu = false; }}>
      ✨ Buff
    </button>

    {#if showConditionMenu}
      <div class="menu-dropdown">
        {#each negativeConditions as cond}
          <button draggable="false" on:click|stopPropagation={() => toggleCondition(cond)}>{cond}</button>
        {/each}
      </div>
    {/if}
    {#if showBuffMenu}
      <div class="menu-dropdown">
        {#each positiveBuffs as buff}
          <button draggable="false" on:click|stopPropagation={() => toggleCondition(buff)}>{buff}</button>
        {/each}
      </div>
    {/if}

    <div class="active-conditions">
      {#each combatant.conditions as cond}
        <button class="badge" draggable="false" on:click|stopPropagation={() => toggleCondition(cond)}>{cond}</button>
      {/each}
    </div>
  </div>

  <div class="actions">
    <input type="number" bind:value={damageAmount} min="0" step="1" class="damage-input" on:click|stopPropagation />
    <button draggable="false" on:click|stopPropagation={() => takeDamage(damageAmount)}>Deal</button>
    <button draggable="false" on:click|stopPropagation={() => heal(damageAmount)}>Heal</button>
  </div>
</div>

<style>
  .combat-card {
    background: #1e1e1e;
    border-left: 6px solid #b71c1c;
    border-radius: 8px;
    padding: 12px;
    margin: 8px;
    transition: all 0.2s;
    cursor: pointer;
    position: relative;
  }
  .combat-card.selected {
    background: #2a2a2a;
    border-left-color: #ffd966;
    box-shadow: 0 0 0 2px #ffd966;
  }
  
  /* Condition Visuals */
  .status-blinded { filter: blur(0.75px); background: #1a1a2a; }
  .status-charmed { background: #2a1a3a; border-left-color: #e91e63; }
  .status-deafened { filter: brightness(0.9); }
  .status-frightened { background: #2a1a1a; border-left-color: #9c27b0; }
  .status-grappled { border-left-style: double; }
  .status-incapacitated { opacity: 0.7; }
  .status-paralyzed { background: #2a2a2a; filter: grayscale(0.3); }
  .status-petrified { background: #3a3a3a; filter: grayscale(0.8); }
  .status-poisoned { background: #2a3a2a; border-left-color: #4caf50; }
  .status-prone { transform: rotate(0.5deg)}
  .status-restrained { border-left-width: 8px; }
  .status-sleeping { filter: brightness(0.7); background: #1a2a2a; }
  .status-slowed { filter: brightness(0.8); transition: all 0.2s; }
  .status-stunned { filter: blur(0.5px); background: #2a2a1a; }
  .status-unconscious { filter: grayscale(0.5) brightness(0.5); background: #111; }

  /* Buff Visuals */
  .status-blessed { background: #ffffcc20; border-left-color: #ffd966; }
  .status-hasted { background: #ccffff20; border-left-color: #00bcd4; }
  .status-invisible { opacity: 0.6; filter: blur(0.3px); }
  .status-protected { border-left-color: #ff9800; box-shadow: inset 0 0 8px rgba(255,152,0,0.2); }
  .status-regenerating { animation: pulse 1s infinite; }
  @keyframes pulse {
    0% { background: #1e1e1e; }
    50% { background: #2a4a2a; }
    100% { background: #1e1e1e; }
  }

  .stats {
    font-size: 0.9rem;
    margin: 5px 0;
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
    padding: 0;
    line-height: 1;
  }
  .remove:hover {
    color: #ef5350;
  }

  .conditions-bar {
    display: flex;
    gap: 8px;
    margin: 8px 0;
    align-items: center;
    flex-wrap: wrap;
    position: relative;
  }
  .effect-btn, .buff-btn {
    background: #2a2a2a;
    border: none;
    color: #e0e0e0;
    font-size: 0.8rem;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
  }
  .effect-btn:hover { background: #4caf50; }
  .buff-btn:hover { background: #ffd966; color: #1e1e1e; }

  .menu-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    background: #1a1a1a;
    border: 1px solid #444;
    border-radius: 4px;
    z-index: 10;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 4px;
  }
  .menu-dropdown button {
    background: #2a2a2a;
    border: none;
    color: #e0e0e0;
    padding: 4px 8px;
    text-align: left;
    cursor: pointer;
    border-radius: 3px;
  }
  .menu-dropdown button:hover {
    background: #b71c1c;
  }

  .active-conditions {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
  }
  .badge {
    background: #333;
    border: none;
    padding: 2px 6px;
    border-radius: 12px;
    font-size: 0.7rem;
    text-transform: capitalize;
    cursor: pointer;
    color: #e0e0e0;
  }
  .badge:hover {
    background: #ef5350;
  }

  .actions {
    display: flex;
    gap: 6px;
    align-items: center;
    margin-top: 10px;
  }
  .damage-input {
    width: 65px;
    background: #111;
    border: 1px solid #444;
    color: white;
    padding: 4px;
    border-radius: 4px;
    text-align: center;
  }
  .actions button {
    background: #444;
    border: none;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
  }
  .actions button:hover {
    background: #b71c1c;
  }
</style>