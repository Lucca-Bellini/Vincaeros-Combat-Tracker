// src/lib/stores/combatStore.js
import { writable, get } from 'svelte/store';

function generateId() {
  return Date.now() + '-' + Math.random().toString(36).substring(2, 6);
}

/**
 * @typedef {Object} Combatant
 * @property {string} id
 * @property {string} name
 * @property {number} ac
 * @property {number} hp
 * @property {number} maxHp
 * @property {string[]} conditions
 */

/**
 * @typedef {Object} BattleEvent
 * @property {string} id
 * @property {string} name
 * @property {string} source
 * @property {number} maxTurns
 * @property {number} currentTurns
 * @property {boolean} isEvent
 */

/**
 * @typedef {Object} InitiativeItem
 * @property {'combatant' | 'event'} type
 * @property {string} id
 */

/**
 * @typedef {Object} CombatState
 * @property {Combatant[]} combatants
 * @property {BattleEvent[]} events
 * @property {InitiativeItem[]} initiativeItems
 * @property {number} round
 * @property {string[]} selectedIds
 */

function createCombatStore() {
  const { subscribe, set, update } = writable({
    combatants: [],
    events: [],
    initiativeItems: [],
    round: 1,
    selectedIds: [],
  });

  return {
    subscribe, 
    set, 
    update,
    // Adiciona combatente
    addCombatant: (combatant) => update((state) => {
      const newCombatant = {
        ...combatant,
        id: generateId(),
        hp: combatant.maxHp,
        conditions: [],
      };
      const newInitiativeItem = { type: 'combatant', id: newCombatant.id };
      return {
        ...state,
        combatants: [...state.combatants, newCombatant],
        initiativeItems: [...state.initiativeItems, newInitiativeItem],
      };
    }),
    // Remove combatente
    removeCombatant: (id) => update((state) => ({
      ...state,
      combatants: state.combatants.filter(c => c.id !== id),
      initiativeItems: state.initiativeItems.filter(item => !(item.type === 'combatant' && item.id === id)),
      selectedIds: state.selectedIds.filter(s => s !== id),
    })),
    // Adiciona evento
    addEvent: (eventData) => update((state) => {
      const newEvent = {
        ...eventData,
        id: generateId(),
        isEvent: true,
        currentTurns: eventData.maxTurns,
      };
      const newInitiativeItem = { type: 'event', id: newEvent.id };
      return {
        ...state,
        events: [...state.events, newEvent],
        initiativeItems: [...state.initiativeItems, newInitiativeItem],
      };
    }),
    // Remove evento
    removeEvent: (id) => update((state) => ({
      ...state,
      events: state.events.filter(e => e.id !== id),
      initiativeItems: state.initiativeItems.filter(item => !(item.type === 'event' && item.id === id)),
      selectedIds: state.selectedIds.filter(s => s !== id),
    })),
    // Aplica dano a combatentes (lista de ids)
    applyDamage: (ids, amount) => update((state) => ({
      ...state,
      combatants: state.combatants.map(c =>
        ids.includes(c.id) ? { ...c, hp: Math.max(0, c.hp - amount) } : c
      ),
    })),
    // Aplica cura
    applyHeal: (ids, amount) => update((state) => ({
      ...state,
      combatants: state.combatants.map(c =>
        ids.includes(c.id) ? { ...c, hp: Math.min(c.maxHp, c.hp + amount) } : c
      ),
    })),
    // Alterna condição em combatente
    toggleCondition: (id, condition) => update((state) => ({
      ...state,
      combatants: state.combatants.map(c =>
        c.id === id
          ? { ...c, conditions: c.conditions.includes(condition) ? c.conditions.filter(cond => cond !== condition) : [...c.conditions, condition] }
          : c
      ),
    })),
    // Aplica condição a múltiplos combatentes (selecionados)
    applyConditionToSelected: (condition) => update((state) => ({
      ...state,
      combatants: state.combatants.map(c =>
        state.selectedIds.includes(c.id)
          ? { ...c, conditions: c.conditions.includes(condition) ? c.conditions : [...c.conditions, condition] }
          : c
      ),
    })),
    // Remove condição de múltiplos combatentes
    removeConditionFromSelected: (condition) => update((state) => ({
      ...state,
      combatants: state.combatants.map(c =>
        state.selectedIds.includes(c.id)
          ? { ...c, conditions: c.conditions.filter(cond => cond !== condition) }
          : c
      ),
    })),
    // Seleciona/deseleciona um item (combatente ou evento)
    toggleSelect: (id) => update((state) => ({
      ...state,
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter(s => s !== id)
        : [...state.selectedIds, id],
    })),
    // Reordena a lista unificada de iniciativa (após drag-and-drop)
    reorderInitiative: (newItems) => update((state) => ({
      ...state,
      initiativeItems: newItems,
    })),
    // Avança rodada: decrementa contadores de eventos e incrementa round
    nextRound: () => update((state) => {
      const updatedEvents = state.events.map(e => ({
        ...e,
        currentTurns: Math.max(0, e.currentTurns - 1),
      }));
      return {
        ...state,
        events: updatedEvents,
        round: state.round + 1,
      };
    }),
    // Reseta completamente o estado
    reset: () => set({
      combatants: [],
      events: [],
      initiativeItems: [],
      round: 1,
      selectedIds: [],
    }),
  };
}

// Exporta a store
export const combatStore = createCombatStore();

// --- Persistência corrigida ---
export function saveCombat() {
  // Obtém o estado atual da store (usando get com a store)
  const state = {
    combatants: get(combatStore).combatants,
    events: get(combatStore).events,
    initiativeItems: get(combatStore).initiativeItems,
    round: get(combatStore).round,
    selectedIds: get(combatStore).selectedIds,
  };
  localStorage.setItem('combat-tracker-state', JSON.stringify(state));
  console.log('Combate salvo com sucesso!'); // feedback
}

export function loadCombat() {
  const saved = localStorage.getItem('combat-tracker-state');
  if (saved) {
    try {
      const state = JSON.parse(saved);
      // Validação básica: se existem as propriedades essenciais
      if (state.combatants !== undefined && state.initiativeItems !== undefined) {
        combatStore.set(state);
        console.log('Combate carregado com sucesso!');
      } else {
        console.warn('Estado salvo inválido');
      }
    } catch (e) {
      console.error('Erro ao carregar combate', e);
    }
  } else {
    console.log('Nenhum combate salvo encontrado');
  }
}

export function clearCombat() {
  localStorage.removeItem('combat-tracker-state');
  combatStore.reset();
  console.log('Dados de combate removidos');
}