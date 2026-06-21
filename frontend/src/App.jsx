import { useState, useEffect } from 'react'
import { SignInButton, UserButton, useUser, useClerk } from '@clerk/clerk-react'
import './App.css'

const API_URL = 'https://vyaparsetu-jsu1.onrender.com';

// 📍 All Over India Major Cities List
const INDIA_CITIES = [
  "Agra, UP", "Ahmedabad, Gujarat", "Amritsar, Punjab", "Bangalore, Karnataka",
  "Bhavnagar, Gujarat", "Bhopal, MP", "Bhubaneswar, Odisha", "Chandigarh",
  "Chennai, Tamil Nadu", "Coimbatore, Tamil Nadu", "Dehradun, Uttarakhand",
  "Delhi, NCR", "Faridabad, Haryana", "Gandhinagar, Gujarat", "Ghaziabad, UP",
  "Gurgaon, Haryana", "Guwahati, Assam", "Gwalior, MP", "Hyderabad, Telangana",
  "Indore, MP", "Jabalpur, MP", "Jaipur, Rajasthan", "Jalandhar, Punjab",
  "Jamnagar, Gujarat", "Jamshedpur, Jharkhand", "Jodhpur, Rajasthan",
  "Junagadh, Gujarat", "Kanpur, UP", "Kochi, Kerala", "Kolkata, West Bengal",
  "Lucknow, UP", "Ludhiana, Punjab", "Madurai, Tamil Nadu", "Meerut, UP",
  "Mumbai, Maharashtra", "Mysore, Karnataka", "Nagpur, Maharashtra",
  "Nashik, Maharashtra", "Noida, UP", "Patna, Bihar", "Pune, Maharashtra",
  "Raipur, Chhattisgarh", "Rajkot, Gujarat", "Ranchi, Jharkhand",
  "Surat, Gujarat", "Thane, Maharashtra", "Thiruvananthapuram, Kerala",
  "Vadodara, Gujarat", "Varanasi, UP", "Vijayawada, AP", "Visakhapatnam, AP"
];

const translations = {
  'English': { welcome: 'Welcome to VyaparSetu', explore: 'Explore Services', listBiz: 'List My Business', home: 'Home', feed: 'Feed', chat: 'Chat', profile: 'Profile', insights: 'Insights', listings: 'Listings', leads: 'Leads', logout: 'Log Out' },
  'ગુજરાતી': { welcome: 'વ્યાપારસેતુ માં સ્વાગત છે', explore: 'સેવાઓ શોધો', listBiz: 'મારો વ્યાપાર ઉમેરો', home: 'હોમ', feed: 'અપડેટ્સ', chat: 'ચેટ', profile: 'પ્રોફાઇલ', insights: 'માહિતી', listings: 'યાદી', leads: 'ગ્રાહકો', logout: 'બહાર નીકળો' },
  'हिन्दी': { welcome: 'व्यापारसेतु में आपका स्वागत है', explore: 'सेवाएं खोजें', listBiz: 'मेरा व्यापार जोड़ें', home: 'होम', feed: 'फ़ीड', chat: 'चैट', profile: 'प्रोफ़ाइल', insights: 'जानकारी', listings: 'सूची', leads: 'ग्राहक', logout: 'लॉग आउट' }
};

function App() {
  const [step, setStep] = useState('splash')
  const [appLanguage, setAppLanguage] = useState('English')
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (step === 'splash' && isLoaded) {
      setTimeout(() => {
        if (isSignedIn) setStep('role-select'); 
        else setStep('onboarding');
      }, 2500);
    }
  }, [step, isSignedIn, isLoaded]);

  useEffect(() => {
    if (isSignedIn && step === 'login') setStep('role-select');
  }, [isSignedIn, step]);

  return (
    <div className="mobile-container">
      {step === 'splash' && <SplashScreen />}
      {step === 'onboarding' && <Onboarding onNext={() => setStep('login')} language={appLanguage} setLanguage={setAppLanguage} />}
      {step === 'login' && <LoginScreen />}
      {step === 'role-select' && <RoleSelection onSelectRole={(role) => setStep(role === 'buyer' ? 'buyer-dashboard' : 'seller-dashboard')} language={appLanguage} />}
      {step === 'buyer-dashboard' && <BuyerDashboard language={appLanguage} setLanguage={setAppLanguage} />}
      {step === 'seller-dashboard' && <SellerDashboard language={appLanguage} setLanguage={setAppLanguage} />}
    </div>
  )
}

