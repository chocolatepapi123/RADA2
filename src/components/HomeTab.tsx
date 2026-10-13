import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  Film, 
  Camera, 
  ArrowRight, 
  Clock, 
  MapPin, 
  Radio, 
  ExternalLink,
  X,
  Ticket
} from 'lucide-react';
import { EventItem, CinemaMovie, StatusPost } from '../types.ts';

interface HomeTabProps {
  events: EventItem[];
  cinemaMovies: CinemaMovie[];
  statuses: StatusPost[];
  onOpenEventDetails: (event: EventItem) => void;
  onBookCinema: (movie: CinemaMovie) => void;
  onPostStatus: (text: string, mediaUrl?: string) => void;
  isGpsBroadcasting: boolean;
  onOpenDedicatedViewAll: (title: string, category: string) => void;
  showToast: (msg: string) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  events,
  cinemaMovies,
  statuses,
  onOpenEventDetails,
  onBookCinema,
  onPostStatus,
  isGpsBroadcasting,
  onOpenDedicatedViewAll,
  showToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVibe, setSelectedVibe] = useState('all');
  const [selectedCinemaLoc, setSelectedCinemaLoc] = useState('all');
  const [selectedCinemaDate, setSelectedCinemaDate] = useState('all');

  // Status creation state
  const [statusText, setStatusText] = useState('');
  const [statusMediaUrl, setStatusMediaUrl] = useState<string | null>(null);

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setStatusMediaUrl(event.target.result as string);
          showToast('Photo attached to status!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublishStatus = () => {
    if (!statusText.trim() && !statusMediaUrl) {
      showToast('Type a status or attach a photo.');
      return;
    }
    onPostStatus(statusText, statusMediaUrl || undefined);
    setStatusText('');
    setStatusMediaUrl(null);
  };

  // Filter events
  const filteredEvents = events.filter(e => {
    const matchesVibe = selectedVibe === 'all' || e.category === selectedVibe;
    const matchesQuery = !searchQuery.trim() || 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesVibe && matchesQuery;
  });

  // Filter cinema movies
  const filteredCinemaMovies = cinemaMovies.filter(m => {
    const matchesLoc = selectedCinemaLoc === 'all' || m.location === selectedCinemaLoc;
    const matchesDate = selectedCinemaDate === 'all' || m.date === selectedCinemaDate;
    return matchesLoc && matchesDate;
  });

  return (
    <section className="px-4 py-4 space-y-6">
      {/* Search & Vibe Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, venues, vibes in Nairobi..."
            className="w-full pl-10 pr-4 py-3 bg-[#F1F1EE] dark:bg-[#1C1A1E] border border-slate-200 dark:border-slate-800 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-[#E0533C] shadow-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {[
            { id: 'all', label: 'All Vibes' },
            { id: 'concerts', label: 'Concerts & Live' },
            { id: 'nightlife', label: 'Nightlife & Clubs' },
            { id: 'cinemas', label: 'Cinemas' },
            { id: 'art', label: 'Art & Culture' }
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setSelectedVibe(pill.id)}
              className={`px-4 py-2 rounded-full text-xs shrink-0 transition-all ${
                selectedVibe === pill.id
                  ? 'bg-[#E0533C] text-white font-black shadow-sm'
                  : 'bg-[#F1F1EE] dark:bg-[#1C1A1E] text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Trending Events Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black tracking-wider uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#E0533C] animate-pulse"></span>
            <span>Featured Trending Events</span>
          </h2>
          <button
            onClick={() => onOpenDedicatedViewAll('Featured Trending Events', 'concerts')}
            className="text-[11px] font-bold text-[#E0533C] hover:underline"
          >
            View All ({filteredEvents.length})
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              onClick={() => onOpenEventDetails(evt)}
              className="w-64 bg-[#F1F1EE] dark:bg-[#1C1A1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shrink-0 shadow-sm flex flex-col justify-between cursor-pointer hover:border-[#E0533C] transition group"
            >
              <div>
                <div
                  className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl mb-3 relative overflow-hidden bg-cover bg-center"
                  style={{ backgroundImage: `url('${evt.img}')` }}
                >
                  <span className="absolute top-2.5 right-2.5 bg-black/75 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-lg">
                    {evt.tiers?.[0]?.price || 'KES 1,500'}
                  </span>
                  <span className="absolute bottom-2.5 left-2.5 bg-[#E0533C]/90 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md">
                    {evt.goingCount} going
                  </span>
                </div>
                <h3 className="font-extrabold text-sm line-clamp-1 text-slate-900 dark:text-slate-100 group-hover:text-[#E0533C] transition">
                  {evt.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1 truncate">
                  <Calendar className="w-3 h-3 text-[#E0533C] shrink-0" />
                  <span>{evt.date} • {evt.location.split(',')[0]}</span>
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenEventDetails(evt);
                }}
                className="mt-3 w-full py-2.5 bg-[#E0533C] hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>View Details & Tickets</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {filteredEvents.length === 0 && (
            <div className="w-full py-8 text-center text-xs text-slate-400 bg-[#F1F1EE] dark:bg-[#1C1A1E] rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
              No events found for this filter. Use the Business Hub to publish new events!
            </div>
          )}
        </div>
      </div>

      {/* CENTURY CINEMAX SHOWINGS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-[#2D6A4F]" />
            <h2 className="text-xs font-black tracking-wider uppercase text-slate-500 dark:text-slate-400">
              Century Cinemax Showings
            </h2>
          </div>
          <button
            onClick={() => onOpenDedicatedViewAll('Century Cinemax Movies', 'cinemas')}
            className="text-[11px] font-bold text-[#E0533C] hover:underline"
          >
            All Movies
          </button>
        </div>

        {/* Mall Location Pills */}
        <div className="space-y-2">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {[
              { id: 'all', label: 'All Malls' },
              { id: 'gardencity', label: 'Garden City IMAX' },
              { id: 'sarit', label: 'Sarit Centre' },
              { id: 'junction', label: 'Junction Mall' },
              { id: 'tworivers', label: 'Two Rivers Mall' }
            ].map((loc) => (
              <button
                key={loc.id}
                onClick={() => setSelectedCinemaLoc(loc.id)}
                className={`px-3 py-1.5 rounded-full text-xs shrink-0 transition ${
                  selectedCinemaLoc === loc.id
                    ? 'bg-[#2D6A4F] text-white font-black shadow-xs'
                    : 'bg-[#F1F1EE] dark:bg-[#1C1A1E] text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-800'
                }`}
              >
                {loc.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between bg-[#F1F1EE] dark:bg-[#1C1A1E] p-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-slate-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#E0533C]" />
              <span>Showtimes By Date:</span>
            </span>
            <select
              value={selectedCinemaDate}
              onChange={(e) => setSelectedCinemaDate(e.target.value)}
              className="bg-white dark:bg-[#121113] font-bold px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] focus:outline-none"
            >
              <option value="all">All Dates</option>
              <option value="2026-10-13">Tue, 13 Oct 2026</option>
              <option value="2026-10-14">Wed, 14 Oct 2026</option>
              <option value="2026-10-15">Thu, 15 Oct 2026</option>
            </select>
          </div>
        </div>

        {/* Movies Carousel */}
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
          {filteredCinemaMovies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => onBookCinema(movie)}
              className="cinema-card flex flex-col justify-between w-52 bg-[#F1F1EE] dark:bg-[#1C1A1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-2.5 shrink-0 shadow-sm cursor-pointer hover:border-[#2D6A4F] transition group"
            >
              <div>
                <div
                  className="h-56 bg-slate-200 dark:bg-slate-800 rounded-xl mb-2.5 bg-cover bg-center relative"
                  style={{ backgroundImage: `url('${movie.img}')` }}
                >
                  <span className="absolute top-2 right-2 bg-[#2D6A4F] text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-xs">
                    {movie.format}
                  </span>
                </div>
                <h3 className="font-extrabold text-xs line-clamp-1 text-slate-900 dark:text-slate-100 group-hover:text-[#2D6A4F] transition">
                  {movie.title}
                </h3>
                <p className="text-[11px] font-semibold text-[#E0533C] mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{movie.locationName}</span>
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{movie.times}</span>
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBookCinema(movie);
                }}
                className="mt-3 w-full py-2 bg-[#2D6A4F] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>Book & Sync Vault</span>
                <Ticket className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Live Community Status Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black tracking-wider uppercase text-slate-500 dark:text-slate-400">
            Where Are You At Today/Night?
          </h2>
          {isGpsBroadcasting && (
            <span className="text-[10px] bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 animate-pulse">
              <Radio className="w-3 h-3" /> GPS Broadcasting Active
            </span>
          )}
        </div>

        {/* Post Creation Box */}
        <div className="bg-[#F1F1EE] dark:bg-[#1C1A1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-sm space-y-3">
          <textarea
            rows={2}
            value={statusText}
            onChange={(e) => setStatusText(e.target.value)}
            placeholder="Post your current location, party status, or where you're headed in Nairobi..."
            className="w-full p-3 bg-white dark:bg-[#121113] border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#E0533C] resize-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          />

          {statusMediaUrl && (
            <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-48">
              <img src={statusMediaUrl} alt="Upload preview" className="w-full h-36 object-cover" />
              <button
                type="button"
                onClick={() => setStatusMediaUrl(null)}
                className="absolute top-2 right-2 w-7 h-7 bg-black/75 text-white rounded-full flex items-center justify-center hover:bg-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <label className="cursor-pointer w-10 h-10 rounded-full bg-white dark:bg-[#121113] border border-slate-200 dark:border-slate-800 text-[#E0533C] hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-sm shadow-xs transition">
              <Camera className="w-4 h-4" />
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={handleMediaUpload}
              />
            </label>

            <button
              onClick={handlePublishStatus}
              className="px-4 py-2 bg-[#E0533C] hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              Post Status
            </button>
          </div>
        </div>

        {/* Live Statuses Stream */}
        <div className="space-y-3 pt-1">
          {statuses.map((post) => (
            <div
              key={post.id}
              className="bg-[#F1F1EE] dark:bg-[#1C1A1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-sm flex items-start gap-3"
            >
              <div
                className="w-10 h-10 rounded-full bg-cover bg-center shrink-0 border border-slate-300 dark:border-slate-700"
                style={{ backgroundImage: `url('${post.avatar}')` }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100">
                    {post.handle}
                  </h4>
                  <span className="text-[10px] text-slate-400">{post.timeAgo}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  {post.text}
                </p>

                {post.hasGps && post.gpsCoords && (
                  <span className="text-[10px] bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-extrabold px-2 py-0.5 rounded-md inline-flex items-center gap-1 mt-1.5">
                    <Radio className="w-3 h-3" /> Live GPS: {post.gpsCoords}
                  </span>
                )}

                {post.mediaUrl && (
                  <div
                    className="mt-2 h-40 rounded-xl bg-cover bg-center border border-slate-200 dark:border-slate-800"
                    style={{ backgroundImage: `url('${post.mediaUrl}')` }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
