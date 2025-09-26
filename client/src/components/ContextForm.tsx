import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

type ContentType = 'lyrics' | 'dialogue';

const MOODS = ['Happy', 'Sad', 'Romantic', 'Energetic', 'Peaceful', 'Dramatic', 'Spiritual', 'Nostalgic'];
const SONG_GENRES = ['Classical', 'Folk', 'Bollywood', 'Devotional', 'Sufi', 'Qawwali', 'Regional'];
const MOVIE_GENRES = ['Romance', 'Action', 'Comedy', 'Drama', 'Thriller', 'Family', 'Historical'];

interface ContextFormProps {
  contentType: ContentType;
  onContextChange: (context: any) => void;
}

export default function ContextForm({ contentType, onContextChange }: ContextFormProps) {
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [genre, setGenre] = useState('');
  const [theme, setTheme] = useState('');
  const [characters, setCharacters] = useState('');
  const [situation, setSituation] = useState('');
  
  const genres = contentType === 'lyrics' ? SONG_GENRES : MOVIE_GENRES;
  
  const addMood = (mood: string) => {
    if (!selectedMoods.includes(mood)) {
      const newMoods = [...selectedMoods, mood];
      setSelectedMoods(newMoods);
      updateContext({ moods: newMoods });
      console.log('Added mood:', mood);
    }
  };
  
  const removeMood = (mood: string) => {
    const newMoods = selectedMoods.filter(m => m !== mood);
    setSelectedMoods(newMoods);
    updateContext({ moods: newMoods });
    console.log('Removed mood:', mood);
  };
  
  const updateContext = (updates: any) => {
    const context = {
      moods: selectedMoods,
      genre,
      theme,
      characters,
      situation,
      ...updates
    };
    onContextChange(context);
  };
  
  const handleInputChange = (field: string, value: string) => {
    const updates = { [field]: value };
    if (field === 'genre') setGenre(value);
    if (field === 'theme') setTheme(value);
    if (field === 'characters') setCharacters(value);
    if (field === 'situation') setSituation(value);
    updateContext(updates);
    console.log(`Updated ${field}:`, value);
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Provide Context</h2>
        <p className="text-muted-foreground">
          Help us understand the mood, style, and theme for your {contentType === 'lyrics' ? 'song lyrics' : 'dialogue'}
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Mood Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Mood & Emotion</Label>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((mood) => {
              const isSelected = selectedMoods.includes(mood);
              return (
                <Badge
                  key={mood}
                  variant={isSelected ? "default" : "secondary"}
                  className="cursor-pointer hover-elevate"
                  onClick={() => isSelected ? removeMood(mood) : addMood(mood)}
                  data-testid={`badge-mood-${mood.toLowerCase()}`}
                >
                  {mood}
                  {isSelected && <X className="ml-1 h-3 w-3" />}
                </Badge>
              );
            })}
          </div>
          {selectedMoods.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Selected: {selectedMoods.join(', ')}
            </p>
          )}
        </div>
        
        {/* Genre Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Genre</Label>
          <Select value={genre} onValueChange={(value) => handleInputChange('genre', value)}>
            <SelectTrigger data-testid="select-genre">
              <SelectValue placeholder={`Choose ${contentType === 'lyrics' ? 'song' : 'movie'} genre`} />
            </SelectTrigger>
            <SelectContent>
              {genres.map((g) => (
                <SelectItem key={g} value={g.toLowerCase()}>{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Theme */}
        <div className="space-y-3">
          <Label htmlFor="theme" className="text-sm font-medium">
            Theme or Topic
          </Label>
          <Input
            id="theme"
            placeholder={contentType === 'lyrics' ? 'e.g., Love, Nature, Celebration' : 'e.g., Family values, Friendship, Justice'}
            value={theme}
            onChange={(e) => handleInputChange('theme', e.target.value)}
            data-testid="input-theme"
          />
        </div>
        
        {/* Characters (for dialogue) */}
        {contentType === 'dialogue' && (
          <div className="space-y-3">
            <Label htmlFor="characters" className="text-sm font-medium">
              Characters
            </Label>
            <Input
              id="characters"
              placeholder="e.g., Father and son, Two friends, Romantic couple"
              value={characters}
              onChange={(e) => handleInputChange('characters', e.target.value)}
              data-testid="input-characters"
            />
          </div>
        )}
        
        {/* Situation/Context */}
        <div className="space-y-3">
          <Label htmlFor="situation" className="text-sm font-medium">
            {contentType === 'lyrics' ? 'Situation or Setting' : 'Scene Context'}
          </Label>
          <Textarea
            id="situation"
            placeholder={
              contentType === 'lyrics'
                ? 'Describe the setting, occasion, or story behind the song...'
                : 'Describe the scene, conflict, or situation for the dialogue...'
            }
            value={situation}
            onChange={(e) => handleInputChange('situation', e.target.value)}
            className="min-h-[100px]"
            data-testid="textarea-situation"
          />
        </div>
      </div>
    </Card>
  );
}