function SplashScreen() {
  return (
    <div className="screen center splash-bg">
      <h1 className="logo-text">VyaparSetu</h1><p className="tagline">Local Market. Direct Chat.</p>
    </div>
  )
}

function Onboarding({ onNext, language, setLanguage }) {
  const t = translations[language];
  return (
    <div className="screen">
      <h2 className="title">{t.welcome}</h2><p className="subtitle">Discover local services & deals directly</p>
      <div className="form-group mt-15"><label>Select Language</label><select className="input-box" value={language} onChange={(e) => setLanguage(e.target.value)}><option value="English">English</option><option value="ગુજરાતી">ગુજરાતી</option><option value="हिन्दी">हिन्दी</option></select></div>
      <div className="form-group mt-15"><label>Your Location</label><button className="btn-location" onClick={() => alert('Rajkot, Gujarat detected!')}>📍 Auto-Detect My Location</button></div>
      <div className="spacer"></div><button className="btn-primary" onClick={onNext}>Continue ➔</button>
    </div>
  )
}

function LoginScreen() {
  return (
    <div className="screen center-content">
      <h2 className="title">Login / Sign Up</h2><p style={{color: '#666', marginBottom: '30px'}}>Secure authentication</p>
      <SignInButton mode="modal"><button className="btn-google" style={{fontSize: '1.1rem', padding: '15px'}}>🌐 Continue with Google / Email</button></SignInButton>
    </div>
  )
}

function RoleSelection({ onSelectRole, language }) {
  const t = translations[language];
  return (
    <div className="screen center-content">
      <h2 className="title">Who are you?</h2>
      <button className="btn-role" onClick={() => onSelectRole('buyer')}><h3>🛍️ {t.explore}</h3><p>Find local shops, properties, and tiffin services</p></button>
      <button className="btn-role mt-15" onClick={() => onSelectRole('seller')}><h3>🏪 {t.listBiz}</h3><p>Create your portfolio and chat with local leads</p></button>
    </div>
  )
}

