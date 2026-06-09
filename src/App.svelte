<script>
  import InitiativeTimeline from './lib/components/InitiativeTimeline.svelte';
  import AddCombatantForm from './lib/components/AddCombatantForm.svelte';
  import AddEventForm from './lib/components/AddEventForm.svelte';
  import { combatStore, saveCombat, loadCombat, clearCombat } from './lib/stores/combatStore';

  let selectedCount = 0;
  let damageAmount = 5;
  $: selectedCount = $combatStore.selectedIds.length;
  let showConditionMenu = false;
  let showBuffMenu = false;

  const negativeConditions = [
    'blinded', 'charmed', 'deafened', 'frightened', 
    'grappled', 'incapacitated', 'paralyzed', 'petrified', 
    'poisoned', 'prone', 'restrained', 'sleeping',
    'slowed', 'stunned', 'unconscious'
    ];
  const positiveBuffs = ['blessed', 'hasted', 'invisible', 'protected', 'regenerating'];

  function applyCondition(condition) {
    if ($combatStore.selectedIds.length === 0) return;
    combatStore.applyConditionToSelected(condition);
    showConditionMenu = false;
  }

  function removeCondition(condition) {
    if ($combatStore.selectedIds.length === 0) return;
    combatStore.removeConditionFromSelected(condition);
    showConditionMenu = false;
  }

  function applyBuff(buff) {
    if ($combatStore.selectedIds.length === 0) return;
    combatStore.applyConditionToSelected(buff);
    showBuffMenu = false;
  }

  function removeBuff(buff) {
    if ($combatStore.selectedIds.length === 0) return;
    combatStore.removeConditionFromSelected(buff);
    showBuffMenu = false;
  }

  function applyDamageToSelected() {
    if ($combatStore.selectedIds.length === 0) return;
    combatStore.applyDamage($combatStore.selectedIds, damageAmount);
  }
  function applyHealToSelected() {
    if ($combatStore.selectedIds.length === 0) return;
    combatStore.applyHeal($combatStore.selectedIds, damageAmount);
  }
</script>

