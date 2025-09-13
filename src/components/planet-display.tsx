'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Volume2, PlayCircle, Loader2 } from 'lucide-react';
import { getNarrationAudio } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { planetImages } from '@/lib/planet-images';

interface PlanetDisplayProps {
  planetName: string;
  funFacts: string[];
  onStartQuiz: () => void;
}

export function PlanetDisplay({ planetName, funFacts, onStartQuiz }: PlanetDisplayProps) {
  const [isNarrating, setIsNarrating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const planetKey = planetName.toLowerCase();
  const planetImage = planetImages[planetKey] || planetImages.default;

  const handleNarrate = async () => {
    if (audioRef.current) {
        if (isNarrating) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsNarrating(false);
            return;
        }
    }
  
    if (isGenerating) return;
    
    setIsGenerating(true);
    const allFacts = funFacts.join('. ');
    const result = await getNarrationAudio(allFacts);
    setIsGenerating(false);

    if ('error' in result) {
      toast({ title: 'Error', description: result.error, variant: 'destructive' });
      return;
    }

    if (audioRef.current) {
        audioRef.current.src = result.audioDataUri;
        audioRef.current.play().catch(e => {
            console.error("Audio play failed:", e);
            toast({ title: 'Error', description: 'Could not play audio.', variant: 'destructive' });
            setIsNarrating(false);
        });
    }
  };

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleAudioPlay = () => setIsNarrating(true);
    const handleAudioEnd = () => setIsNarrating(false);
    const handleAudioPause = () => setIsNarrating(false);

    audio.addEventListener('play', handleAudioPlay);
    audio.addEventListener('ended', handleAudioEnd);
    audio.addEventListener('pause', handleAudioPause);

    return () => {
      if (audio) {
        audio.removeEventListener('play', handleAudioPlay);
        audio.removeEventListener('ended', handleAudioEnd);
        audio.removeEventListener('pause', handleAudioPause);
        audio.pause();
        audio.src = '';
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 w-full animate-in fade-in duration-500">
      <audio ref={audioRef} className="hidden" />
      <h2 className="text-4xl md:text-5xl font-headline font-bold text-center capitalize text-accent">{planetName}</h2>
      <div className={`relative transition-transform duration-300 ${isNarrating ? 'animate-bounce' : ''}`}>
        <Image
          src={planetImage.src}
          alt={`Image of ${planetName}`}
          width={250}
          height={250}
          className="rounded-full shadow-2xl shadow-primary/40"
          data-ai-hint={planetImage.hint}
          unoptimized // Required for external URLs like picsum
        />
      </div>
      
      <Card className="w-full bg-primary/10">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center gap-2">
            Fun Facts!
            <Button variant="ghost" size="icon" onClick={handleNarrate} disabled={isGenerating} className="text-accent hover:bg-accent/20">
              {isGenerating ? <Loader2 className="h-6 w-6 animate-spin" /> : <Volume2 className="h-6 w-6" />}
            </Button>
          </CardTitle>
          <CardDescription>Listen to {planetName} share some secrets!</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 list-disc list-inside text-lg">
            {funFacts.map((fact, index) => (
              <li key={index}>{fact}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <Button size="lg" onClick={onStartQuiz} className="mt-4 bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
        <PlayCircle className="mr-2 h-6 w-6" />
        Take the Quiz!
      </Button>
    </div>
  );
}