function BuyerDashboard({ language, setLanguage }) {
  const [activeTab, setActiveTab] = useState('home')
  const [activeChatUser, setActiveChatUser] = useState(null)
  const [stores, setStores] = useState([])
  const [selectedStore, setSelectedStore] = useState(null) 
  const [userLocation, setUserLocation] = useState('Rajkot, Gujarat') 
  const t = translations[language];

  useEffect(() => {
    fetch(`${API_URL}/api/stores`).then(res => res.json()).then(data => setStores(data)).catch(err => console.error(err));
  }, [])

  const handleInquire = (item, store) => {
    setSelectedStore(null); 
    setActiveChatUser({ name: store.name, icon: '🏪', status: 'Online', initialMsg: `Hi, I want to inquire about "${item.name}" (₹${item.price})` });
    setActiveTab('chat'); 
  };

  if (selectedStore) return <StoreProfileScreen store={selectedStore} onBack={() => setSelectedStore(null)} onInquire={handleInquire} />

  return (
    <div className="dashboard">
      {activeTab === 'home' && <HomeTab stores={stores} onVisit={setSelectedStore} userLocation={userLocation} setUserLocation={setUserLocation} />}
      {activeTab === 'feed' && <FeedTab language={language} />}
      {activeTab === 'chat' && !activeChatUser && <ChatListTab onOpenChat={setActiveChatUser} language={language} />}
      {activeTab === 'profile' && <UserProfileTab language={language} setLanguage={setLanguage} />} 
      {activeChatUser && <ChatThreadScreen user={activeChatUser} onClose={() => setActiveChatUser(null)} />}

      <div className="bottom-nav">
        <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>🏠<br/><span>{t.home}</span></div>
        <div className={`nav-item ${activeTab === 'feed' ? 'active' : ''}`} onClick={() => setActiveTab('feed')}>📰<br/><span>{t.feed}</span></div>
        <div className={`nav-item ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => {setActiveTab('chat'); setActiveChatUser(null);}}><div className="nav-icon-wrapper">💬<span className="nav-badge">1</span></div><span>{t.chat}</span></div>
        <div className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>👤<br/><span>{t.profile}</span></div>
      </div>
    </div>
  )
}

function HomeTab({ stores, onVisit, userLocation, setUserLocation }) {
  const [searchText, setSearchText] = useState('')
  const [activeCategory, setActiveCategory] = useState('All') 
  
  const [showLocModal, setShowLocModal] = useState(false);
  const [citySearch, setCitySearch] = useState('');

  const categories = [
    { id: 'All', icon: '🌐' }, { id: 'Grocery', icon: '🛍️' }, { id: 'Health', icon: '🏥' },
    { id: 'Food', icon: '🍲' }, { id: 'Real Estate', icon: '🏢' }, { id: 'Tutors', icon: '📚' }, { id: 'Services', icon: '🛠️' }
  ];

  const filteredStores = stores.filter(store => {
    const matchSearch = store.name.toLowerCase().includes(searchText.toLowerCase()) || store.type.toLowerCase().includes(searchText.toLowerCase());
    const matchCategory = activeCategory === 'All' || store.type.toLowerCase() === activeCategory.toLowerCase();
    return matchSearch && matchCategory;
  });

  const filteredCities = INDIA_CITIES.filter(city => city.toLowerCase().includes(citySearch.toLowerCase()));

  return (
    <>
      {showLocModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,128,128,0.95)', zIndex: 9999, display: 'flex', flexDirection: 'column', padding: '20px', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', marginTop: '20px' }}>
            <h2 style={{ margin: 0, color: 'white' }}>Select City</h2>
            <button onClick={() => setShowLocModal(false)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem' }}>✖</button>
          </div>
          <input type="text" className="input-box" placeholder="Type your city name..." value={citySearch} onChange={(e) => setCitySearch(e.target.value)} style={{ marginBottom: '15px' }} autoFocus />
          <div style={{ background: 'white', borderRadius: '12px', flex: 1, overflowY: 'auto', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
            {filteredCities.map(city => (
              <div key={city} onClick={() => { setUserLocation(city); setShowLocModal(false); setCitySearch(''); }} style={{ padding: '15px 20px', borderBottom: '1px solid #eee', cursor: 'pointer', fontSize: '1.1rem', color: '#333' }}>
                📍 {city}
              </div>
            ))}
            {filteredCities.length === 0 && <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>No cities found</div>}
          </div>
        </div>
      )}

      <div className="dash-header">
        <div className="location-bar">
          <span className="loc-text" onClick={() => setShowLocModal(true)} style={{cursor: 'pointer', padding: '5px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.2)'}}>
            📍 {userLocation.split(',')[0]} ▾
          </span>
          <UserButton />
        </div>
        <div className="search-bar-container"><input type="text" className="search-bar" placeholder="Search shops, flats, tutors..." value={searchText} onChange={(e) => setSearchText(e.target.value)} /></div>
      </div>
      <div className="dash-content">
        <div className="promo-banner"><h3>🔥 Hot Leads in {userLocation.split(',')[0]}</h3><p>Find the best local services!</p></div>
        
        <h3 className="section-title mt-20">Filter by Category</h3>
        <div style={{display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px', paddingTop: '5px'}}>
          {categories.map(cat => (
            <div key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '70px', padding: '10px 5px', borderRadius: '12px', background: activeCategory === cat.id ? '#008080' : 'white', color: activeCategory === cat.id ? 'white' : '#333', border: activeCategory === cat.id ? 'none' : '1px solid #ddd', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', cursor: 'pointer'}}>
              <div style={{fontSize: '1.5rem', marginBottom: '5px'}}>{cat.icon}</div><span style={{fontSize: '0.75rem', fontWeight: activeCategory === cat.id ? 'bold' : 'normal'}}>{cat.id}</span>
            </div>
          ))}
        </div>

        <div className="feed-header mt-15"><h3 className="section-title">{activeCategory === 'All' ? `Local Businesses in ${userLocation.split(',')[0]}` : `${activeCategory} Near Me`}</h3></div>
        
        {filteredStores.map(store => (
          <div className="store-card" key={store.id}>
            <div className="store-info"><h4>{store.name}</h4><p className="store-sub">{store.type} • {store.distance} away</p></div>
            <button className="btn-small" onClick={() => onVisit(store)}>View Profile</button>
          </div>
        ))}
        <div className="spacer-bottom"></div>
      </div>
    </>
  )
}

function StoreProfileScreen({ store, onBack, onInquire }) {
  const [shopItems, setShopItems] = useState([]);
  useEffect(() => { fetch(`${API_URL}/api/products`).then(res => res.json()).then(data => setShopItems(data)); }, []);
  return (
    <div className="dashboard seller-bg">
      <div className="dash-header" style={{borderRadius: 0, paddingBottom: '15px'}}><button className="back-btn" onClick={onBack}>⬅</button><h2 style={{margin:0, marginLeft:'15px', color:'white'}}>{store.name}</h2></div>
      <div className="dash-content">
        <h3 className="section-title mt-20">Listings / Services</h3>
        {shopItems.map(item => (
          <div className="clean-card" key={item._id || item.id}>
            <div className="card-left"><h4>{item.name}</h4><p className="price">₹{item.price}</p></div>
            <button className="btn-primary" onClick={() => onInquire(item, store)}>💬 Inquire</button>
          </div>
        ))}
      </div>
    </div>
  )
}

function FeedTab({ language }) {
  const t = translations[language];
  return (
    <>
      <div className="dash-header"><h2 className="brand-title" style={{color: 'white', margin: 0}}>{t.feed} / Updates</h2></div>
      <div className="dash-content feed-bg">
        <div className="post-card">
          <div className="post-header"><div className="post-avatar health-avatar">🏥</div><div className="post-meta"><h4>Dr. Khengar Pandya Clinic</h4><p>2 hours ago</p></div></div>
          <div className="post-body"><p>Free General Health Checkup camp this Sunday! Direct message us to book your slot.</p></div>
        </div>
      </div>
    </>
  )
}

function ChatListTab({ onOpenChat, language }) {
  const t = translations[language];
  return (
    <>
      <div className="dash-header"><h2 className="brand-title" style={{color: 'white', margin: 0}}>{t.chat} / Messages</h2></div>
      <div className="dash-content">
        <div className="chat-item unread" onClick={() => onOpenChat({name: 'Manoj Provisions', icon: '🏪', status: 'Online'})}>
          <div className="chat-avatar shop-avatar">🏪</div>
          <div className="chat-details"><h4 className="chat-name">Manoj Provisions</h4><p className="chat-msg">Ha bhai, tiffin chalu chhe atyare.</p></div>
          <div className="chat-meta"><span className="chat-time">New</span><span className="unread-dot">1</span></div>
        </div>
      </div>
    </>
  )
}

function ChatThreadScreen({ user, onClose }) {
  const [messages, setMessages] = useState(user.initialMsg ? [{ text: user.initialMsg, sender: 'me' }] : [{ text: "Ha bhai, boliye shu joiye chhe?", sender: 'them' }]);
  const [input, setInput] = useState('');
  const sendMessage = () => { if(!input) return; setMessages([...messages, { text: input, sender: 'me' }]); setInput(''); };

  return (
    <div className="chat-screen-overlay">
      <div className="chat-thread-header"><button className="back-btn" onClick={onClose}>⬅</button><div><h4>{user.name}</h4><p style={{fontSize:'12px', margin:0}}>{user.status}</p></div></div>
      <div className="chat-thread-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`msg-wrapper ${msg.sender === 'me' ? 'msg-sent' : 'msg-received'}`}><div className="msg-bubble">{msg.text}</div></div>
        ))}
      </div>
      <div className="chat-input-area">
        <input type="text" className="chat-input" placeholder="Type a message..." value={input} onChange={(e) => setInput(e.target.value)} />
        <button className="chat-send-btn" onClick={sendMessage}>➤</button>
      </div>
    </div>
  )
}

function UserProfileTab({ language, setLanguage }) {
  const t = translations[language];
  const [notificationsOn, setNotificationsOn] = useState(true);
  const { user } = useUser();
  const { signOut } = useClerk();

  const toggleLanguage = () => {
    const langs = ['English', 'ગુજરાતી', 'हिन्दी'];
    setLanguage(langs[(langs.indexOf(language) + 1) % langs.length]);
  };

  return (
    <>
      <div className="dash-header"><h2 className="brand-title" style={{color: 'white', margin: 0}}>{t.profile}</h2></div>
      <div className="dash-content">
        <div className="clean-card mt-20" style={{textAlign: 'center', background: 'linear-gradient(to bottom, #e8f4f4, #ffffff)', border: 'none'}}>
          <div style={{margin: '10px 0', display: 'flex', justifyContent: 'center'}}>
             <UserButton appearance={{ elements: { userButtonAvatarBox: { width: 80, height: 80 } } }} />
          </div>
          <h2 style={{margin: '0', color: '#008080'}}>{user?.fullName || 'VyaparSetu User'}</h2>
          <p style={{color: '#666', marginTop: '5px'}}>{user?.primaryEmailAddress?.emailAddress}</p>
        </div>
        <h3 className="section-title mt-20">App Settings</h3>
        <div className="clean-card" style={{display: 'flex', justifyContent: 'space-between', cursor: 'pointer', background: '#fcfcfc'}} onClick={toggleLanguage}>
          <h4 style={{margin: 0}}>🌍 Language</h4><span style={{color: '#008080', fontWeight: 'bold'}}>{language}</span>
        </div>
        <div className="clean-card" style={{display: 'flex', justifyContent: 'space-between', cursor: 'pointer', background: '#fcfcfc', marginTop: '10px'}} onClick={() => setNotificationsOn(!notificationsOn)}>
          <h4 style={{margin: 0}}>🔔 Notifications</h4><span style={{color: notificationsOn ? '#008080' : '#888', fontWeight: 'bold'}}>{notificationsOn ? 'ON' : 'OFF'}</span>
        </div>
        <div className="clean-card mt-20" onClick={() => signOut(() => window.location.reload())} style={{border: '1px solid #ff4444', background: '#ffeeee', cursor: 'pointer'}}>
          <h4 style={{color: '#ff4444', textAlign: 'center', margin: 0}}>{t.logout}</h4>
        </div>
        <div className="spacer-bottom"></div>
      </div>
    </>
  )
}

function SellerDashboard({ language, setLanguage }) {
  const [activeTab, setActiveTab] = useState('dash') 
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const t = translations[language];
  
  // 🔐 User Data from Clerk
  const { user } = useUser();
  const { signOut } = useClerk();

  // 📥 Fetch ONLY this seller's products using their Clerk ID
  useEffect(() => {
    if (user) {
      fetch(`${API_URL}/api/products/seller/${user.id}`)
        .then(res => res.json())
        .then(data => setProducts(data))
        .catch(err => console.error(err));
    }
  }, [user]);

  // 📤 Add Product with Clerk ID attached
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return alert("Item Name and Price nakhva jaruri chhe!");
    if (!user) return alert("User Load thai rahyo chhe, 1 second wait karo...");

    fetch(`${API_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: newItemName, 
        price: Number(newItemPrice),
        sellerId: user.id,                      // ⬅️ Clerk ID
        sellerName: user.fullName || "Seller"   // ⬅️ Clerk Name
      })
    })
    .then(res => res.json())
    .then(data => {
      setProducts([...products, data.product]);
      setNewItemName(''); setNewItemPrice(''); setShowAddForm(false);
      alert("✅ Listing added successfully to Cloud!");
    });
  };

  return (
    <div className="dashboard seller-bg">
      <div className="seller-top-bar"><h2 className="brand-title">VyaparSetu <span className="badge">Business</span></h2><UserButton /></div>
      <div className="dash-content">
        
        {activeTab === 'dash' && (
          <>
            <div className="stats-container"><div className="stat-box"><h4>850</h4><p>Profile Views</p></div><div className="stat-box highlight"><h4>42</h4><p>New Leads</p></div></div>
            <div className="clean-card mt-20" style={{background: '#f2fcfc', border: '1px dashed #008080'}}><h4 style={{color:'#008080'}}>Pending Chat Leads (2)</h4><p style={{fontSize:'0.9rem', color:'#555', marginTop:'5px'}}>2 customers are waiting for your reply.</p></div>
          </>
        )}

        {activeTab === 'catalog' && (
          <>
            <div className="feed-header"><h3 className="section-title">My Portfolio Listings</h3></div>
            {showAddForm ? (
              <div className="clean-card mb-20" style={{background: '#ffffff', border: '2px solid #008080'}}>
                <h4 style={{color: '#008080', marginBottom: '10px'}}>Add New Listing / Service</h4>
                <input type="text" placeholder="e.g. 2BHK Flat / 10th Bio Coaching" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} className="input-box" style={{marginBottom: '10px'}} />
                <input type="number" placeholder="Asking Price / Fees (₹)" value={newItemPrice} onChange={(e) => setNewItemPrice(e.target.value)} className="input-box" />
                <div style={{display: 'flex', gap: '10px', marginTop: '15px'}}><button className="btn-primary" onClick={handleAddItem} style={{flex: 1}}>Publish</button><button className="btn-small" onClick={() => setShowAddForm(false)}>Cancel</button></div>
              </div>
            ) : (<button className="btn-primary mb-20" onClick={() => setShowAddForm(true)}>➕ Add New Listing</button>)}
            {products.map(product => (<div className="clean-card" key={product._id || product.id}><div className="card-left"><h4>{product.name}</h4><p className="price">₹{product.price}</p></div></div>))}
          </>
        )}

        {activeTab === 'chat' && (
          <>
            <div className="feed-header"><h3 className="section-title">Lead Messages</h3></div>
            <div className="chat-item unread"><div className="chat-avatar" style={{background:'#e8f4fd'}}>👤</div><div className="chat-details"><h4 className="chat-name">Rahul Sharma</h4><p className="chat-msg">Hi, I want to inquire about the flat...</p></div><div className="chat-meta"><span className="chat-time">New</span><span className="unread-dot">1</span></div></div>
          </>
        )}

        {activeTab === 'profile' && (
          <>
            <div className="feed-header"><h3 className="section-title">Business Profile</h3></div>
            <div className="clean-card mt-10" style={{textAlign: 'center', background: '#f9fafa', border: '2px solid #008080'}}>
              <div style={{margin: '10px 0', display: 'flex', justifyContent: 'center'}}>
                 <UserButton appearance={{ elements: { userButtonAvatarBox: { width: 80, height: 80 } } }} />
              </div>
              <h2 style={{margin: '0', color: '#008080'}}>{user?.fullName || 'Business User'} <span style={{fontSize:'1rem'}}>✅</span></h2>
              <p style={{color: '#666', marginTop: '5px'}}>{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
            <h3 className="section-title mt-20">Account Settings</h3>
            <div className="clean-card" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}><div><h4 style={{margin: 0}}>🚀 Subscription</h4><p style={{margin: 0, fontSize: '0.8rem', color: '#888'}}>Free Plan</p></div><button className="btn-small" style={{background: '#ff9800', color: 'white', border: 'none'}}>Upgrade</button></div>
            <div className="clean-card mt-20" onClick={() => signOut(() => window.location.reload())} style={{border: '1px solid #ff4444', background: '#ffeeee', cursor: 'pointer'}}>
              <h4 style={{color: '#ff4444', textAlign: 'center', margin: 0}}>{t.logout}</h4>
            </div>
          </>
        )}
        <div className="spacer-bottom"></div>
      </div>

      <div className="bottom-nav">
        <div className={`nav-item ${activeTab === 'dash' ? 'active' : ''}`} onClick={() => setActiveTab('dash')}>📊<br/><span>{t.insights}</span></div>
        <div className={`nav-item ${activeTab === 'catalog' ? 'active' : ''}`} onClick={() => setActiveTab('catalog')}>📋<br/><span>{t.listings}</span></div>
        <div className={`nav-item ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>💬<br/><span>{t.leads}</span></div>
        <div className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>⚙️<br/><span>{t.profile}</span></div>
      </div>
    </div>
  )
}

export default App
