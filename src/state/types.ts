type Row = 'front' | 'back';
type SlotIndex = 0 | 1 | 2;
type SlotPosition = { row: Row; index: SlotIndex };
type GamePhase = 'opening' | 'main' | 'ended';
type CardType = 'Unit' | 'Spell' | 'Upgrade' | 'Companion';
type EvolutionStage = 1 | 2;
type Keyword = 'Ranged' | 'Charge';
type KeywordInstance = { keyword: Keyword; value?: number };

type CardDefinition = {
  id: string;
  name: string;
  type: CardType;
  cost: number;
  hp: number;
  attack: number;
  keywords: KeywordInstance[];
  evolutionTarget?: string;
  evolutionChargeThreshold?: number;
};

type CardInstance = {
  instanceId: string;
  definitionId: string;
  ownerId: string;
  currentHp: number;
  currentAttack: number;
  keywords: KeywordInstance[];
  hasAttackedThisTurn: boolean;
  hasMovedThisTurn: boolean;
  cost: number;
};

type CompanionInstance = CardInstance & {
  evolutionStage: EvolutionStage;
  charge: number;
  evolutionDefinitionId: string;
  evolutionChargeThreshold: number;
};

type Slot = { position: SlotPosition; occupant: CardInstance | CompanionInstance | null };

type BoardState = { front: [Slot, Slot, Slot]; back: [Slot, Slot, Slot] };

type PlayerState = {
  playerId: string;
  hand: CardInstance[];
  deck: CardInstance[];
  board: BoardState;
  companion: CompanionInstance;
  energy: number;
  energyMax: number;
  actionsRemaining: number;
  openingPlacements?: (FaceDownCard | null)[];
  unitsLost: number;
  evolutionTurn: number | null;
};

type GameState = {
  phase: GamePhase;
  players: [PlayerState, PlayerState];
  activePlayerId: string;
  turnNumber: number;
  winner: string | null;
  eventLog: string[];
};

type GameAction =
  | { type: 'PLAY_CARD'; cardInstanceId: string; targetSlot: SlotPosition; sourceSlot?: SlotPosition }
  | { type: 'MOVE_UNIT'; fromSlot: SlotPosition; toSlot: SlotPosition }
  | { type: 'ATTACK'; attackerSlot: SlotPosition; targetSlot: SlotPosition }
  | { type: 'ACTIVATE_ABILITY'; sourceSlot: SlotPosition; abilityId: string }
  | { type: 'END_TURN' }
  | { type: 'PLACE_CARD_FACE_DOWN'; cardInstanceId: string; playerId: string; targetSlot: { row: 'front' | 'back'; index: 0 | 1 | 2 } }
  | { type: 'REVEAL_BOARDS' };

type FaceDownCard = { instanceId: string; definitionId: string; ownerId: string; revealed: boolean };
