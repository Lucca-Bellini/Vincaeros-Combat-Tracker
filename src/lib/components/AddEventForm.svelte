<script>
  import { combatStore } from '../stores/combatStore';

  let name = '';
  let source = '';
  let maxTurns = '';

  function add() {
    if (!name.trim()) return;
    combatStore.addEvent({
      name: name.trim(),
      source: source.trim() || 'Desconhecido',
      maxTurns: maxTurns === '' ? 10 : parseInt(maxTurns, 10)
    });
    name = '';
    source = '';
    maxTurns = '';
  }
</script>

<div class="form">
  <h3>+ Add Event</h3>
  <div class="form-row">
    <div class="field">
      <label for="name-input">Name</label>
      <input id="name-input" type="text" bind:value={name} placeholder="Name" />
    </div>
    <div class="field">
      <label for="source-input">Source</label>
      <input id="source-input" type="text" bind:value={source} placeholder="Source" />
    </div>
    <div class="field">
      <label for="duration-input">Duration (rounds)</label>
      <input id="duration-input" type="number" bind:value={maxTurns} placeholder="Default: 10" min="1" max="100" />
    </div>
  </div>
  <button on:click={add}>Add Event</button>
</div>

<style>
  .form {
    margin-top: 20px;
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