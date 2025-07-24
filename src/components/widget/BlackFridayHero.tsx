'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { HomepageEntity, TimerSection } from '@/core/entities/HomePage.entity';

interface Props {
  homepageSection: HomepageEntity | null;
}

const BlackFridayHero = ({ homepageSection }: Props) => {
  // Find the timer section from the homepage data
  const timerSection = homepageSection?.sections?.find(
    (section): section is TimerSection => section.type === 'timer'
  );


  const imageUrl = timerSection?.imageUrl || '/images/BlackFriday.jpg'; 
  const altText = timerSection?.alt || 'Black Friday Sale'; 
  const titleText = timerSection?.title || 'BLACK FRIDAY';
  const subtitleText = timerSection?.subTitle || 'get 20% off if you spend 120$ or more!';


  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false, 
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const countdownTo = timerSection?.countdownTo;
      if (!countdownTo) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }
      const targetDate = new Date(countdownTo).getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };
    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [timerSection]);


  if (!timerSection || timeLeft.isExpired) {
  
    return null; // Or a message like "Sale Ended!"
  }

  return (
    <div className='relative  h-[400px] mx-auto mt-10 mb-10'>
      
      <Image
        src={imageUrl}
        alt={altText} 
        fill
        className='object-cover'
        priority 
      />
      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-opacity-30">
        <h1 className="text-3xl md:text-5xl font-extralight mb-2 tracking-wide">{titleText}</h1>
        <p className="text-sm md:text-base mb-4">{subtitleText}</p>
        <div className="flex text-center text-xs md:text-sm divide-x divide-white">
          <div className='px-4'>
            <p className="text-2xl md:text-3xl ">{timeLeft.days}</p>
            <span>DAYS</span>
          </div>
          <div className='px-4'>
            <p className="text-2xl md:text-3xl ">{timeLeft.hours}</p>
            <span>HOURS</span>
          </div>
          <div className='px-4'>
            <p className="text-2xl md:text-3xl">{timeLeft.minutes}</p>
            <span>MINUTES</span>
          </div>
          <div className='px-4'>
            <p className="text-2xl md:text-3xl">{timeLeft.seconds}</p>
            <span>SECONDS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlackFridayHero;