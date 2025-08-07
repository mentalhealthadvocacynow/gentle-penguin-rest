import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { showSuccess, showError } from "@/utils/toast";
import { Sparkles, Bookmark, Calendar, Lightbulb, Music, Volume2, VolumeX, Trophy, Flame, Star, Heart, Sun, Moon, Clock, History, Info } from "lucide-react";

// Motivational quotes based on day of year
const dailyQuotes = [
  { quote: "Small daily improvements lead to stunning results.", author: "Robin Sharma" },
  { quote: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { quote: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  // Add more quotes...
];

// Daily fun facts
const funFacts = [
  "It takes 21 days to form a basic habit, but 66 days on average to make it automatic",
  "People who track their habits are 3x more likely to achieve their goals",
  "Writing down your goals makes you 42% more likely to achieve them",
  // Add more facts...
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
  return {
    ...dailyQuotes[dayOfYear % dailyQuotes.length],
    date: new Date().toLocaleDateString(),
    dayOfYear
  };
};

const getRandomAffirmation = () => {
  return affirmations[Math.floor(Math.random() * affirmations.length)];
};

const getRandomFunFact = () => {
  return funFacts[Math.floor(Math.random() * funFacts.length)];
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
  const [showHistory, setShowHistory] = useState(false);
  const [currentAffirmation, setCurrentAffirmation] = useState(getRandomAffirmation());
  const [currentFunFact, setCurrentFunFact] = useState(getRandomFunFact());
  const [dailyQuote, setDailyQuote] = useState(getDailyQuote());
  const [history, setHistory] = useState(() => {
    // Initialize with today's entry
    const today = getDailyQuote();
    return [{
      date: today.date,
      quote: today.quote,
      author: today.author,
      affirmation: getRandomAffirmation(),
      funFact: getRandomFunFact()
    }];
  });

  const toggleMusic = () => {
    setIsMusicPlaying(!isMusicPlaying);
  };

  const toggleSuggestions = () => {
    setShowSuggestions(!showSuggestions);
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
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
    // Check if we need to update daily content
    const today = new Date().toLocaleDateString();
    if (history[0].date !== today) {
      const newQuote = getDailyQuote();
      const newAffirmation = getRandomAffirmation();
      const newFunFact = getRandomFunFact();
      
      setDailyQuote(newQuote);
      setCurrentAffirmation(newAffirmation);
      setCurrentFunFact(newFunFact);
      
      // Add to history (keeping only last 7 days)
      setHistory(prev => [
        {
          date: today,
          quote: newQuote.quote,
          author: newQuote.author,
          affirmation: newAffirmation,
          funFact: newFunFact
        },
        ...prev.slice(0, 6) // Keep only 7 days total
      ]);
    }

    // Rotate affirmations and fun facts every minute
    const interval = setInterval(() => {
      setCurrentAffirmation(getRandomAffirmation());
      setCurrentFunFact(getRandomFunFact());
    }, 60000);
    return () => clearInterval(interval);
  }, [history]);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Flame className="text-orange-500" />
            Habit Streak Tracker
          </h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setShowMusicPlayer(!showMusicPlayer)}
              className="ml-4"
            >
              <Music className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={toggleHistory}
            >
              <History className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* History Panel */}
        {showHistory && (
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-blue-500" />
              <h2 className="font-bold text-lg">Past 7 Days</h2>
            </div>
            <div className="space-y-4">
              {history.map((day, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-700">{day.date}</h3>
                    {index === 0 && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Today
                      </span>
                    )}
                  </div>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 mt-0.5 text-yellow-500 flex-shrink-0" />
                      <p className="text-sm">"{day.quote}" — {day.author}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Star className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                      <p className="text-sm">{day.affirmation}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 mt-0.5 text-purple-500 flex-shrink-0" />
                      <p className="text-sm">{day.funFact}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Daily Inspiration Section */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-medium">Today's Inspiration • {dailyQuote.date}</h3>
          </div>
          <div className="space-y-4">
            <blockquote className="pl-6 border-l-4 border-blue-200 italic text-gray-700">
              "{dailyQuote.quote}"
              <footer className="text-right text-sm text-gray-500 mt-1">— {dailyQuote.author}</footer>
            </blockquote>
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded">
              <Star className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
              <p className="text-sm">{currentAffirmation}</p>
            </div>
            <div className="flex items-start gap-2 p-3 bg-purple-50 rounded">
              <Info className="w-4 h-4 mt-0.5 text-purple-500 flex-shrink-0" />
              <p className="text-sm">{currentFunFact}</p>
            </div>
          </div>
        </div>

        {/* Music Player */}
        {showMusicPlayer && (
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium flex items-center gap-2">
                <Music className="w-4 h-4" />
                Calming Instrumental Music
              </h3>
              <Button 
                variant={isMusicPlaying ? "default" : "outline"} 
                size="sm"
                onClick={toggleMusic}
                className="gap-2"
              >
                {isMusicPlaying ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    Play
                  </>
                )}
              </Button>
            </div>
            <div className="aspect-video w-full">
              {isMusicPlaying ? (
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/1ZYbU82GVz4?autoplay=1&controls=0" 
                  title="Calming Instrumental Music" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="rounded-md"
                ></iframe>
              ) : (
                <div className="bg-gray-100 rounded-md w-full h-full flex items-center justify-center text-gray-500">
                  Music paused
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Royalty-free instrumental music from YouTube Audio Library
            </p>
          </div>
        )}

        {/* Habit Suggestions */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Habit Suggestions
            </h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleSuggestions}
              className="gap-2"
            >
              {showSuggestions ? "Hide" : "Show"} Suggestions
            </Button>
          </div>
          
          {showSuggestions && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
              {habitSuggestions.map((suggestion, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer transition-colors"
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
        <div className="bg-white rounded-lg shadow p-4">
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
              <div key={habit.id} className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50 transition-colors">
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
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
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