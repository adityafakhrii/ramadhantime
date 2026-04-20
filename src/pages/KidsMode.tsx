import { useState } from "react";
import KidsCharacterSelect from "@/components/kids/KidsCharacterSelect";
import KidsDashboard from "@/components/kids/KidsDashboard";

export type KidsCharacter = "mili" | "tan" | null;

const KidsMode = () => {
    const [character, setCharacter] = useState<KidsCharacter>(null);

    if (!character) {
        return <KidsCharacterSelect onSelect={setCharacter} />;
    }

    return <KidsDashboard character={character} onBack={() => setCharacter(null)} />;
};

export default KidsMode;
