import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, useScroll } from 'framer-motion';
import { Footer } from '../components';
import { fetchTournaments, fetchPlayers } from '../store/esportsSlice';
import DashboardHero from '../components/esports/DashboardHero';
import LiveTournaments from '../components/esports/LiveTournaments';
import GlobalLeaderboard from '../components/esports/GlobalLeaderboard';
import PlayerProfile from '../components/esports/PlayerProfile';
import TeamSpotlight from '../components/esports/TeamSpotlight';

const EsportsPage = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((s) => s.esports);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    dispatch(fetchTournaments());
    dispatch(fetchPlayers());
  }, [dispatch]);

  return (
    <div className="bg-[#0B0F14] min-h-screen text-white relative">
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#00FF88] via-[#00E0FF] to-[#BD00FF] origin-left z-[200]"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Sections */}
      <DashboardHero />
      <LiveTournaments />
      <GlobalLeaderboard />
      <TeamSpotlight />
      <Footer />

      {/* Player profile slide-over */}
      <PlayerProfile />
    </div>
  );
};

export default EsportsPage;
