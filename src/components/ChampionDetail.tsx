import { useState, useEffect } from 'react';
import './ChampionDetail.css'; // Separate CSS file for styling

// Interfaces for Detailed Champion Data (based on Data Dragon structure)
interface ChampionSpell {
  id: string;
  name: string;
  description: string;
  image: {
    full: string;
  };
}

interface ChampionPassive {
    name: string;
    description: string;
    image: {
        full: string;
    };
}

interface ChampionStats {
  hp: number;
  hpperlevel: number;
  mp: number;
  mpperlevel: number;
  movespeed: number;
  armor: number;
  armorperlevel: number;
  spellblock: number; // Magic Resist
  spellblockperlevel: number;
  attackrange: number;
  hpregen: number;
  hpregenperlevel: number;
  mpregen: number;
  mpregenperlevel: number;
  crit: number;
  critperlevel: number;
  attackdamage: number;
  attackdamageperlevel: number;
  attackspeedperlevel: number;
  attackspeed: number; // Note: This is often an offset
}

interface DetailedChampionData {
  id: string;
  key: string;
  name: string;
  title: string;
  lore: string;
  blurb: string; // Short description
  info: { // In-game difficulty, etc.
    attack: number;
    defense: number;
    magic: number;
    difficulty: number;
  };
  image: { // Main image (Splash art, etc.)
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
  tags: string[]; // Roles (Fighter, Mage, etc.)
  partype: string; // Resource type (Mana, Energy, etc.)
  stats: ChampionStats;
  spells: ChampionSpell[];
  passive: ChampionPassive;
  allytips?: string[];
  enemytips?: string[];
}

// Structure for the single champion response from the API
interface SingleChampionResponse {
  type: string;
  format: string;
  version: string;
  data: {
    [key: string]: DetailedChampionData; // Champion ID is used as the key
  };
}


interface ChampionDetailProps {
  championId: string;
  version: string | null;
  selectedLanguage: string;
  onClose: () => void; // Function to close the details view
}

const ChampionDetail: React.FC<ChampionDetailProps> = ({ championId, version, selectedLanguage, onClose }) => {
  const [details, setDetails] = useState<DetailedChampionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!version || !championId || !selectedLanguage) return;

    setLoading(true);
    setError(null);
    setDetails(null); // Clear previous details when loading a new champion

    // Fetch details for the specific champion in the selected language
    fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/${selectedLanguage}/champion/${championId}.json`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok for ${championId} in ${selectedLanguage}`);
        }
        return response.json();
      })
      .then((data: SingleChampionResponse) => {
        // Get the champion data object (it's nested under the champion ID key)
        const championData = Object.values(data.data)[0];
        setDetails(championData);
      })
      .catch(error => {
        console.error("Error fetching champion details:", error);
        setError(`Failed to load details for ${championId}.`);
      })
      .finally(() => {
        setLoading(false);
      });

  }, [championId, version, selectedLanguage]); // Re-fetch if champion, version, or language changes

  // Loading state display
  if (loading) return <div className="champion-detail loading">Loading details...</div>;
  // Error state display
  if (error) return <div className="champion-detail error">{error} <button onClick={onClose}>Close</button></div>;
  // No details found display
  if (!details) return <div className="champion-detail error">No details found. <button onClick={onClose}>Close</button></div>;

  // Simple regex to remove HTML tags from Data Dragon skill descriptions
  const cleanDescription = (description: string) => {
      return description.replace(/<[^>]*>/g, '');
  };

  // Helper function to construct skill image URLs
  const getSkillImageUrl = (imageName: string) => {
      return `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${imageName}`;
  }
  // Helper function to construct passive image URLs
  const getPassiveImageUrl = (imageName: string) => {
    return `https://ddragon.leagueoflegends.com/cdn/${version}/img/passive/${imageName}`;
}

  return (
    <div className="champion-detail">
      <button onClick={onClose} className="close-button">Back to List</button>
      <h2>{details.name} - {details.title}</h2>
      
      {/* Header section with Splash Art and Lore */}
      <div className="champion-header">
            <img 
                src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${details.id}_0.jpg`} 
                alt={`${details.name} Splash Art`}
                className="champion-splash"
            />
            <div className="champion-lore">
                 <h3>Lore</h3>
                 <p>{details.lore}</p>
            </div>
       </div>

      {/* Stats Section */}
      <h3>Stats</h3>
      <div className="champion-stats">
        <div>HP: {details.stats.hp} (+{details.stats.hpperlevel} per level)</div>
        <div>{details.partype}: {details.stats.mp} (+{details.stats.mpperlevel} per level)</div>
        <div>Armor: {details.stats.armor} (+{details.stats.armorperlevel} per level)</div>
        <div>Magic Resist: {details.stats.spellblock} (+{details.stats.spellblockperlevel} per level)</div>
        <div>Attack Damage: {details.stats.attackdamage} (+{details.stats.attackdamageperlevel} per level)</div>
        <div>Attack Speed: {details.stats.attackspeed.toFixed(3)} (+{details.stats.attackspeedperlevel}% per level)</div>
        <div>Move Speed: {details.stats.movespeed}</div>
        <div>Attack Range: {details.stats.attackrange}</div>
        {/* Other stats could be added here */}
      </div>

      {/* Gameplay Tips Section */}
      {(details.allytips?.length || details.enemytips?.length) && (
          <div className="gameplay-tips">
              <h3>Gameplay Tips</h3>
              <div className="tips-container">
                  {/* Ally Tips Column */}
                  {details.allytips && details.allytips.length > 0 && (
                      <div className="tips-column ally-tips-column">
                          <h4>Playing As {details.name}</h4>
                          <ul>
                              {details.allytips.map((tip, index) => (
                                  <li key={`ally-${index}`}>{cleanDescription(tip)}</li>
                              ))}
                          </ul>
                      </div>
                  )}
                  {/* Enemy Tips Column */}
                  {details.enemytips && details.enemytips.length > 0 && (
                      <div className="tips-column enemy-tips-column">
                          <h4>Playing Against {details.name}</h4>
                          <ul>
                              {details.enemytips.map((tip, index) => (
                                  <li key={`enemy-${index}`}>{cleanDescription(tip)}</li>
                              ))}
                          </ul>
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* Abilities Section */}
      <h3>Abilities</h3>
      <div className="champion-abilities">
         {/* Passive Ability */}
         <div className="ability passive">
          <img src={getPassiveImageUrl(details.passive.image.full)} alt={details.passive.name} />
          <div>
            <strong>{details.passive.name} (Passive)</strong>
            <p>{cleanDescription(details.passive.description)}</p>
          </div>
        </div>
         {/* Champion Spells (Q, W, E, R) */}
        {details.spells.map((spell, index) => (
          <div key={spell.id} className="ability">
             <img src={getSkillImageUrl(spell.image.full)} alt={spell.name} />
            <div>
              <strong>{spell.name} ({['Q', 'W', 'E', 'R'][index]})</strong>
              <p>{cleanDescription(spell.description)}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ChampionDetail; 