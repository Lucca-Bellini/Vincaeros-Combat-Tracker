<script>
  import { combatStore } from '../stores/combatStore';

  let name = '';
  let ac = '';
  let maxHp = '';

  function add() {
    if (!name.trim()) return;
    const finalAc = ac === '' ? 10 : parseInt(ac, 10);
    const finalMaxHp = maxHp === '' ? 1 : parseInt(maxHp, 10);
    combatStore.addCombatant({
      name: name.trim(),
      ac: finalAc,
      maxHp: finalMaxHp,
    });
    name = '';
    ac = '';
    maxHp = '';
  }
</script>

<div class="form">
  <h3>+ Add Combatant</h3>
  <div class="form-row">
    <div class="field">
      <label for="name-input">Name</label>
      <input id="name-input" type="text" bind:value={name} placeholder="Name" />
    </div>
    <div class="field">
      <label for="ac-input">AC</label>
      <input id="ac-input" type="number" bind:value={ac} placeholder="Default: 10" min="1" />
    </div>
    <div class="field">
      <label for="hp-input">Max HP</label>
      <input id="hp-input" type="number" bind:value={maxHp} placeholder="Default: 1" min="1" />
    </div>
  </div>
  <button on:click={add}>Add to Initiative</button>
</div>

<style>
  .form {
    margin-top: 10px;
  }
  .form h3 {
    font-size: 1rem;
    margin-bottom: 8px;
    color: #ffb74d;
  }
  .form-row {
    display: flex;
    gap: 16px;
    flex-wrap: wrap; /* quebra em mobile, se necessário */
    align-items: flex-end;
  }
  .field {
    flex: 1;
    min-width: 100px; /* evita que fique muito estreito */
  }
  label {
    display: block;
    margin-bottom: 4px;
    font-size: 0.85rem;
    color: #ccc;
  }
  input {
    width: 100%;
    padding: 8px 12px;
    background: #1a1a1a;
    border: 1px solid #444;
    border-radius: 4px;
    color: #e0e0e0;
  }
  input:focus {
    border-color: #b71c1c;
    outline: none;
  }
  button {
    display: block;
    width: 100%;
    margin-top: 16px;
    background: #b71c1c;
    border: none;
    padding: 10px;
    border-radius: 4px;
    color: white;
    font-weight: bold;
    cursor: pointer;
  }
  button:hover {
    background: #8b0000;
  }

  /* Responsivo: em telas muito pequenas, os campos empilham */
  @media (max-width: 480px) {
    .form-row {
      flex-direction: column;
      gap: 12px;
    }
    button {
      margin-top: 12px;
    }
  }
</style>