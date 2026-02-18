import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Footer } from '../components';
import { esportsAPI } from '../services/api';
import { Trophy, Users, Zap } from 'lucide-react';

const EsportsPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await esportsAPI.getAll();
        setTournaments(response.data);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const playersData = [
    { rank: 1, name: 'Pro_Player_01', wins: 156, team: 'Alpha Squad' },
    { rank: 2, name: 'NoobMaster_99', wins: 143, team: 'Beta Force' },
    { rank: 3, name: 'ShadowAssassin', wins: 128, team: 'Gamma Team' },
    { rank: 4, name: 'PhantomGhost', wins: 115, team: 'Delta Elite' },
    { rank: 5, name: 'NeonViper', wins: 102, team: 'Epsilon Squad' },
  ];

  return (
    <div className="bg-nexus-darker min-h-screen text-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-nexus-accent to-nexus-cyan bg-clip-text text-transparent">
            Esports Hub
          </h1>
          <p className="text-white/60 text-lg">
            Follow the best gaming tournaments and competitive players
          </p>
        </motion.div>

        {/* Tournaments */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-nexus-accent to-nexus-cyan bg-clip-text text-transparent">
            Active Tournaments
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-nexus-gray/30 rounded-2xl animate-pulse h-80" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {tournaments.map((tournament, i) => (
                <motion.div
                  key={tournament.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gradient-to-br from-nexus-gray/50 to-nexus-dark/50 rounded-2xl border border-nexus-accent/20 overflow-hidden hover:border-nexus-accent/40 transition"
                >
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden h-48">
                    <img
                      src={tournament.image}
                      alt={tournament.tournament}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-nexus-dark/80 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{tournament.title}</h3>
                    <p className="text-nexus-accent font-bold mb-4">{tournament.game}</p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3">
                        <Trophy size={18} className="text-nexus-accent" />
                        <span className="text-white/70">Prize Pool: {tournament.prizePool}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users size={18} className="text-nexus-accent" />
                        <span className="text-white/70">{tournament.teams} Teams</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Zap size={18} className="text-nexus-accent" />
                        <span className="text-white/70">{tournament.date}</span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="w-full px-4 py-2 bg-gradient-to-r from-nexus-accent to-nexus-cyan text-nexus-dark font-bold rounded-lg hover:shadow-lg transition"
                    >
                      Watch Live
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Leaderboard */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-nexus-accent to-nexus-cyan bg-clip-text text-transparent">
            Top Players
          </h2>

          <div className="bg-gradient-to-b from-nexus-gray/50 to-nexus-dark/50 rounded-2xl border border-nexus-accent/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-nexus-accent/20">
                    <th className="px-6 py-4 text-left text-white/60">Rank</th>
                    <th className="px-6 py-4 text-left text-white/60">Player Name</th>
                    <th className="px-6 py-4 text-left text-white/60">Team</th>
                    <th className="px-6 py-4 text-right text-white/60">Wins</th>
                  </tr>
                </thead>
                <tbody>
                  {playersData.map((player, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-nexus-accent/10 hover:bg-nexus-dark/50 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {i === 0 && <Trophy size={18} className="text-yellow-500" />}
                          {i === 1 && <Trophy size={18} className="text-gray-400" />}
                          {i === 2 && <Trophy size={18} className="text-orange-600" />}
                          <span className="font-bold">{player.rank}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-nexus-accent">{player.name}</td>
                      <td className="px-6 py-4 text-white/70">{player.team}</td>
                      <td className="px-6 py-4 text-right font-bold text-nexus-cyan">
                        {player.wins}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>
      </div>

      <Footer />
    </div>
  );
};

export default EsportsPage;
