"use client"
import React from 'react'
import Landing3 from '@/components/landing-pages/landing-3';
import Landing1 from '@/components/landing-pages/landing-1';
import Landing2 from '@/components/landing-pages/landing-2';
import useLanding from '@/components/landing-pages/useLanding';

const MainLanding = ({ landingData, activeLandingPage }: any) => {

  const anotherLandingData = useLanding({ ...landingData, activeLandingPage })

  switch (activeLandingPage.name) {
    case 'landing1':
      return <Landing1 landingData={{ ...landingData, ...anotherLandingData }} />;
    case 'landing2':
      return <Landing2 landingData={{ ...landingData, ...anotherLandingData }} />;
    case 'landing3':
      return (
        <Landing3
          landingData={{ ...landingData, ...anotherLandingData }}
        />
      );
    default: return null
  }
}

export default MainLanding