<main class="container">
  <div class="header">
    <h1>Combat Tracker - Vincaeros</h1>
    <button class="round-btn" on:click={() => combatStore.nextRound()}>
      Próxima Rodada (Rodada {$combatStore.round})
    </button>
  </div>

  <div class="two-columns">
    <!-- Coluna esquerda: Lista de combatentes -->
    <div class="timeline-column">
      <InitiativeTimeline />
    </div>

    <!-- Coluna direita: Painel de controle -->
    <div class="controls-column">
        <h4>Control Panel</h4>
      <div class="mass-controls">
        <p>{selectedCount} combatant(s) selected</p>
        <!-- Menu Conditions -->
        <div class="condition-menu" style="position: relative;">
          <button on:click={() => { showConditionMenu = !showConditionMenu; showBuffMenu = false; }}>
            ☠️ Condition
          </button>
          {#if showConditionMenu}
            <div class="floating-menu two-columns">
              <div class="menu-column">
                <strong>Apply</strong>
                {#each negativeConditions as cond}
                  <button on:click={() => applyCondition(cond)}>{cond}</button>
                {/each}
              </div>
              <div class="menu-column">
                <strong>Remove</strong>
                {#each negativeConditions as cond}
                  <button on:click={() => removeCondition(cond)}>- {cond}</button>
                {/each}
              </div>
            </div>
          {/if}
        </div>

        <!-- Menu Buffs -->
        <div class="buff-menu" style="position: relative;">
          <button on:click={() => { showBuffMenu = !showBuffMenu; showConditionMenu = false; }}>
            ✨ Buff
          </button>
          {#if showBuffMenu}
            <div class="floating-menu two-columns">
              <div class="menu-column">
                <strong>Apply</strong>
                {#each positiveBuffs as buff}
                  <button on:click={() => applyBuff(buff)}>{buff}</button>
                {/each}
              </div>
              <div class="menu-column">
                <strong>Remove</strong>
                {#each positiveBuffs as buff}
                  <button on:click={() => removeBuff(buff)}>- {buff}</button>
                {/each}
              </div>
            </div>
          {/if}
        </div>
        <div class="damage-group">
          <input type="number" bind:value={damageAmount} min="0" step="1" />
          <button on:click={applyDamageToSelected}>Deal</button>
          <button on:click={applyHealToSelected}>Heal</button>
        </div>
      </div>

      <div class="add-form">
        <AddCombatantForm />
        <AddEventForm />
      </div>
      
      <div class="save-load-buttons">
        <button on:click={saveCombat}>💾</button>
        <button on:click={loadCombat}>📂</button>
        <button on:click={clearCombat}>🗑️</button>
      </div>
    </div>
  </div>
  <div class="footer">
    <p style="font-size: 0.75rem; margin-top: 10px;">Essa página foi desenvolvida como parte da Atividade
      Prática - Framework Svelte da disciplina de Programação WEB na FATEC Mogi Mirim, primeiro semestre de
      2026. Autores: Lucca Bellini Pena e Danielle Rachel Rios Moreira.</p>
  </div>
</main>

<style>
  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 12px;
    border-bottom: 2px solid #333;
    padding-bottom: 6px;
  }

  h1 {
    margin: 0;
    font-size: 1.8rem;
  }

  .footer {
    text-align: center;
    font-size: 0.8em;
    margin-top: 105px;
    color: #888;
  }

  .round-btn {
    background: #2a2a2a;
    border: 1px solid #b71c1c;
    padding: 8px 16px;
    border-radius: 4px;
    color: #e0e0e0;
    cursor: pointer;
    transition: all 0.2s;
  }
  .round-btn:hover {
    background: #b71c1c;
    border-color: #b71c1c;
  }

  .two-columns {
    display: flex;
    gap: 32px;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .timeline-column {
    flex: 2;
    min-width: 280px;
  }

  .controls-column {
    flex: 1;
    min-width: 280px;
    background: #111;
    border-radius: 8px;
    padding: 20px;
    border: 1px solid #333;
    margin: 10px 0;
  }

  .mass-controls {
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid #333;
  }

  .mass-controls p {
    margin: 0 0 8px 0;
    font-size: 0.9rem;
    color: #ccc;
  }

  /* Botões de Condition e Buff */
  .condition-menu, .buff-menu {
    display: inline-block;
    margin-right: 12px;
    margin-bottom: 2px;
    position: relative;
  }

  .condition-menu > button, .buff-menu > button {
    background: #2a2a2a;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    color: #e0e0e0;
    cursor: pointer;
    font-weight: bold;
    transition: background 0.2s;
  }
  .condition-menu > button:hover {
    background: #4caf50;
  }
  .buff-menu > button:hover {
    background: #ffd966;
    color: #1e1e1e;
  }

  /* Menu flutuante compartilhado */
  .floating-menu {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 8px;
    background: #1a1a1a;
    border: 1px solid #444;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    padding: 8px;
    min-width: 140px;
    z-index: 100;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .floating-menu strong {
    font-size: 0.7rem;
    color: #b71c1c;
    margin: 4px 0 2px;
    text-transform: uppercase;
  }

  .floating-menu button {
    background: #2a2a2a;
    border: none;
    padding: 6px 10px;
    text-align: left;
    border-radius: 4px;
    color: #e0e0e0;
    cursor: pointer;
    font-size: 0.8rem;
    transition: background 0.2s;
  }
  .floating-menu button:hover {
    background: #b71c1c;
  }

  .floating-menu.two-columns {
  display: flex;
  flex-direction: row;
  gap: 16px;
  min-width: 260px;
  }

  .menu-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .menu-column strong {
    font-size: 0.7rem;
    color: #b71c1c;
    margin-bottom: 4px;
  }

  /* Grupo de dano/cura */
  .damage-group {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    margin-top: 6px;
    padding-top: 6px;
  }

  .damage-group input {
    width: 80px;
    background: #1a1a1a;
    border: 1px solid #444;
    padding: 8px;
    border-radius: 4px;
    color: white;
    text-align: center;
  }

  .damage-group button {
    background: #2a2a2a;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    color: white;
    transition: background 0.2s;
  }
  .damage-group button:hover {
    background: #b71c1c;
  }

  .add-form {
    margin-top: 6px;
  }

  .save-load-buttons {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #333;
  justify-content: space-between;
  }

  .save-load-buttons button {
    flex: 1;
    background: #2a2a2a;
    border: 1px solid #b71c1c;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    color: #e0e0e0;
    font-weight: bold;
    transition: all 0.2s;
  }

  .save-load-buttons button:hover {
    background: #b71c1c;
    border-color: #b71c1c;
  }

  /* Responsivo */
  @media (max-width: 768px) {
    .two-columns {
      flex-direction: column;
    }
    .header {
      flex-direction: column;
      align-items: flex-start;
    }
    h1 {
      font-size: 1.4rem;
    }
    .floating-menu {
      position: static;
      margin-top: 8px;
    }
  }
</style>