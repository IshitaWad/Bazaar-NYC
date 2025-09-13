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
  const [userLocation, setUserLocation] = useState({ lat: 40.7589, lng: -73.9851 });
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const mapRef = useRef(null);
  
  const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "AIzaSyCPLrPMHFWtBwPlCAfnUVjwVtCyPRNXphE";

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
      checkins: 298
    }
  ]);

  // Load Google Maps API
  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === "YOUR_API_KEY_HERE") {
      console.error('Google Maps API key is not configured');
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
    if (mapLoaded && !mapError && viewMode === 'map' && mapRef.current && !map) {
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
    <div className="relative h-full">
      <div ref={mapRef} className="w-full h-full" />
      
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

      {/* Selected Space Card */}
      {selectedSpace && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl shadow-xl border max-h-48 overflow-y-auto">
          <div className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{selectedSpace.name}</h3>
                <p className="text-sm text-gray-600 flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {selectedSpace.distance} mi • {selectedSpace.address}
                </p>
                <div className="flex items-center mt-1">
                  <Star className="h-3 w-3 text-yellow-400 mr-1" />
                  <span className="text-sm text-gray-600">{selectedSpace.rating}</span>
                  <span className="text-xs text-gray-400 ml-1">({selectedSpace.checkins} reviews)</span>
                </div>
              </div>
              <button 
                className="p-1"
                onClick={() => setSelectedSpace(null)}
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            
            {/* Google Places Features */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Hours:</span>
                <span className="text-green-600 font-medium">Open 24/7</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Phone:</span>
                <span className="text-blue-600">(212) 555-0123</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Website:</span>
                <span className="text-blue-600">View details</span>
              </div>
            </div>

            {/* Transit Information */}
            {transitInfo[selectedSpace.id] && (
              <div className="bg-blue-50 rounded-lg p-3 mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-blue-800">🚇 Transit Route</span>
                  <span className="text-sm text-blue-600">{transitInfo[selectedSpace.id].duration}</span>
                </div>
                <p className="text-xs text-blue-600 mb-1">{transitInfo[selectedSpace.id].route}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-blue-500">Cost: {transitInfo[selectedSpace.id].cost}</span>
                  <button 
                    className="text-xs text-blue-600 font-medium"
                    onClick={() => {
                      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${selectedSpace.coordinates.lat},${selectedSpace.coordinates.lng}`;
                      window.open(url, '_blank');
                    }}
                  >
                    Open in Maps
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className={`px-2 py-1 rounded-full text-xs ${
                selectedSpace.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {selectedSpace.available ? 'Available Now' : 'In Use'}
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                  Call
                </button>
                <button 
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm"
                  onClick={() => {
                    const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${selectedSpace.coordinates.lat},${selectedSpace.coordinates.lng}`;
                    window.open(url, '_blank');
                  }}
                >
                  Directions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
    <div className="flex flex-col h-full">
      {/* Search Header */}
      <div className="bg-white p-4 border-b sticky top-0 z-10">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search spaces or events..."
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            className="absolute right-3 top-2.5"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 text-gray-400" />
          </button>
        </div>
        
        {/* View Toggle */}
        <div className="flex justify-center">
          <div className="bg-gray-100 p-1 rounded-full flex">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                viewMode === 'map' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
              }`}
            >
              Map
            </button>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      {showFilters && (
        <div className="bg-white px-4 py-3 border-b">
          <div className="flex space-x-2 overflow-x-auto">
            <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm whitespace-nowrap">Nearby</button>
            <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm whitespace-nowrap">Available Now</button>
            <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm whitespace-nowrap">Events Today</button>
            <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm whitespace-nowrap">Workshop</button>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'map' ? (
          <MapView />
        ) : (
          <div className="overflow-y-auto h-full">
            <div className="p-4 space-y-4">
              {spaces.map(space => (
                <div key={space.id} className="bg-white rounded-xl shadow-sm p-4 border">
                  {/* Space Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg">{space.name}</h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{space.distance} mi • {space.address}</span>
                      </div>
                      <div className="flex items-center mt-1 space-x-3">
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 mr-1" />
                          <span className="text-sm text-gray-600">{space.rating}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-3 w-3 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-600">Up to {space.capacity}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      space.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {space.available ? 'Available' : 'In Use'}
                    </div>
                  </div>

                  {/* Current/Upcoming Events */}
                  {space.currentEvent && (
                    <div className="bg-blue-50 rounded-lg p-3 mb-3">
                      <p className="font-medium text-blue-800 text-sm">Now: {space.currentEvent.title}</p>
                      <p className="text-xs text-blue-600">{space.currentEvent.attendees} people • Ends {space.currentEvent.endTime}</p>
                    </div>
                  )}

                  {space.upcomingEvents.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Coming Up</p>
                      {space.upcomingEvents.slice(0, 1).map(event => (
                        <div key={event.id} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium text-gray-800 text-sm">{event.title}</p>
                              <p className="text-xs text-gray-600">by {event.organizer}</p>
                              <p className="text-xs text-gray-500">{event.time}</p>
                            </div>
                            <button className="px-2 py-1 bg-blue-500 text-white text-xs rounded-lg">
                              Join
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Amenities */}
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {space.amenities.slice(0, 3).map((amenity, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {amenity}
                        </span>
                      ))}
                      {space.amenities.length > 3 && (
                        <span className="text-xs text-gray-500">+{space.amenities.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button 
                      className="flex-1 py-2 px-3 bg-blue-500 text-white rounded-lg text-sm font-medium"
                      onClick={() => {setSelectedSpace(space); setShowQRCode(true);}}
                    >
                      Check In
                    </button>
                    <button className="flex-1 py-2 px-3 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Events Tab
  const EventsTab = () => (
    <div className="p-4 space-y-4 overflow-y-auto h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">My Events</h2>
        <button className="p-2 bg-blue-500 text-white rounded-full">
          <Plus className="h-5 w-5" />
        </button>
      </div>
      
      <div className="space-y-3">
        <div className="bg-white rounded-xl shadow-sm p-4 border">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-gray-800">UI/UX Workshop</h3>
              <p className="text-sm text-gray-600">Midtown Creative Studio</p>
              <p className="text-sm text-gray-500">Today • 2:00 PM - 5:00 PM</p>
            </div>
            <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
              Confirmed
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">15/25 registered</span>
            <button 
              className="text-blue-600 text-sm font-medium"
              onClick={() => setShowQRCode(true)}
            >
              QR Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Profile Tab
  const ProfileTab = () => (
    <div className="p-4 space-y-6 overflow-y-auto h-full">
      <div className="text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
          <User className="h-10 w-10 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Alex Rivera</h2>
        <p className="text-gray-600">Event Organizer</p>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-gray-800">12</p>
          <p className="text-sm text-gray-600">Events Hosted</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-800">234</p>
          <p className="text-sm text-gray-600">Attendees</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-800">4.8</p>
          <p className="text-sm text-gray-600">Rating</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <button className="w-full text-left p-3 bg-white rounded-lg shadow-sm border">
          Switch to Consumer Mode
        </button>
        <button className="w-full text-left p-3 bg-white rounded-lg shadow-sm border">
          Landlord Dashboard
        </button>
        <button className="w-full text-left p-3 bg-white rounded-lg shadow-sm border">
          Settings
        </button>
        <button className="w-full text-left p-3 bg-white rounded-lg shadow-sm border">
          Help & Support
        </button>
      </div>
    </div>
  );

  // QR Code Modal
  const QRCodeModal = () => (
    showQRCode && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Check-in QR Code</h3>
            <div className="bg-gray-50 p-8 rounded-2xl mb-4 border-2 border-gray-200">
              <div className="grid grid-cols-8 gap-1">
                {Array.from({length: 64}).map((_, i) => (
                  <div 
                    key={i} 
                    className={`aspect-square ${Math.random() > 0.5 ? 'bg-gray-800' : 'bg-white'}`}
                  ></div>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Show this code at the space entrance
            </p>
            <div className="flex space-x-3">
              <button 
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-800 rounded-xl font-medium"
                onClick={() => setShowQRCode(false)}
              >
                Cancel
              </button>
              <button 
                className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl font-medium flex items-center justify-center"
                onClick={() => {setShowQRCode(false); alert('Checked in successfully!');}}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Verify
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto border-l border-r">
      {/* Status Bar Simulation */}
      <div className="bg-white px-4 py-1 text-center text-xs text-gray-600 border-b">
        9:41 AM • SpaceFlow • 4G
      </div>

      {/* Header */}
      <header className="bg-white px-4 py-3 border-b flex items-center justify-between">
        <div className="flex items-center">
          <Building className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-lg font-bold text-gray-800">SpaceFlow</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Bell className="h-5 w-5 text-gray-600" />
          <Menu className="h-5 w-5 text-gray-600" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {activeTab === 'discover' && <DiscoverTab />}
        {activeTab === 'events' && <EventsTab />}
        {activeTab === 'profile' && <ProfileTab />}
        
        <QRCodeModal />
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t px-1 py-2">
        <div className="flex justify-around">
          <button
            onClick={() => setActiveTab('discover')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg ${
              activeTab === 'discover' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
            }`}
          >
            <Home className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Discover</span>
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg ${
              activeTab === 'events' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
            }`}
          >
            <Calendar className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Events</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg ${
              activeTab === 'profile' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
            }`}
          >
            <User className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default SpaceFlowMobile;