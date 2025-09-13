import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, MapPin, Calendar, Users, BarChart3, Zap, Building, 
  Clock, Star, QrCode, Plus, Edit, CheckCircle, 
  TrendingUp, Eye, UserPlus, Activity, Filter, ChevronRight,
  Home, Map, User, Bell, Menu, X, Navigation, Layers
} from 'lucide-react';

const SpaceFlowMobile = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const [userType, setUserType] = useState('consumer');
  const [viewMode, setViewMode] = useState('list');
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState(['nearby']);
  const [isSearching, setIsSearching] = useState(false);
  const [userLocation, setUserLocation] = useState({ lat: 40.7589, lng: -73.9851 });
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [userPreferences, setUserPreferences] = useState({ favoriteTypes: [], visitedSpaces: [] });
  const [userBadges, setUserBadges] = useState(['Explorer', 'First Timer']);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLandlordMode, setIsLandlordMode] = useState(false);
  const [landlordDashboardTab, setLandlordDashboardTab] = useState('overview');
  const [showAddSpaceModal, setShowAddSpaceModal] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const mapRef = useRef(null);

  // Booking system state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [participantCount, setParticipantCount] = useState(1);
  const [myBookings, setMyBookings] = useState([]);

  const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "AIzaSyCPLrPMHFWtBwPlCAfnUVjwVtCyPRNXphE";

  // Check if user is new (for onboarding)
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('bazaar_onboarding_seen');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  // Sample notifications
  useEffect(() => {
    setNotifications([
      {
        id: 1,
        title: '🎨 New art space opened nearby!',
        message: 'Chelsea Creative Hub is now available',
        time: '2 hours ago',
        type: 'new_space'
      },
      {
        id: 2,
        title: '⏰ Event reminder',
        message: 'UI/UX Workshop starts in 1 hour',
        time: '1 hour ago',
        type: 'reminder'
      }
    ]);
  }, []);

  // Transit information for each space
  const transitInfo = {
    1: {
      duration: "8 min",
      route: "Walk to 42nd St • Take 4/5/6 to 59th St",
      cost: "$2.90"
    },
    2: {
      duration: "12 min", 
      route: "Walk to Union Sq • Take R/W to Wall St",
      cost: "$2.90"
    },
    3: {
      duration: "6 min",
      route: "Walk to Spring St • Take 6 to Canal St",
      cost: "$2.90"
    },
    4: {
      duration: "10 min",
      route: "Walk to 14th St • Take L to 8th Ave",
      cost: "$2.90"
    }
  };

  // Mock Manhattan spaces with coordinates
  // Mock landlord data
  const landlordStats = {
    totalSpaces: 4,
    occupancyRate: 78,
    monthlyBookings: 34,
    revenue: 2840,
    footTraffic: 245,
    averageRating: 4.7
  };

  const upcomingBookings = [
    {
      id: 1,
      spaceName: "Midtown Creative Studio",
      eventTitle: "Photography Workshop",
      date: "Today",
      time: "2:00 PM - 4:00 PM",
      attendees: 12,
      organizer: "Sarah Chen"
    },
    {
      id: 2,
      spaceName: "Financial District Hub",
      eventTitle: "Tech Networking",
      date: "Tomorrow",
      time: "6:00 PM - 8:00 PM",
      attendees: 35,
      organizer: "Alex Rivera"
    },
    {
      id: 3,
      spaceName: "Chelsea Art Space",
      eventTitle: "Art Exhibition Opening",
      date: "Friday",
      time: "7:00 PM - 10:00 PM",
      attendees: 45,
      organizer: "Maya Gallery"
    }
  ];

  const spaceReviews = [
    {
      id: 1,
      spaceId: 1,
      userName: "Emma Johnson",
      rating: 5,
      comment: "Perfect space for our workshop! Great lighting and equipment.",
      date: "2 days ago"
    },
    {
      id: 2,
      spaceId: 2,
      userName: "David Kim",
      rating: 4,
      comment: "Good location and setup. Could use better WiFi.",
      date: "1 week ago"
    }
  ];

  const [spaces, setSpaces] = useState([
    {
      id: 1,
      name: "Midtown Creative Studio",
      address: "432 Park Ave, Floor 15",
      coordinates: { lat: 40.7589, lng: -73.9851 },
      type: "Workshop Space",
      capacity: 25,
      amenities: ["WiFi", "Projector", "Whiteboard", "Coffee"],
      available: true,
      distance: 0.3,
      currentEvent: null,
      upcomingEvents: [
        { id: 101, title: "Photography Workshop", time: "2:00 PM - 4:00 PM", organizer: "Sarah Chen", attendees: 12 }
      ],
      rating: 4.8,
      photos: ["photo1", "photo2"],
      image: "/midtown.jpg",
      checkins: 234
    },
    {
      id: 2,
      name: "Financial District Hub",
      address: "120 Wall St, Floor 8",
      coordinates: { lat: 40.7074, lng: -74.0113 },
      type: "Event Space",
      capacity: 50,
      amenities: ["Sound System", "Kitchen", "AV Setup", "WiFi"],
      available: true,
      distance: 1.2,
      currentEvent: null,
      upcomingEvents: [
        { id: 102, title: "Tech Networking", time: "6:00 PM - 8:00 PM", organizer: "Alex Rivera", attendees: 35 }
      ],
      rating: 4.6,
      photos: ["photo3"],
      image: "/fidi.jpg",
      checkins: 189
    },
    {
      id: 3,
      name: "SoHo Collaboration Lab",
      address: "85 Spring St, Floor 12",
      coordinates: { lat: 40.7233, lng: -74.0030 },
      type: "Co-working",
      capacity: 30,
      amenities: ["3D Printer", "Meeting Rooms", "WiFi", "Coffee"],
      available: false,
      distance: 0.8,
      currentEvent: { title: "Design Sprint", attendees: 18, endTime: "5:00 PM" },
      upcomingEvents: [],
      rating: 4.9,
      photos: ["photo4", "photo5"],
      image: "/soho.jpg",
      checkins: 156
    },
    {
      id: 4,
      name: "Chelsea Art Space",
      address: "200 11th Ave, Floor 3",
      coordinates: { lat: 40.7505, lng: -74.0045 },
      type: "Gallery",
      capacity: 75,
      amenities: ["Gallery Walls", "Lighting", "Security", "WiFi"],
      available: true,
      distance: 0.6,
      currentEvent: null,
      upcomingEvents: [
        { id: 104, title: "Art Exhibition Opening", time: "7:00 PM - 10:00 PM", organizer: "Maya Gallery", attendees: 45 }
      ],
      rating: 4.7,
      photos: ["photo6"],
      image: "/chelsea.jpg",
      checkins: 298
    }
  ]);

  // Personalized recommendations
  const getRecommendedSpaces = () => {
    return spaces.filter(space => {
      // Recommend based on past visits and preferences
      if (userPreferences.favoriteTypes.includes(space.type)) return true;
      if (space.rating >= 4.7) return true; // High-rated spaces
      if (space.distance <= 0.5) return true; // Nearby spaces
      return false;
    }).slice(0, 2);
  };

  const recommendedSpaces = getRecommendedSpaces();

  // Filter and search functionality
  const filteredSpaces = spaces.filter(space => {
    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesName = space.name.toLowerCase().includes(query);
      const matchesAddress = space.address.toLowerCase().includes(query);
      const matchesType = space.type.toLowerCase().includes(query);
      const matchesAmenities = space.amenities.some(amenity =>
        amenity.toLowerCase().includes(query)
      );
      if (!matchesName && !matchesAddress && !matchesType && !matchesAmenities) {
        return false;
      }
    }

    // Active filters
    if (activeFilters.includes('available') && !space.available) return false;
    if (activeFilters.includes('events') && space.upcomingEvents.length === 0) return false;
    if (activeFilters.includes('workshop') && !space.type.toLowerCase().includes('workshop')) return false;

    return true;
  }).sort((a, b) => {
    if (activeFilters.includes('nearby')) {
      return a.distance - b.distance;
    }
    return 0;
  });

  // Handle search with debouncing
  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsSearching(false);
    }
  }, [searchQuery]);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notifications-container')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  // Filter options
  const filterOptions = [
    { id: 'nearby', label: 'Nearby', icon: '📍' },
    { id: 'available', label: 'Available Now', icon: '✅' },
    { id: 'events', label: 'Has Events', icon: '🎉' },
    { id: 'workshop', label: 'Workshop', icon: '🛠️' }
  ];

  const toggleFilter = (filterId) => {
    setActiveFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  // Load Google Maps API
  useEffect(() => {
    console.log('API Key check:', GOOGLE_MAPS_API_KEY?.slice(0, 10) + '...');
    if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === "YOUR_API_KEY_HERE") {
      console.error('Google Maps API key is not configured. Please add your API key to .env file');
      setMapError(true);
      return;
    }

    if (typeof window.google === 'undefined') {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setMapLoaded(true);
        setMapError(false);
      };
      script.onerror = () => {
        console.error('Failed to load Google Maps API');
        setMapError(true);
        setMapLoaded(false);
      };
      document.head.appendChild(script);

      return () => {
        const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
        if (existingScript) {
          existingScript.remove();
        }
      };
    } else {
      setMapLoaded(true);
      setMapError(false);
    }
  }, [GOOGLE_MAPS_API_KEY]);

  // Clean up map and markers when component unmounts
  useEffect(() => {
    return () => {
      if (map) {
        markers.forEach(({ marker }) => {
          if (marker.setMap) {
            marker.setMap(null);
          }
        });
        setMarkers([]);
        setMap(null);
      }
    };
  }, []);

  // Initialize map when loaded and view mode is map
  useEffect(() => {
    console.log('Map init check:', { mapLoaded, mapError, viewMode, hasMapRef: !!mapRef.current, hasMap: !!map });
    if (mapLoaded && !mapError && viewMode === 'map' && mapRef.current && !map) {
      console.log('Initializing Google Map...');
      try {
        const newMap = new window.google.maps.Map(mapRef.current, {
        center: userLocation,
        zoom: 13,
        styles: [
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#e9e9e9" }, { lightness: 17 }]
          },
          {
            featureType: "landscape",
            elementType: "geometry",
            stylers: [{ color: "#f5f5f5" }, { lightness: 20 }]
          }
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      });

      setMap(newMap);

      // Add user location marker
      new window.google.maps.Marker({
        position: userLocation,
        map: newMap,
        title: "Your Location",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: '#3B82F6',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 3,
          scale: 8
        }
      });

      // Clear existing markers first
      if (markers.length > 0) {
        markers.forEach(({ marker }) => {
          if (marker.setMap) {
            marker.setMap(null);
          }
        });
      }

      // Add space markers
      const newMarkers = spaces.map(space => {
        const marker = new window.google.maps.Marker({
          position: space.coordinates,
          map: newMap,
          title: space.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: space.available ? '#10B981' : '#EF4444',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 3,
            scale: 12
          }
        });

        // Add click listener for marker
        marker.addListener('click', () => {
          setSelectedSpace(space);
        });

        return { marker, spaceId: space.id };
      });

      setMarkers(newMarkers);
      console.log('Map initialized successfully with', newMarkers.length, 'markers');
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError(true);
      }
    }
  }, [mapLoaded, mapError, viewMode, map, userLocation, spaces]);

  // Update marker styles when selected space changes
  useEffect(() => {
    if (markers.length > 0 && window.google) {
      markers.forEach(({ marker, spaceId }) => {
        const space = spaces.find(s => s.id === spaceId);
        const isSelected = selectedSpace?.id === spaceId;

        if (marker && marker.setIcon && space) {
          marker.setIcon({
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: space.available ? '#10B981' : '#EF4444',
            fillOpacity: 1,
            strokeColor: isSelected ? '#3B82F6' : '#FFFFFF',
            strokeWeight: isSelected ? 5 : 3,
            scale: isSelected ? 16 : 12
          });
        }
      });
    }
  }, [selectedSpace, markers, spaces]);

  // Map Component with Google Maps
  const MapView = () => (
    <div className="relative h-full w-full">
      <div
        ref={mapRef}
        className="w-full h-full min-h-[400px]"
        style={{ minHeight: '400px' }}
      />
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <button 
          className="bg-white p-2 rounded-lg shadow-lg"
          onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const newLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                  };
                  setUserLocation(newLocation);
                  if (map) {
                    map.setCenter(newLocation);
                  }
                },
                (error) => {
                  console.error('Error getting location:', error);
                  alert('Unable to get your location. Please enable location services.');
                },
                {
                  enableHighAccuracy: true,
                  timeout: 10000,
                  maximumAge: 300000
                }
              );
            } else {
              alert('Geolocation is not supported by this browser.');
            }
          }}
        >
          <Navigation className="h-5 w-5 text-gray-600" />
        </button>
        <button 
          className="bg-white p-2 rounded-lg shadow-lg"
          onClick={() => {
            if (map) {
              const bounds = new window.google.maps.LatLngBounds();
              spaces.forEach(space => bounds.extend(space.coordinates));
              bounds.extend(userLocation);
              map.fitBounds(bounds);
            }
          }}
        >
          <Layers className="h-5 w-5 text-gray-600" />
        </button>
      </div>


      {/* Loading and Error overlays */}
      {mapError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center p-6">
            <div className="text-red-500 mb-3">
              <MapPin className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Map Unavailable</h3>
            <p className="text-sm text-gray-600 mb-4">
              Unable to load Google Maps. Please check your API key configuration.
            </p>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      )}
      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );

  // Discover Tab - Mobile Optimized
  const DiscoverTab = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-nyc-sky/20 to-nyc-warm">
      {/* NYC Skyline Header */}
      <div
        className="relative h-64 overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{backgroundImage: 'url(/skyline.jpg)'}}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Clickable areas for different spaces */}
        <div
          className="absolute top-0 left-1/4 w-1/6 h-full cursor-pointer hover:bg-white/10 transition-colors"
          onClick={() => setSelectedSpace(spaces[0])}
          title="Midtown Creative Studio"
        ></div>
        <div
          className="absolute top-0 left-2/5 w-1/6 h-full cursor-pointer hover:bg-white/10 transition-colors"
          onClick={() => setSelectedSpace(spaces[1])}
          title="Financial District Hub"
        ></div>
        <div
          className="absolute top-0 left-3/5 w-1/6 h-full cursor-pointer hover:bg-white/10 transition-colors"
          onClick={() => setSelectedSpace(spaces[2])}
          title="SoHo Collaboration Lab"
        ></div>
        <div
          className="absolute top-0 right-1/4 w-1/6 h-full cursor-pointer hover:bg-white/10 transition-colors"
          onClick={() => setSelectedSpace(spaces[3])}
          title="Chelsea Art Space"
        ></div>

        {/* App Title Overlay */}
        <div className="absolute top-6 left-6">
          <h1 className="text-2xl font-heading font-bold text-white mb-1 drop-shadow-lg">
            Discover NYC
          </h1>
          <p className="text-nyc-warm text-sm font-medium drop-shadow">Click buildings to explore spaces</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-6 py-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-urban-medium" />
          <input
            type="text"
            placeholder="Search spaces, amenities, or neighborhoods..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-nyc-concrete/30 focus:outline-none focus:ring-2 focus:ring-nyc-subway focus:border-transparent text-nyc-charcoal placeholder-urban-medium"
            autoComplete="off"
            spellCheck="false"
            onFocus={(e) => e.preventDefault()}
          />
          {isSearching && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-nyc-subway"></div>
            </div>
          )}
        </div>
      </div>

      {/* Featured Spaces Shelf */}
      <div className="flex-1 overflow-y-auto p-6">
        <h2 className="text-xl font-heading font-bold text-nyc-charcoal mb-4 flex items-center">
          ✨ Featured Spaces
          <span className="ml-2 text-sm font-normal text-urban-medium">Swipe to explore</span>
        </h2>

        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-4 pb-4">
            {spaces.map(space => (
              <div
                key={space.id}
                className="min-w-72 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => setSelectedSpace(space)}
              >
                {/* Space Image */}
                <div className="h-40 bg-cover bg-center rounded-t-2xl relative" style={{backgroundImage: `url(${space.image})`}}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-t-2xl"></div>
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                    space.available
                      ? 'bg-nyc-park/80 text-white'
                      : 'bg-nyc-brick/80 text-white'
                  }`}>
                    {space.available ? '🟢 Available' : '🔴 Busy'}
                  </div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <div className="flex items-center text-sm">
                      <Star className="h-3 w-3 text-nyc-subway mr-1" />
                      <span className="font-semibold">{space.rating}</span>
                      <span className="mx-1">•</span>
                      <span>{space.distance} mi away</span>
                    </div>
                  </div>
                </div>

                {/* Space Info */}
                <div className="p-4">
                  <h3 className="font-heading font-bold text-lg text-nyc-charcoal mb-1">{space.name}</h3>
                  <p className="text-sm text-urban-medium mb-2 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {space.address}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-nyc-subway/20 text-nyc-charcoal px-2 py-1 rounded-full font-medium">
                      {space.type}
                    </span>
                    <span className="text-xs text-urban-medium">
                      Up to {space.capacity} people
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Personalized Recommendations */}
        <div className="mt-6 bg-white rounded-2xl p-5 shadow-lg border border-nyc-concrete/20">
          <h3 className="text-lg font-heading font-bold text-nyc-charcoal mb-4 flex items-center">
            ✨ Recommended for You
            <span className="ml-2 text-xs bg-nyc-subway/20 text-nyc-charcoal px-2 py-1 rounded-full font-medium">
              Based on your activity
            </span>
          </h3>

          <div className="space-y-3">
            {/* High-rated spaces recommendation */}
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-nyc-park/10 to-nyc-sky/10 rounded-xl border border-nyc-park/20 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-nyc-park/40 hover:-translate-y-1 group">
              <div className="w-10 h-10 bg-gradient-to-r from-nyc-park to-nyc-sky rounded-xl flex items-center justify-center group-hover:animate-bounce">
                <span className="text-white text-sm">⭐</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-nyc-charcoal text-sm group-hover:text-nyc-park transition-colors">Find Your Perfect 5-Star Space</p>
                <p className="text-xs text-urban-medium">🔥 Sarah & 7 others visited today</p>
              </div>
              <div className="text-xs font-bold text-nyc-park bg-white/50 px-2 py-1 rounded-full group-hover:bg-nyc-park group-hover:text-white transition-all">3 nearby</div>
            </div>

            {/* Workshop spaces recommendation (based on user visiting Midtown Creative Studio) */}
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-nyc-subway/10 to-nyc-orange/10 rounded-xl border border-nyc-subway/20 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-nyc-subway/40 hover:-translate-y-1 group">
              <div className="w-10 h-10 bg-gradient-to-r from-nyc-subway to-nyc-orange rounded-xl flex items-center justify-center group-hover:animate-pulse">
                <span className="text-white text-sm">🎨</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-nyc-charcoal text-sm group-hover:text-nyc-subway transition-colors">Unleash Your Creative Side</p>
                <p className="text-xs text-urban-medium">⚡ 12 bookings in the last hour</p>
              </div>
              <div className="text-xs font-bold text-nyc-subway bg-white/50 px-2 py-1 rounded-full group-hover:bg-nyc-subway group-hover:text-white transition-all">2 available</div>
            </div>

            {/* Trending this week */}
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-nyc-brick/10 to-nyc-warm/10 rounded-xl border border-nyc-brick/20 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-nyc-brick/40 hover:-translate-y-1 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-nyc-brick/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-10 h-10 bg-gradient-to-r from-nyc-brick to-nyc-subway rounded-xl flex items-center justify-center group-hover:animate-wiggle">
                <span className="text-white text-sm">🔥</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-nyc-charcoal text-sm group-hover:text-nyc-brick transition-colors">Join the Hottest Spots</p>
                <p className="text-xs text-urban-medium">👥 156 explorers checked in today</p>
              </div>
              <div className="text-xs font-bold text-nyc-brick bg-white/50 px-2 py-1 rounded-full group-hover:bg-nyc-brick group-hover:text-white transition-all animate-pulse">5 trending</div>
            </div>
          </div>
        </div>

        {/* All Available Spaces */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-heading font-bold text-nyc-charcoal flex items-center">
              🏢 All Available Spaces
              <span className="ml-2 text-xs bg-nyc-concrete/30 text-nyc-charcoal px-2 py-1 rounded-full font-medium">
                {filteredSpaces.length} spaces
              </span>
            </h3>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-nyc-brick hover:text-nyc-charcoal font-semibold"
              >
                Clear search
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredSpaces.map(space => (
              <div
                key={space.id}
                className="bg-white rounded-xl p-4 shadow-md border border-nyc-concrete/20 cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                onClick={() => setSelectedSpace(space)}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-cover bg-center rounded-xl flex-shrink-0" style={{backgroundImage: `url(${space.image})`}}>
                    <div className="w-full h-full bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-nyc-charcoal">{space.name}</h4>
                      <div className="flex items-center text-xs">
                        <Star className="h-3 w-3 text-nyc-subway mr-1" />
                        <span className="font-semibold text-nyc-charcoal">{space.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-urban-medium mb-2">{space.address}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-xs bg-nyc-concrete/30 text-nyc-charcoal px-2 py-1 rounded-full font-medium">
                          {space.type}
                        </span>
                        <span className="text-xs text-urban-medium">
                          📍 {space.distance} mi away
                        </span>
                      </div>
                      <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        space.available
                          ? 'bg-nyc-park/20 text-nyc-park'
                          : 'bg-nyc-brick/20 text-nyc-brick'
                      }`}>
                        {space.available ? '🟢 Available' : '🔴 Busy'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredSpaces.length === 0 && searchQuery && (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🔍</div>
              <p className="text-urban-medium">No spaces match your search</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-sm text-nyc-subway font-semibold hover:text-nyc-charcoal"
              >
                Clear search to see all spaces
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

// Events Tab
  const EventsTab = () => (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">My Events</h2>
        <button className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg mb-1">UI/UX Workshop</h3>
              <p className="text-sm text-blue-600 font-medium mb-1">🏢 Midtown Creative Studio</p>
              <p className="text-sm text-gray-600 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Today • 2:00 PM - 5:00 PM
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-2 rounded-xl text-sm font-semibold border border-green-200">
              ✅ Confirmed
            </div>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600 font-medium">15/25 registered</span>
            </div>
            <button
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-md"
              onClick={() => setShowQRCode(true)}
            >
              📱 QR Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Profile Tab
  const ProfileTab = () => (
    <div className="p-6 space-y-8 overflow-y-auto h-full bg-gradient-to-b from-pastel-purple to-pastel-pink">
      <div className="text-center">
        <div className="w-28 h-28 bg-gradient-to-br from-soft-purple to-soft-pink rounded-full mx-auto mb-4 flex items-center justify-center shadow-2xl border-4 border-white animate-float">
          <User className="h-14 w-14 text-white" />
        </div>
        <h2 className="text-3xl font-heading font-bold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent mb-2">Alex Rivera</h2>
        <p className="text-purple-600 font-semibold mb-3">🎯 Space Explorer</p>

        {/* User Badges */}
        <div className="flex justify-center space-x-2 mb-4">
          {userBadges.map((badge, index) => (
            <div key={index} className="bg-gradient-to-r from-yellow-200 to-orange-200 text-orange-700 px-3 py-1 rounded-2xl text-xs font-semibold border border-orange-300 shadow-sm animate-wiggle">
              {badge === 'Explorer' && '🌍'} {badge === 'First Timer' && '🎆'} {badge}
            </div>
          ))}
        </div>

        {/* Achievement Level */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-lg border border-purple-100">
          <p className="text-sm font-medium text-purple-600 mb-2">Space Explorer Level</p>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-purple-100 rounded-full h-3">
              <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-3 rounded-full" style={{width: '60%'}}></div>
            </div>
            <span className="text-sm font-bold text-purple-600">Level 2</span>
          </div>
          <p className="text-xs text-purple-500 mt-2">🎆 Visit 3 more spaces to reach Level 3!</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-white rounded-3xl p-5 shadow-lg border border-purple-100 transform hover:scale-105 transition-all duration-300">
          <div className="text-4xl mb-2">🏢</div>
          <p className="text-2xl font-heading font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-1">8</p>
          <p className="text-xs text-purple-600 font-semibold">Spaces Visited</p>
        </div>
        <div className="bg-white rounded-3xl p-5 shadow-lg border border-green-100 transform hover:scale-105 transition-all duration-300">
          <div className="text-4xl mb-2">🎉</div>
          <p className="text-2xl font-heading font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1">15</p>
          <p className="text-xs text-green-600 font-semibold">Events Joined</p>
        </div>
        <div className="bg-white rounded-3xl p-5 shadow-lg border border-yellow-100 transform hover:scale-105 transition-all duration-300">
          <div className="text-4xl mb-2">⭐</div>
          <p className="text-2xl font-heading font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent mb-1">4.8</p>
          <p className="text-xs text-yellow-600 font-semibold">Your Rating</p>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => setIsLandlordMode(true)}
          className="w-full text-left p-4 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-200 flex items-center space-x-3"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-nyc-park to-nyc-sky rounded-xl flex items-center justify-center">
            <span className="text-white text-sm">🏢</span>
          </div>
          <span className="font-semibold text-gray-800">For landlords</span>
        </button>
        <button className="w-full text-left p-4 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-200 flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-sm">⚙️</span>
          </div>
          <span className="font-semibold text-gray-800">Settings</span>
        </button>
        <button className="w-full text-left p-4 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-200 flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-sm">❓</span>
          </div>
          <span className="font-semibold text-gray-800">Help & Support</span>
        </button>
      </div>

      {/* My Bookings Section */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-heading font-bold text-gray-900 mb-4 flex items-center">
          🎫 My Bookings
          <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
            {myBookings.length} active
          </span>
        </h3>

        {myBookings.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📅</div>
            <p className="text-gray-500 mb-2">No bookings yet</p>
            <p className="text-sm text-gray-400">Book your first space to see your QR codes here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {myBookings.map(booking => (
              <div key={booking.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-cover bg-center rounded-xl flex-shrink-0" style={{backgroundImage: `url(${booking.spaceImage})`}}>
                    <div className="w-full h-full bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{booking.spaceName}</h4>
                    <p className="text-sm text-gray-600 mb-1">
                      📅 {new Date(booking.date).toLocaleDateString()} • ⏰ {booking.timeSlot}
                    </p>
                    <p className="text-sm text-gray-600">
                      👥 {booking.participants} {booking.participants === 1 ? 'person' : 'people'}
                    </p>
                  </div>
                  <div className="text-center">
                    <button
                      onClick={() => {
                        // Generate QR code display
                        setShowQRCode(true);
                      }}
                      className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white hover:shadow-lg transition-all transform hover:scale-105"
                    >
                      📱
                    </button>
                    <p className="text-xs text-gray-500 mt-1">QR Code</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Booking ID: {booking.id}</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {booking.status === 'confirmed' ? '✅ Confirmed' : '⏳ Pending'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Onboarding Tutorial Component
  const OnboardingTutorial = () => {
    const steps = [
      {
        title: "Welcome to Bazaar! 🎆",
        description: "Discover your city's living room - amazing spaces around you.",
        illustration: "🏢",
        tip: "Swipe or tap to continue"
      },
      {
        title: "Find Perfect Spaces 🔍",
        description: "Search by location, amenities, or space type. Use filters to narrow down your options.",
        illustration: "📍",
        tip: "Try searching for 'creative' or 'workshop'"
      },
      {
        title: "Book Instantly ✨",
        description: "Check availability in real-time and book your space with just a few taps.",
        illustration: "📱",
        tip: "Look for the green 'Available' badges"
      },
      {
        title: "Check-in with QR Code 📲",
        description: "Use our QR code system for seamless check-ins at your booked spaces.",
        illustration: "🔒",
        tip: "No more waiting at reception!"
      }
    ];

    const currentStep = steps[onboardingStep];

    return showOnboarding ? (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/80 to-pink-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transform animate-bounce-gentle">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-float">{currentStep.illustration}</div>
            <h2 className="text-2xl font-heading font-bold text-gray-800 mb-3">{currentStep.title}</h2>
            <p className="text-gray-600 font-body mb-4 leading-relaxed">{currentStep.description}</p>
            <p className="text-sm text-purple-500 font-medium mb-6 bg-purple-50 p-2 rounded-xl">
              💡 {currentStep.tip}
            </p>

            <div className="flex justify-center space-x-2 mb-6">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-8 rounded-full transition-all duration-300 ${
                    index === onboardingStep
                      ? 'bg-gradient-to-r from-purple-400 to-pink-400'
                      : index < onboardingStep
                      ? 'bg-green-300'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  localStorage.setItem('bazaar_onboarding_seen', 'true');
                  setShowOnboarding(false);
                }}
                className="flex-1 py-3 px-4 text-gray-500 font-medium rounded-2xl hover:bg-gray-50 transition-colors duration-200"
              >
                Skip
              </button>
              <button
                onClick={() => {
                  if (onboardingStep < steps.length - 1) {
                    setOnboardingStep(onboardingStep + 1);
                  } else {
                    localStorage.setItem('bazaar_onboarding_seen', 'true');
                    setShowOnboarding(false);
                  }
                }}
                className="flex-2 py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-heading font-semibold rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                {onboardingStep < steps.length - 1 ? 'Next' : 'Get Started! 🎉'}
              </button>
            </div>
          </div>
        </div>
      </div>
    ) : null;
  };


  // Landlord Dashboard Component
  const LandlordDashboard = () => {
    return (
      <div className="h-full bg-gradient-to-br from-pastel-blue via-white to-pastel-green flex flex-col">
        {/* Dashboard Navigation */}
        <div className="bg-white border-b border-purple-100 px-6 py-4 flex-shrink-0">
          <div className="flex space-x-6">
            {['overview', 'spaces', 'analytics', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setLandlordDashboardTab(tab)}
                className={`px-6 py-3 rounded-2xl font-heading font-semibold text-sm transition-all duration-300 ${
                  landlordDashboardTab === tab
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-purple-600 hover:bg-purple-50'
                }`}
              >
                {tab === 'overview' && '📊'} {tab === 'spaces' && '🏢'}
                {tab === 'analytics' && '📈'} {tab === 'reviews' && '⭐'}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {landlordDashboardTab === 'overview' && <OverviewTab />}
          {landlordDashboardTab === 'spaces' && <SpacesTab />}
          {landlordDashboardTab === 'analytics' && <AnalyticsTab />}
          {landlordDashboardTab === 'reviews' && <ReviewsTab />}
        </div>
      </div>
    );
  };

  // Overview Tab with KPIs
  const OverviewTab = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2">🎆 Welcome back, Alex!</h1>
            <p className="text-purple-100 font-body">Your spaces are performing great this month ✨</p>
          </div>
          <div className="text-6xl animate-float">🏢</div>
        </div>
      </div>

      {/* KPI Cards - Single Column Horizontal Layout */}
      <div className="space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <div className="text-xl">📈</div>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-gray-800 text-lg">Occupancy Rate</h3>
                <p className="text-gray-600 text-sm">Average across all spaces</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-heading font-bold text-green-600">{landlordStats.occupancyRate}%</p>
              <p className="text-xs text-green-500 font-medium">+12% vs last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <div className="text-xl">📅</div>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-gray-800 text-lg">Monthly Bookings</h3>
                <p className="text-gray-600 text-sm">Events and sessions booked</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-heading font-bold text-blue-600">{landlordStats.monthlyBookings}</p>
              <p className="text-xs text-blue-500 font-medium">+8 this week</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-lg border border-yellow-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-100 p-3 rounded-xl">
                <div className="text-xl">💰</div>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-gray-800 text-lg">Monthly Revenue</h3>
                <p className="text-gray-600 text-sm">From space bookings</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-heading font-bold text-yellow-600">${landlordStats.revenue}</p>
              <p className="text-xs text-yellow-500 font-medium">+$340 this week</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-xl">
                <div className="text-xl">👥</div>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-gray-800 text-lg">Foot Traffic</h3>
                <p className="text-gray-600 text-sm">Unique visitors this month</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-heading font-bold text-purple-600">{landlordStats.footTraffic}</p>
              <p className="text-xs text-purple-500 font-medium">+25 this week</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-lg border border-pink-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-pink-100 p-3 rounded-xl">
                <div className="text-xl">⭐</div>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-gray-800 text-lg">Average Rating</h3>
                <p className="text-gray-600 text-sm">Across all your spaces</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-heading font-bold text-pink-600">{landlordStats.averageRating}</p>
              <p className="text-xs text-pink-500 font-medium">+0.2 vs last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-orange-100 p-3 rounded-xl">
                <div className="text-xl">🏢</div>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-gray-800 text-lg">Your Spaces</h3>
                <p className="text-gray-600 text-sm">Currently listed</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-heading font-bold text-orange-600">{landlordStats.totalSpaces}</p>
              <p className="text-xs text-orange-500 font-medium">All active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Bookings */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-purple-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-bold text-gray-800 flex items-center">
            📅 Upcoming Bookings
          </h2>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-2xl text-sm font-semibold">
            {upcomingBookings.length} events
          </span>
        </div>
        <div className="space-y-4">
          {upcomingBookings.map(booking => (
            <div key={booking.id} className="bg-gradient-to-r from-purple-25 to-pink-25 rounded-2xl p-4 border border-purple-100">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-heading font-semibold text-gray-800 mb-1">{booking.eventTitle}</h3>
                  <p className="text-purple-600 font-medium text-sm mb-1">{booking.spaceName}</p>
                  <p className="text-gray-600 text-sm flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {booking.date} • {booking.time}
                  </p>
                </div>
                <div className="text-right">
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-xl text-sm font-semibold mb-2">
                    {booking.attendees} attendees
                  </div>
                  <p className="text-gray-500 text-xs">by {booking.organizer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Incentives Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🎆</div>
            <div>
              <h2 className="text-lg font-heading font-bold text-green-800">Community Impact</h2>
              <p className="text-green-600 font-body text-sm">You're making a difference!</p>
            </div>
          </div>
          <div className="flex space-x-6">
            <div className="text-center">
              <div className="text-xl mb-1">🌍</div>
              <p className="text-lg font-bold text-green-600">245</p>
              <p className="text-green-500 text-xs font-medium">Visitors</p>
            </div>
            <div className="text-center">
              <div className="text-xl mb-1">🚀</div>
              <p className="text-lg font-bold text-blue-600">89%</p>
              <p className="text-blue-500 text-xs font-medium">Happy users</p>
            </div>
            <div className="text-center">
              <div className="text-xl mb-1">🌟</div>
              <p className="text-lg font-bold text-purple-600">4.7</p>
              <p className="text-purple-500 text-xs font-medium">Rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Spaces Management Tab
  const SpacesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold text-gray-800">Your Spaces</h1>
        <button
          onClick={() => setShowAddSpaceModal(true)}
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl font-heading font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Space
        </button>
      </div>

      <div className="space-y-4">
        {spaces.map(space => (
          <div key={space.id} className="bg-white rounded-2xl p-4 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-4 flex-1">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <div className="text-lg">🏢</div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-heading font-bold text-gray-800">{space.name}</h3>
                  <p className="text-purple-600 text-sm flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {space.address}
                  </p>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="flex items-center text-gray-600 text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      {space.capacity} people
                    </span>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 mr-1" />
                      <span className="text-xs text-gray-600">{space.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`px-3 py-2 rounded-xl text-xs font-semibold ${
                space.available
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {space.available ? '✅ Active' : '🔴 Busy'}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex flex-wrap gap-1">
                  {space.amenities.slice(0, 3).map((amenity, idx) => (
                    <span key={idx} className="bg-purple-50 text-purple-700 px-2 py-1 rounded-lg text-xs font-medium">
                      {amenity}
                    </span>
                  ))}
                  {space.amenities.length > 3 && (
                    <span className="text-xs text-gray-500">+{space.amenities.length - 3}</span>
                  )}
                </div>
                {space.upcomingEvents.length > 0 && (
                  <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium">
                    Next: {space.upcomingEvents[0].title.slice(0, 15)}...
                  </div>
                )}
              </div>
              <div className="flex space-x-2">
                <button className="py-2 px-3 bg-purple-500 text-white rounded-xl text-xs font-semibold hover:bg-purple-600 transition-colors duration-200">
                  ✏️ Edit
                </button>
                <button className="py-2 px-3 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200 transition-colors duration-200">
                  📈 Stats
                </button>
                <button className={`py-2 px-3 rounded-xl text-xs font-semibold transition-colors duration-200 ${
                  space.available
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}>
                  {space.available ? '⏸️ Pause' : '▶️ Go'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Analytics Tab
  const AnalyticsTab = () => (
    <div className="space-y-8">
      <h1 className="text-3xl font-heading font-bold text-gray-800">Analytics & Insights</h1>

      {/* Performance Overview */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-purple-100">
          <h2 className="text-lg font-heading font-bold text-gray-800 mb-3 flex items-center">
            📈 Booking Trends
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">This Week</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 h-2 bg-purple-100 rounded-full">
                  <div className="w-24 h-2 bg-purple-500 rounded-full"></div>
                </div>
                <span className="text-purple-600 font-semibold text-sm">75%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last Week</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 h-2 bg-purple-100 rounded-full">
                  <div className="w-20 h-2 bg-purple-400 rounded-full"></div>
                </div>
                <span className="text-purple-500 font-semibold text-sm">63%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Month Avg</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 h-2 bg-purple-100 rounded-full">
                  <div className="w-28 h-2 bg-purple-600 rounded-full"></div>
                </div>
                <span className="text-purple-600 font-semibold text-sm">88%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-lg border border-blue-100">
          <h2 className="text-lg font-heading font-bold text-gray-800 mb-3 flex items-center">
            🕰️ Peak Hours
          </h2>
          <div className="space-y-3">
            {[
              { time: '2:00 PM - 4:00 PM', percentage: 85, label: 'Workshops' },
              { time: '6:00 PM - 8:00 PM', percentage: 92, label: 'Networking' },
              { time: '10:00 AM - 12:00 PM', percentage: 67, label: 'Meetings' },
              { time: '7:00 PM - 10:00 PM', percentage: 78, label: 'Events' }
            ].map((slot, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div>
                  <p className="text-gray-800 font-medium text-sm">{slot.time}</p>
                  <p className="text-gray-500 text-xs">{slot.label}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-blue-100 rounded-full">
                    <div className={`h-2 bg-blue-500 rounded-full`} style={{width: `${slot.percentage}%`}}></div>
                  </div>
                  <span className="text-blue-600 font-semibold text-sm">{slot.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Space Performance */}
      <div className="bg-white rounded-2xl p-4 shadow-lg border border-green-100">
        <h2 className="text-lg font-heading font-bold text-gray-800 mb-4 flex items-center">
          🎯 Space Performance
        </h2>
        <div className="space-y-3">
          {spaces.map(space => (
            <div key={space.id} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <div className="text-sm">🏢</div>
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-gray-800 text-sm">{space.name}</h3>
                    <p className="text-xs text-gray-600">Performance metrics</p>
                  </div>
                </div>
                <div className="flex space-x-4 text-right">
                  <div>
                    <span className="text-sm font-bold text-green-600">{Math.floor(Math.random() * 15) + 5}</span>
                    <p className="text-xs text-gray-500">Bookings</p>
                  </div>
                  <div>
                    <span className="text-sm font-bold text-yellow-600">{space.rating}</span>
                    <p className="text-xs text-gray-500">Rating</p>
                  </div>
                  <div>
                    <span className="text-sm font-bold text-blue-600">${Math.floor(Math.random() * 800) + 200}</span>
                    <p className="text-xs text-gray-500">Revenue</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-200">
        <h2 className="text-lg font-heading font-bold text-orange-800 mb-3 flex items-center">
          💡 AI Insights & Recommendations
        </h2>
        <div className="space-y-3">
          <div className="bg-white rounded-xl p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="text-green-600 text-sm">🚀</div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">Growth Opportunity</h3>
                  <p className="text-gray-600 text-xs">Creative Studio has 89% satisfaction rate</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-green-600 font-bold text-sm">+15%</span>
                <p className="text-xs text-gray-500">Potential growth</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="text-blue-600 text-sm">⏰</div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">Peak Time Optimization</h3>
                  <p className="text-gray-600 text-xs">6-8 PM slots have 92% occupancy</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-blue-600 font-bold text-sm">92%</span>
                <p className="text-xs text-gray-500">Peak usage</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Reviews Tab
  const ReviewsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold text-gray-800">Reviews & Feedback</h1>
        <div className="flex items-center space-x-4">
          <div className="bg-yellow-100 px-4 py-2 rounded-2xl">
            <span className="text-yellow-800 font-semibold flex items-center">
              ⭐ {landlordStats.averageRating} Average Rating
            </span>
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="space-y-4">
        {spaceReviews.concat([
          {
            id: 3,
            spaceId: 3,
            userName: "Sophie Martinez",
            rating: 5,
            comment: "Amazing art space! Perfect lighting for our exhibition. The team was super helpful with setup.",
            date: "3 days ago"
          },
          {
            id: 4,
            spaceId: 4,
            userName: "Michael Chen",
            rating: 4,
            comment: "Great venue for networking events. Could use more seating but overall excellent experience.",
            date: "1 week ago"
          },
          {
            id: 5,
            spaceId: 1,
            userName: "Lisa Thompson",
            rating: 5,
            comment: "Fantastic creative space! All the equipment we needed was available and in great condition.",
            date: "2 weeks ago"
          }
        ]).map(review => {
          const space = spaces.find(s => s.id === review.spaceId);
          return (
            <div key={review.id} className="bg-white rounded-3xl p-6 shadow-lg border border-purple-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mr-4">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-gray-800">{review.userName}</h3>
                    <p className="text-purple-600 text-sm">{space?.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center mb-1">
                    {Array.from({length: review.rating}).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                    {Array.from({length: 5 - review.rating}).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-gray-300" />
                    ))}
                  </div>
                  <p className="text-gray-500 text-xs">{review.date}</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <button className="text-purple-600 text-sm font-medium hover:text-purple-700 transition-colors duration-200">
                  💬 Reply
                </button>
                <div className="flex space-x-2">
                  <button className="text-gray-500 text-sm hover:text-gray-700 transition-colors duration-200">
                    👍 Helpful
                  </button>
                  <button className="text-gray-500 text-sm hover:text-gray-700 transition-colors duration-200">
                    📢 Share
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Add Space Modal
  const AddSpaceModal = () => (
    showAddSpaceModal && (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-heading font-bold text-gray-800">🏢 Add New Space</h2>
            <button
              onClick={() => setShowAddSpaceModal(false)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Space Name</label>
                <input
                  type="text"
                  placeholder="e.g., Creative Workshop Studio"
                  className="w-full px-4 py-3 border border-purple-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Space Type</label>
                <select className="w-full px-4 py-3 border border-purple-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-200">
                  <option>Workshop Space</option>
                  <option>Event Space</option>
                  <option>Co-working</option>
                  <option>Gallery</option>
                  <option>Meeting Room</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
              <input
                type="text"
                placeholder="Full address including floor/suite"
                className="w-full px-4 py-3 border border-purple-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-200"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Capacity</label>
                <input
                  type="number"
                  placeholder="Maximum occupancy"
                  className="w-full px-4 py-3 border border-purple-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hourly Rate ($)</label>
                <input
                  type="number"
                  placeholder="Price per hour"
                  className="w-full px-4 py-3 border border-purple-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Amenities</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['WiFi', 'Projector', 'Whiteboard', 'Coffee', 'Kitchen', 'Parking', 'Sound System', 'AV Setup', '3D Printer'].map(amenity => (
                  <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-purple-300 text-purple-600 focus:ring-purple-500" />
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                rows={4}
                placeholder="Describe your space, what makes it special, and any important details..."
                className="w-full px-4 py-3 border border-purple-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-200 resize-none"
              ></textarea>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setShowAddSpaceModal(false)}
                className="flex-1 py-3 px-6 border-2 border-gray-200 text-gray-700 rounded-2xl font-heading font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-2 py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-heading font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                ✨ Create Space
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );

  // Space Details Modal
  const SpaceDetailsModal = () => (
    selectedSpace && (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-end justify-center z-50 backdrop-blur-sm">
        <div className="bg-white rounded-t-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
          {/* Hero Image */}
          <div className="relative h-64 bg-cover bg-center" style={{backgroundImage: `url(${selectedSpace.image})`}}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <button
              onClick={() => setSelectedSpace(null)}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all"
            >
              <X className="h-5 w-5 text-gray-700" />
            </button>
            <div className="absolute bottom-6 left-6 text-white">
              <h2 className="text-2xl font-heading font-bold mb-1">{selectedSpace.name}</h2>
              <p className="flex items-center text-sm opacity-90">
                <MapPin className="h-4 w-4 mr-1" />
                {selectedSpace.address} • {selectedSpace.distance} mi away
              </p>
            </div>
            <div className={`absolute top-4 left-4 px-3 py-2 rounded-full text-sm font-semibold backdrop-blur-sm ${
              selectedSpace.available
                ? 'bg-nyc-park/80 text-white'
                : 'bg-nyc-brick/80 text-white'
            }`}>
              {selectedSpace.available ? '🟢 Available Now' : '🔴 Currently Busy'}
            </div>
          </div>

          <div className="p-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="bg-nyc-subway/20 p-3 rounded-2xl mb-2">
                  <Star className="h-6 w-6 text-nyc-subway mx-auto" />
                </div>
                <p className="text-2xl font-bold text-nyc-charcoal">{selectedSpace.rating}</p>
                <p className="text-xs text-urban-medium">Rating</p>
              </div>
              <div className="text-center">
                <div className="bg-nyc-sky/20 p-3 rounded-2xl mb-2">
                  <Users className="h-6 w-6 text-nyc-sky mx-auto" />
                </div>
                <p className="text-2xl font-bold text-nyc-charcoal">{selectedSpace.capacity}</p>
                <p className="text-xs text-urban-medium">Capacity</p>
              </div>
              <div className="text-center">
                <div className="bg-nyc-park/20 p-3 rounded-2xl mb-2">
                  <Clock className="h-6 w-6 text-nyc-park mx-auto" />
                </div>
                <p className="text-2xl font-bold text-nyc-charcoal">{selectedSpace.checkins}</p>
                <p className="text-xs text-urban-medium">Check-ins</p>
              </div>
            </div>

            {/* Space Type & Amenities */}
            <div className="mb-6">
              <h3 className="font-heading font-bold text-lg text-nyc-charcoal mb-3">What's Available</h3>
              <div className="bg-nyc-warm/50 rounded-2xl p-4 mb-4">
                <span className="inline-block bg-nyc-subway/20 text-nyc-charcoal px-3 py-2 rounded-full text-sm font-semibold mb-3">
                  {selectedSpace.type}
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedSpace.amenities.map((amenity, idx) => (
                    <span key={idx} className="bg-white text-nyc-charcoal px-3 py-1.5 rounded-full text-sm border border-nyc-concrete">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Current Event */}
            {selectedSpace.currentEvent && (
              <div className="mb-6">
                <h3 className="font-heading font-bold text-lg text-nyc-charcoal mb-3">Happening Now</h3>
                <div className="bg-gradient-to-r from-nyc-brick/10 to-nyc-orange/10 rounded-2xl p-4 border border-nyc-brick/20">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                    <p className="font-bold text-nyc-brick">🎯 {selectedSpace.currentEvent.title}</p>
                  </div>
                  <p className="text-sm text-urban-medium">{selectedSpace.currentEvent.attendees} people • Ends {selectedSpace.currentEvent.endTime}</p>
                </div>
              </div>
            )}

            {/* Community Reviews */}
            <div className="mb-6">
              <h3 className="font-heading font-bold text-lg text-nyc-charcoal mb-3">Community Reviews</h3>
              <div className="space-y-3">
                {spaceReviews.filter(review => review.spaceId === selectedSpace.id).map(review => (
                  <div key={review.id} className="bg-nyc-warm/30 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-nyc-subway to-nyc-orange rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-sm font-bold">{review.userName[0]}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-nyc-charcoal text-sm">{review.userName}</p>
                          <div className="flex items-center">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 text-nyc-subway fill-current" />
                            ))}
                            <span className="text-xs text-urban-medium ml-1">{review.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-urban-medium">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Transit Info */}
            {transitInfo[selectedSpace.id] && (
              <div className="mb-6">
                <h3 className="font-heading font-bold text-lg text-nyc-charcoal mb-3">Getting There</h3>
                <div className="bg-nyc-sky/10 rounded-2xl p-4 border border-nyc-sky/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-nyc-sky">🚇 NYC Transit</span>
                    <span className="text-sm font-bold text-nyc-charcoal">{transitInfo[selectedSpace.id].duration}</span>
                  </div>
                  <p className="text-sm text-urban-medium mb-2">{transitInfo[selectedSpace.id].route}</p>
                  <p className="text-sm font-semibold text-nyc-charcoal">{transitInfo[selectedSpace.id].cost}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 sticky bottom-0 bg-white pt-4 border-t border-nyc-concrete">
              <button
                onClick={() => {setShowBookingModal(true);}}
                className="flex-1 py-4 px-5 bg-gradient-to-r from-nyc-subway to-nyc-orange text-white rounded-2xl font-heading font-bold hover:from-nyc-subway/90 hover:to-nyc-orange/90 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                ✨ Book Now
              </button>
              <button className="flex-1 py-4 px-5 border-2 border-nyc-concrete text-nyc-charcoal rounded-2xl font-heading font-bold hover:border-nyc-brick hover:bg-nyc-warm transition-all duration-300">
                💬 Ask Host
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  // Booking Modal
  const BookingModal = () => {
    // Generate available dates (next 30 days)
    const generateAvailableDates = () => {
      const dates = [];
      const today = new Date();
      for (let i = 1; i <= 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date.toISOString().split('T')[0]);
      }
      return dates;
    };

    // Generate time options (24-hour format for input, but display 12-hour)
    const formatTimeForDisplay = (time24) => {
      if (!time24) return '';
      const [hours, minutes] = time24.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${displayHour}:${minutes} ${ampm}`;
    };

    const validateTimes = () => {
      if (!startTime || !endTime) return false;
      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(`2000-01-01T${endTime}`);
      return end > start;
    };

    const calculateDuration = () => {
      if (!startTime || !endTime || !validateTimes()) return '';
      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(`2000-01-01T${endTime}`);
      const diffMs = end - start;
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      if (hours === 0) return `${minutes} min`;
      if (minutes === 0) return `${hours} hr`;
      return `${hours} hr ${minutes} min`;
    };

    const availableDates = generateAvailableDates();

    const handleBooking = () => {
      if (!selectedDate || !startTime || !endTime || !participantCount) {
        alert('Please fill in all booking details');
        return;
      }

      if (!validateTimes()) {
        alert('End time must be after start time');
        return;
      }

      // Create time slot string for display
      const timeSlot = `${formatTimeForDisplay(startTime)} - ${formatTimeForDisplay(endTime)}`;

      // Generate QR code data
      const bookingId = 'BK-' + Date.now();
      const qrData = `BAZAAR-BOOKING:${bookingId}:${selectedSpace.name}:${selectedDate}:${timeSlot}:${participantCount}`;

      // Create new booking
      const newBooking = {
        id: bookingId,
        spaceName: selectedSpace.name,
        spaceImage: selectedSpace.image,
        date: selectedDate,
        startTime: startTime,
        endTime: endTime,
        timeSlot: timeSlot,
        participants: participantCount,
        duration: calculateDuration(),
        qrCode: qrData,
        status: 'confirmed',
        bookedAt: new Date().toISOString()
      };

      // Add to bookings
      setMyBookings([...myBookings, newBooking]);

      // Reset form
      setSelectedDate('');
      setStartTime('');
      setEndTime('');
      setParticipantCount(1);
      setShowBookingModal(false);

      // Show success QR code
      setShowQRCode(true);
    };

    return showBookingModal && selectedSpace && (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          {/* Header */}
          <div className="relative p-6 bg-gradient-to-r from-nyc-subway to-nyc-orange text-white rounded-t-3xl">
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <span className="text-white text-lg">×</span>
            </button>
            <h2 className="text-xl font-heading font-bold mb-1">Book Your Space</h2>
            <p className="text-nyc-warm text-sm">{selectedSpace.name}</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Date Selection */}
            <div>
              <label className="block text-sm font-semibold text-nyc-charcoal mb-3">📅 Select Date</label>
              <div className="grid grid-cols-3 gap-2">
                {availableDates.slice(0, 9).map(date => {
                  const dateObj = new Date(date);
                  const isSelected = selectedDate === date;
                  return (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`p-3 rounded-xl text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-nyc-subway text-white shadow-lg'
                          : 'bg-nyc-concrete/20 text-nyc-charcoal hover:bg-nyc-subway/20'
                      }`}
                    >
                      <div className="text-xs">{dateObj.toLocaleDateString('en', {weekday: 'short'})}</div>
                      <div>{dateObj.getDate()}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Selection */}
            <div>
              <label className="block text-sm font-semibold text-nyc-charcoal mb-3">⏰ Select Time</label>
              <div className="grid grid-cols-2 gap-4">
                {/* Start Time */}
                <div>
                  <label className="block text-xs text-urban-medium mb-2">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    min="06:00"
                    max="23:00"
                    className="w-full p-3 rounded-xl border border-nyc-concrete/30 focus:outline-none focus:ring-2 focus:ring-nyc-subway focus:border-transparent text-nyc-charcoal"
                  />
                  {startTime && (
                    <p className="text-xs text-urban-medium mt-1">{formatTimeForDisplay(startTime)}</p>
                  )}
                </div>

                {/* End Time */}
                <div>
                  <label className="block text-xs text-urban-medium mb-2">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    min={startTime || "06:00"}
                    max="23:59"
                    className="w-full p-3 rounded-xl border border-nyc-concrete/30 focus:outline-none focus:ring-2 focus:ring-nyc-subway focus:border-transparent text-nyc-charcoal"
                  />
                  {endTime && (
                    <p className="text-xs text-urban-medium mt-1">{formatTimeForDisplay(endTime)}</p>
                  )}
                </div>
              </div>

              {/* Duration Display */}
              {startTime && endTime && validateTimes() && (
                <div className="mt-3 p-3 bg-nyc-subway/10 rounded-xl border border-nyc-subway/20">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-nyc-subway">⏱️ Duration:</span>
                    <span className="text-sm font-bold text-nyc-charcoal">{calculateDuration()}</span>
                  </div>
                </div>
              )}

              {/* Time Validation Error */}
              {startTime && endTime && !validateTimes() && (
                <div className="mt-3 p-3 bg-nyc-brick/10 rounded-xl border border-nyc-brick/20">
                  <p className="text-sm text-nyc-brick">⚠️ End time must be after start time</p>
                </div>
              )}
            </div>

            {/* Participant Count */}
            <div>
              <label className="block text-sm font-semibold text-nyc-charcoal mb-3">👥 Number of Participants</label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setParticipantCount(Math.max(1, participantCount - 1))}
                  className="w-10 h-10 bg-nyc-concrete/30 rounded-full flex items-center justify-center font-bold text-nyc-charcoal hover:bg-nyc-subway hover:text-white transition-colors"
                >
                  -
                </button>
                <span className="text-2xl font-bold text-nyc-charcoal min-w-[3rem] text-center">{participantCount}</span>
                <button
                  onClick={() => setParticipantCount(Math.min(selectedSpace.capacity, participantCount + 1))}
                  className="w-10 h-10 bg-nyc-concrete/30 rounded-full flex items-center justify-center font-bold text-nyc-charcoal hover:bg-nyc-subway hover:text-white transition-colors"
                >
                  +
                </button>
                <span className="text-sm text-urban-medium">Max {selectedSpace.capacity}</span>
              </div>
            </div>

            {/* Booking Summary */}
            {selectedDate && startTime && endTime && validateTimes() && (
              <div className="bg-nyc-warm/50 rounded-xl p-4 border border-nyc-concrete/30">
                <h4 className="font-semibold text-nyc-charcoal mb-2">📋 Booking Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-urban-medium">Date:</span>
                    <span className="font-medium text-nyc-charcoal">{new Date(selectedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-urban-medium">Time:</span>
                    <span className="font-medium text-nyc-charcoal">{formatTimeForDisplay(startTime)} - {formatTimeForDisplay(endTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-urban-medium">Duration:</span>
                    <span className="font-medium text-nyc-charcoal">{calculateDuration()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-urban-medium">Participants:</span>
                    <span className="font-medium text-nyc-charcoal">{participantCount} {participantCount === 1 ? 'person' : 'people'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Book Button */}
            <button
              onClick={handleBooking}
              disabled={!selectedDate || !startTime || !endTime || !validateTimes()}
              className="w-full py-4 bg-gradient-to-r from-nyc-subway to-nyc-orange text-white rounded-2xl font-heading font-bold hover:from-nyc-subway/90 hover:to-nyc-orange/90 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none"
            >
              ✨ Confirm Booking
            </button>
          </div>
        </div>
      </div>
    );
  };

  // QR Code Modal
  const QRCodeModal = () => (
    showQRCode && (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
          <div className="text-center">
            <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">📱 Check-in QR Code</h3>
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-3xl mb-6 border-2 border-blue-200 shadow-inner">
              {/* Static QR Code Pattern */}
              <div className="w-48 h-48 mx-auto bg-white p-4 rounded-2xl shadow-inner">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {/* QR Code Corner Markers */}
                  <rect x="0" y="0" width="50" height="50" fill="black" />
                  <rect x="10" y="10" width="30" height="30" fill="white" />
                  <rect x="20" y="20" width="10" height="10" fill="black" />

                  <rect x="150" y="0" width="50" height="50" fill="black" />
                  <rect x="160" y="10" width="30" height="30" fill="white" />
                  <rect x="170" y="20" width="10" height="10" fill="black" />

                  <rect x="0" y="150" width="50" height="50" fill="black" />
                  <rect x="10" y="160" width="30" height="30" fill="white" />
                  <rect x="20" y="170" width="10" height="10" fill="black" />

                  {/* QR Code Data Pattern */}
                  <rect x="70" y="10" width="10" height="10" fill="black" />
                  <rect x="90" y="10" width="10" height="10" fill="black" />
                  <rect x="110" y="10" width="10" height="10" fill="black" />
                  <rect x="130" y="10" width="10" height="10" fill="black" />

                  <rect x="10" y="70" width="10" height="10" fill="black" />
                  <rect x="30" y="70" width="10" height="10" fill="black" />
                  <rect x="50" y="70" width="10" height="10" fill="black" />
                  <rect x="70" y="70" width="10" height="10" fill="black" />
                  <rect x="90" y="70" width="10" height="10" fill="black" />
                  <rect x="110" y="70" width="10" height="10" fill="black" />
                  <rect x="130" y="70" width="10" height="10" fill="black" />
                  <rect x="150" y="70" width="10" height="10" fill="black" />
                  <rect x="170" y="70" width="10" height="10" fill="black" />
                  <rect x="190" y="70" width="10" height="10" fill="black" />

                  <rect x="70" y="90" width="10" height="10" fill="black" />
                  <rect x="110" y="90" width="10" height="10" fill="black" />
                  <rect x="130" y="90" width="10" height="10" fill="black" />
                  <rect x="170" y="90" width="10" height="10" fill="black" />

                  <rect x="30" y="110" width="10" height="10" fill="black" />
                  <rect x="50" y="110" width="10" height="10" fill="black" />
                  <rect x="90" y="110" width="10" height="10" fill="black" />
                  <rect x="130" y="110" width="10" height="10" fill="black" />
                  <rect x="150" y="110" width="10" height="10" fill="black" />
                  <rect x="190" y="110" width="10" height="10" fill="black" />

                  <rect x="10" y="130" width="10" height="10" fill="black" />
                  <rect x="50" y="130" width="10" height="10" fill="black" />
                  <rect x="70" y="130" width="10" height="10" fill="black" />
                  <rect x="110" y="130" width="10" height="10" fill="black" />
                  <rect x="150" y="130" width="10" height="10" fill="black" />
                  <rect x="170" y="130" width="10" height="10" fill="black" />

                  <rect x="70" y="170" width="10" height="10" fill="black" />
                  <rect x="90" y="170" width="10" height="10" fill="black" />
                  <rect x="110" y="170" width="10" height="10" fill="black" />
                  <rect x="130" y="170" width="10" height="10" fill="black" />
                  <rect x="150" y="170" width="10" height="10" fill="black" />
                  <rect x="170" y="170" width="10" height="10" fill="black" />
                  <rect x="190" y="170" width="10" height="10" fill="black" />

                  <rect x="70" y="190" width="10" height="10" fill="black" />
                  <rect x="110" y="190" width="10" height="10" fill="black" />
                  <rect x="150" y="190" width="10" height="10" fill="black" />
                  <rect x="190" y="190" width="10" height="10" fill="black" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-6 flex items-center justify-center">
              <span className="mr-2">🚪</span>
              Show this code at the space entrance
            </p>
            <div className="flex space-x-4">
              <button
                className="flex-1 px-6 py-4 bg-gray-100 text-gray-800 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-200"
                onClick={() => setShowQRCode(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-semibold flex items-center justify-center hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                onClick={() => {
                  setShowQRCode(false);
                  // Show success animation
                  const successDiv = document.createElement('div');
                  successDiv.innerHTML = '✅ Checked in successfully!';
                  successDiv.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg z-50';
                  document.body.appendChild(successDiv);
                  setTimeout(() => document.body.removeChild(successDiv), 3000);
                }}
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Check in
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-urban-light to-nyc-warm max-w-md mx-auto border-l border-r border-urban-medium/20 shadow-2xl font-body">
      {/* Status Bar Simulation */}
      <div className="bg-nyc-charcoal px-4 py-2 text-center text-xs text-urban-light font-medium">
        
      </div>

      {/* Header */}
      <header className="relative bg-gradient-to-r from-nyc-warm to-white px-6 py-5 border-b border-nyc-concrete flex items-center justify-between shadow-lg">
        <div className="flex items-center">
          <div className="bg-gradient-to-br from-nyc-brick to-nyc-subway p-3 rounded-xl shadow-lg mr-4 animate-float">
            <Building className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-nyc-charcoal to-nyc-brick bg-clip-text text-transparent">
              Bazaar
            </h1>
            <p className="text-xs text-nyc-brick font-semibold">Your city's living room ✨</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isLandlordMode ? (
            <>
              <div className="relative notifications-container">
                <button
                  className="relative p-3 hover:bg-nyc-concrete/30 rounded-xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="h-5 w-5 text-urban-medium" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-nyc-subway to-nyc-orange text-nyc-charcoal text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-bounce-gentle">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-nyc-warm rounded-xl shadow-2xl border border-nyc-concrete z-50 overflow-hidden">
                    <div className="p-4 bg-gradient-to-r from-nyc-concrete to-nyc-warm border-b border-urban-light">
                      <div className="flex items-center justify-between">
                        <h3 className="font-heading font-semibold text-nyc-charcoal flex items-center">
                          🔔 Notifications
                          <span className="ml-2 text-xs bg-nyc-subway text-nyc-charcoal px-2 py-1 rounded-full font-bold">
                            {notifications.length} new
                          </span>
                        </h3>
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="p-1 hover:bg-nyc-concrete/50 rounded-lg transition-colors duration-200"
                        >
                          <X className="h-4 w-4 text-urban-medium" />
                        </button>
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map(notification => (
                        <div key={notification.id} className="p-4 border-b border-nyc-concrete/30 hover:bg-nyc-concrete/20 transition-colors duration-200 last:border-b-0">
                          <h4 className="font-medium text-nyc-charcoal text-sm mb-1">{notification.title}</h4>
                          <p className="text-urban-medium text-xs mb-2">{notification.message}</p>
                          <p className="text-nyc-brick text-xs font-medium">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-nyc-concrete/30 text-center border-t border-nyc-concrete">
                      <button
                        onClick={() => {
                          setNotifications([]);
                          setShowNotifications(false);
                        }}
                        className="text-sm text-nyc-brick font-semibold hover:text-nyc-charcoal transition-colors duration-200"
                      >
                        Mark all as read
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsLandlordMode(false)}
                className="px-4 py-2 bg-gradient-to-r from-nyc-brick to-nyc-subway text-white rounded-xl text-sm font-semibold hover:from-nyc-brick/80 hover:to-nyc-subway/80 transition-all duration-200 transform hover:scale-105 shadow-md"
              >
                👤 User Mode
              </button>
              <button className="p-3 hover:bg-nyc-concrete/30 rounded-xl transition-all duration-300 transform hover:scale-105">
                <Menu className="h-5 w-5 text-urban-medium" />
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {isLandlordMode ? (
          <LandlordDashboard />
        ) : (
          <>
            {activeTab === 'discover' && <DiscoverTab />}
            {activeTab === 'events' && <EventsTab />}
            {activeTab === 'profile' && <ProfileTab />}
          </>
        )}
        
        <SpaceDetailsModal />
        <BookingModal />
        <QRCodeModal />
        <OnboardingTutorial />
        <AddSpaceModal />
      </main>

      {/* Bottom Navigation - Hidden in Landlord Mode */}
      {!isLandlordMode && (
        <nav className="bg-gradient-to-r from-nyc-warm to-white border-t border-nyc-concrete px-3 py-4 shadow-2xl">
        <div className="flex justify-around">
          <button
            onClick={() => setActiveTab('discover')}
            className={`relative flex flex-col items-center py-4 px-5 rounded-2xl transition-all duration-500 ${
              activeTab === 'discover'
                ? 'text-nyc-charcoal bg-gradient-to-t from-nyc-subway/20 to-nyc-orange/20 shadow-xl transform scale-110 -translate-y-1 border border-nyc-subway/30'
                : 'text-urban-medium hover:text-nyc-charcoal hover:bg-nyc-concrete/30 hover:scale-105'
            }`}
          >
            <Home className={`h-6 w-6 mb-2 transition-all duration-300 ${
              activeTab === 'discover' ? 'animate-bounce-gentle' : ''
            }`} />
            <span className="text-xs font-heading font-semibold">Discover</span>
            {activeTab === 'discover' && (
              <div className="absolute -bottom-2 w-12 h-1 bg-gradient-to-r from-nyc-subway to-nyc-orange rounded-full animate-pulse"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`relative flex flex-col items-center py-4 px-5 rounded-2xl transition-all duration-500 ${
              activeTab === 'events'
                ? 'text-nyc-charcoal bg-gradient-to-t from-nyc-brick/20 to-nyc-sky/20 shadow-xl transform scale-110 -translate-y-1 border border-nyc-brick/30'
                : 'text-urban-medium hover:text-nyc-charcoal hover:bg-nyc-concrete/30 hover:scale-105'
            }`}
          >
            <Calendar className={`h-6 w-6 mb-2 transition-all duration-300 ${
              activeTab === 'events' ? 'animate-bounce-gentle' : ''
            }`} />
            <span className="text-xs font-heading font-semibold">Events</span>
            {activeTab === 'events' && (
              <div className="absolute -bottom-2 w-12 h-1 bg-gradient-to-r from-nyc-brick to-nyc-sky rounded-full animate-pulse"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`relative flex flex-col items-center py-4 px-5 rounded-2xl transition-all duration-500 ${
              activeTab === 'profile'
                ? 'text-nyc-charcoal bg-gradient-to-t from-nyc-park/20 to-nyc-sky/20 shadow-xl transform scale-110 -translate-y-1 border border-nyc-park/30'
                : 'text-urban-medium hover:text-nyc-charcoal hover:bg-nyc-concrete/30 hover:scale-105'
            }`}
          >
            <User className={`h-6 w-6 mb-2 transition-all duration-300 ${
              activeTab === 'profile' ? 'animate-bounce-gentle' : ''
            }`} />
            <span className="text-xs font-heading font-semibold">Profile</span>
            {activeTab === 'profile' && (
              <div className="absolute -bottom-2 w-12 h-1 bg-gradient-to-r from-nyc-park to-nyc-sky rounded-full animate-pulse"></div>
            )}
            {/* Notifications badge on profile */}
            {notifications.length > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-nyc-subway to-nyc-orange rounded-full flex items-center justify-center shadow-md">
                <span className="text-nyc-charcoal text-xs font-bold">{notifications.length}</span>
              </div>
            )}
          </button>
        </div>
        </nav>
      )}
    </div>
  );
};

export default SpaceFlowMobile;