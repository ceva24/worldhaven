interface EnhancementAction {
    name: string;
    type: string[];
}

interface EnhancementType {
    name: string;
    enhancements: string[];
}

interface Enhancement {
    name: string;
    imageUrl: string | null;
}

interface EnhanceableAbilityCard {
    imageUrl: string;
    enhancementSlots: AbilityCardEnhancementSlot[];
}

interface AbilityCardEnhancementSlot {
    id: number;
    action: string;
    x: number;
    y: number;
}

export { EnhancementAction, EnhancementType, Enhancement, EnhanceableAbilityCard, AbilityCardEnhancementSlot };
