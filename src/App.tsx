import { useState, useEffect } from 'react'
import './App.css'
import ChampionDetail from './components/ChampionDetail'

// Data structure for champion data from Data Dragon
interface ChampionData {
  id: string;
  key: string;
  name: string;
  title: string;
  image: {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
  tags: string[]; // Roles (Fighter, Mage, etc.) - Already existed
}

// Structure for the full champions response from the API
interface AllChampionsResponse {
  type: string;
  format: string;
  version: string;
  data: {
    [key: string]: ChampionData;
  };
}

// Manual mapping for common language codes to display names
const languageDisplayNames: { [key: string]: string } = {
  en_US: 'English (US)',
  tr_TR: 'Türkçe',
  ko_KR: '한국어',
  ja_JP: '日本語',
  es_ES: 'Español (España)',
  es_MX: 'Español (México)',
  fr_FR: 'Français',
  de_DE: 'Deutsch',
  it_IT: 'Italiano',
  pl_PL: 'Polski',
  pt_BR: 'Português (Brasil)',
  ru_RU: 'Русский',
  zh_CN: '中文 (中国)', // Simplified Chinese
  zh_TW: '中文 (台灣)', // Traditional Chinese
  // Add more mappings as needed
};

function App() {
  const [allChampions, setAllChampions] = useState<ChampionData[]>([])
  const [filteredChampions, setFilteredChampions] = useState<ChampionData[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingLanguages, setLoadingLanguages] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [version, setVersion] = useState<string | null>(null)
  const [selectedChampion, setSelectedChampion] = useState<ChampionData | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [availableRoles, setAvailableRoles] = useState<string[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en_US')
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([])

  // Fetch the latest Data Dragon version
  useEffect(() => {
    fetch('https://ddragon.leagueoflegends.com/api/versions.json')
      .then(response => response.ok ? response.json() : Promise.reject('Failed to fetch version'))
      .then(data => setVersion(data[0]))
      .catch(error => {
        console.error("Error fetching version:", error);
        setError(prev => prev || 'Failed to load version data.');
      });
  }, []);

  // Fetch available languages and keep ONLY those with display name mappings
  useEffect(() => {
    setLoadingLanguages(true);
    fetch('https://ddragon.leagueoflegends.com/cdn/languages.json')
        .then(response => response.ok ? response.json() : Promise.reject('Failed to fetch languages'))
        .then((data: string[]) => {
            // Filter: Only keep languages with a key in languageDisplayNames
            const supportedLanguages = data.filter(langCode => languageDisplayNames.hasOwnProperty(langCode));
            setAvailableLanguages(supportedLanguages);
            // If the current selected language is not supported, fallback to English (optional)
            if (!supportedLanguages.includes(selectedLanguage)) {
                setSelectedLanguage('en_US');
            }
        })
        .catch(error => {
            console.error("Error fetching languages:", error);
            setError(prev => prev || 'Failed to load language options.');
            // Fallback to only English on error
            setAvailableLanguages(['en_US']); 
            setSelectedLanguage('en_US');
        })
        .finally(() => {
            setLoadingLanguages(false);
        });
  }, []);

  // Fetch champions and roles (triggers on language change too)
  useEffect(() => {
    if (!version || !selectedLanguage) return;

    setLoading(true);
    fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/${selectedLanguage}/champion.json`)
      .then(response => response.ok ? response.json() : Promise.reject('Failed to fetch champions for ' + selectedLanguage))
      .then((data: AllChampionsResponse) => {
        const championsArray = Object.values(data.data);
        setAllChampions(championsArray);
        setFilteredChampions(championsArray);
        setError(null);

        if (availableRoles.length === 0) {
            const roles = new Set<string>();
            championsArray.forEach(champ => champ.tags.forEach(tag => roles.add(tag)));
            setAvailableRoles(Array.from(roles).sort());
        }
      })
      .catch(error => {
        console.error("Error fetching champions:", error);
        setError('Failed to load champion data.');
        setAllChampions([]);
        setFilteredChampions([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [version, selectedLanguage]);

  // Filter the list when search term, role filter, or source list changes
  useEffect(() => {
    let tempChampions = allChampions;

    if (selectedRole) {
      tempChampions = tempChampions.filter((champion: ChampionData) =>
        champion.tags.includes(selectedRole)
      );
    }

    if (searchTerm) {
      tempChampions = tempChampions.filter((champion: ChampionData) =>
        champion.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredChampions(tempChampions);

  }, [searchTerm, selectedRole, allChampions, selectedLanguage]);

  // Champion click handler
  const handleChampionClick = (champion: ChampionData) => {
    setSelectedChampion(champion)
  }

  // Detail view close handler
  const handleCloseDetail = () => {
    setSelectedChampion(null)
  }

  return (
    <div className="App">
      <h1>LoL Champion Hub</h1>

      {/* Show filters and language selector only if detail view is not active */}
      {!selectedChampion && (
          <div className="controls-container">
            <div className="filters">
                {/* Search Input */}
                <input 
                    type="text"
                    placeholder="Search Champion..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                {/* Role Filters */}
                <div className="role-filters">
                    {/* 'All' button */}
                    <button 
                        onClick={() => setSelectedRole(null)} 
                        className={!selectedRole ? 'active' : ''}
                    >
                        All
                    </button>
                    {/* Role buttons */}
                    {availableRoles.map(role => (
                        <button 
                            key={role} 
                            onClick={() => setSelectedRole(role)} 
                            className={selectedRole === role ? 'active' : ''}
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </div>
            {/* Language Selector */}
            <div className="language-selector">
                <label htmlFor="language-select">Language:</label>
                <select 
                    id="language-select"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    disabled={loadingLanguages}
                >
                    {loadingLanguages ? (
                        <option>Loading...</option>
                    ) : (
                        availableLanguages.map(lang => (
                            <option key={lang} value={lang}>
                                {languageDisplayNames[lang] || lang} {/* Display name or code fallback */}
                            </option>
                        ))
                    )}
                </select>
            </div>
          </div>
      )}
      
      {/* Loading or Error Message */}
      {loading && !selectedChampion && <p>Loading champions...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Champion Detail (pass selectedLanguage prop) */}
      {selectedChampion && version && selectedLanguage && (
        <ChampionDetail 
            championId={selectedChampion.id} 
            version={version}
            selectedLanguage={selectedLanguage}
            onClose={handleCloseDetail} 
        />
      )}

      {/* Champion List (Filtered) */}
      {!loading && !error && !selectedChampion && (
        <div className="champion-list">
          {filteredChampions.length > 0 ? (
             filteredChampions.map(champion => (
                <div 
                key={champion.id} 
                className="champion-card" 
                onClick={() => handleChampionClick(champion)}
                >
                <img 
                    src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champion.image.full}`} 
                    alt={champion.name} 
                    className="champion-icon"
                />
                <p>{champion.name}</p>
                </div>
             ))
          ) : (
            // Show message if no champions match filters
            <p className="no-results">No champions found matching your criteria.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;