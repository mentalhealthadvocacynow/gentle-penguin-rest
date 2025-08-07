import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { showSuccess, showError } from "@/utils/toast";
import { Sparkles, Bookmark, Calendar, Lightbulb, Music, Volume2, VolumeX, Trophy, Flame, Star, Heart, Sun, Moon } from "lucide-react";

// Motivational quotes based on day of year
const dailyQuotes = [
  { quote: "Small daily improvements lead to stunning results.", author: "Robin Sharma" },
  { quote: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { quote: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  // Add more quotes...
];

// Daily affirmations
const affirmations = [
  "I am capable of achieving my goals",
  "Every day I grow stronger and more disciplined",
  "My habits shape my future",
  // Add more affirmations...
];

// Habit suggestions
const habitSuggestions = [
  { name: "Drink 8 glasses of water", icon: <Sparkles /> },
  { name: "30 minutes of exercise", icon: <Flame /> },
  { name: "Read 10 pages", icon: <Bookmark /> },
  // Add more suggestions...
];

const getDailyQuote = () => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return dailyQuotes[dayOfYear % dailyQuotes.length];
};

const getRandomAffirmation = () => {
  return affirmations[Math.floor(Math.random() * affirmations.length)];
};

const getRandomSuggestion = () => {
  return habitSuggestions[Math.floor(Math.random() * habitSuggestions.length)];
};

const Index = () => {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentAffirmation, setCurrentAffirmation] = useState(getRandomAffirmation());
  const [streakCounts, setStreakCounts] = useState({});
  const [dailyQuote] = useState(getDailyQuote());

  const toggleMusic = () => {
    setIsMusicPlaying(!isMusicPlaying);
  };

  const toggleSuggestions = () => {
    setShowSuggestions(!showSuggestions);
  };

  const addHabit = () => {
    if (newHabit.trim()) {
      const newHabitObj = {
        id: Date.now(),
        name: newHabit,
        completed: false,
        streak: 0,
        lastCompleted: null
      };
      setHabits([...habits, newHabitObj]);
      setNewHabit("");
      showSuccess("New habit added!");
    }
  };

  const toggleHabit = (id) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const today = new Date().toDateString();
        const completedToday = habit.lastCompleted === today;
        const newCompleted = !habit.completed;
        
        let newStreak = habit.streak;
        if (newCompleted && !completedToday) {
          newStreak = habit.streak + 1;
          showSuccess(`Great job! ${habit.name} streak: ${newStreak} days`, {
            icon: <Trophy className="text-yellow-500" />
          });
        } else if (!newCompleted) {
          newStreak = 0;
        }

        return {
          ...habit,
          completed: newCompleted,
          streak: newStreak,
          lastCompleted: newCompleted ? today : habit.lastCompleted
        };
      }
      return habit;
    }));
  };

  const addSuggestedHabit = (suggestion) => {
    setNewHabit(suggestion.name);
  };

  useEffect(() => {
    // Rotate affirmations every minute
    const interval = setInterval(() => {
      setCurrentAffirmation(getRandomAffirmation());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Flame className="text-orange-500" />
            Habit Streak Tracker
          </h1>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setShowMusicPlayer(!showMusicPlayer)}
            className="ml-4"
          >
            <Music className="w-4 h-4" />
          </Button>
        </div>

        {/* Daily Inspiration Section */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-medium">Daily Inspiration</h3>
          </div>
          <blockquote className="pl-6 border-l-4 border-blue-200 italic text-gray-700 mb-3">
            "{dailyQuote.quote}"
            <footer className="text-right text-sm text-gray-500 mt-1">— {dailyQuote.author}</footer>
          </blockquote>
          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
            <Star className="w-4 h-4 text-blue-500" />
            <p className="text-sm">{currentAffirmation}</p>
          </div>
        </div>

        {/* Music Player */}
        {showMusicPlayer && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow">
            {/* ... (keep existing music player code) */}
          </div>
        )}

        {/* Habit Suggestions */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Habit Suggestions
            </h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleSuggestions}
            >
              {showSuggestions ? "Hide" : "Show"} Suggestions
            </Button>
          </div>
          
          {showSuggestions && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
              {habitSuggestions.map((suggestion, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer"
                  onClick={() => addSuggestedHabit(suggestion)}
                >
                  <span className="text-blue-500">{suggestion.icon}</span>
                  <span>{suggestion.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Habit Tracker */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          <div className="flex gap-2 mb-4">
            <Input 
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              placeholder="Enter a new habit"
              className="flex-1"
            />
            <Button onClick={addHabit}>Add Habit</Button>
          </div>

          <div className="space-y-3">
            {habits.map(habit => (
              <div key={habit.id} className="flex items-center gap-3 p-2 border rounded">
                <Checkbox 
                  checked={habit.completed}
                  onCheckedChange={() => toggleHabit(habit.id)}
                  className="h-6 w-6"
                />
                <div className="flex-1">
                  <p className={`font-medium ${habit.completed ? 'line-through text-gray-400' : ''}`}>
                    {habit.name}
                  </p>
                  {habit.streak > 0 && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      {habit.streak} day streak!
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;