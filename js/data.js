/* ================================================
   FoodBridge – Mock Data Layer
   ================================================ */

const FBData = (() => {
  // Keys
  const KEYS = {
    users: 'fb_users',
    donations: 'fb_donations',
    deliveries: 'fb_deliveries',
    notifications: 'fb_notifications',
    currentUser: 'fb_current_user'
  };

  // ---------- Seed Data ----------
  const seedUsers = [
    { id: 'u1', name: 'Anand Kumar', email: 'anand@restaurant.com', password: '1234', role: 'donor', phone: '9876543210', location: 'Mumbai Central', donorType: 'Restaurant' },
    { id: 'u2', name: 'Priya Sharma', email: 'priya@caterer.com', password: '1234', role: 'donor', phone: '9876543211', location: 'Bandra West', donorType: 'Event Handler' },
    { id: 'u3', name: 'Green Plate Hotel', email: 'greenplate@hotel.com', password: '1234', role: 'donor', phone: '9876543212', location: 'Juhu Beach', donorType: 'Restaurant' },
    { id: 'u4', name: 'Hope Foundation', email: 'hope@ngo.org', password: '1234', role: 'ngo', phone: '9876543220', location: 'Dadar', capacity: 200, contact: 'Ravi Mehta' },
    { id: 'u5', name: 'Feeding India', email: 'feed@ngo.org', password: '1234', role: 'ngo', phone: '9876543221', location: 'Andheri East', capacity: 350, contact: 'Sneha Patel' },
    { id: 'u6', name: 'Shelter Home Trust', email: 'shelter@ngo.org', password: '1234', role: 'ngo', phone: '9876543222', location: 'Kurla West', capacity: 150, contact: 'Arun Joshi' },
    { id: 'u7', name: 'Rahul Verma', email: 'rahul@volunteer.com', password: '1234', role: 'volunteer', phone: '9876543230', location: 'Sion', availability: true },
    { id: 'u8', name: 'Meena Devi', email: 'meena@volunteer.com', password: '1234', role: 'volunteer', phone: '9876543231', location: 'Matunga', availability: true },
    { id: 'u9', name: 'Admin User', email: 'admin@foodbridge.com', password: 'admin', role: 'admin', phone: '9876543200', location: 'HQ' }
  ];

  const seedDonations = [
    { id: 'd1', donorId: 'u1', donorName: 'Anand Kumar', foodType: 'Cooked Meals (Rice & Curry)', quantity: 50, pickupTime: '2026-03-14T19:00', location: 'Mumbai Central', status: 'delivered', createdAt: '2026-03-12T14:00', ngoId: 'u4', volunteerId: 'u7', image: null },
    { id: 'd2', donorId: 'u2', donorName: 'Priya Sharma', foodType: 'Sandwiches & Snacks', quantity: 80, pickupTime: '2026-03-13T20:00', location: 'Bandra West', status: 'delivered', createdAt: '2026-03-13T16:00', ngoId: 'u5', volunteerId: 'u8', image: null },
    { id: 'd3', donorId: 'u3', donorName: 'Green Plate Hotel', foodType: 'Biryani & Breads', quantity: 120, pickupTime: '2026-03-14T21:00', location: 'Juhu Beach', status: 'picked', createdAt: '2026-03-14T09:00', ngoId: 'u5', volunteerId: 'u7', image: null },
    { id: 'd4', donorId: 'u1', donorName: 'Anand Kumar', foodType: 'Dal & Rice', quantity: 35, pickupTime: '2026-03-14T22:00', location: 'Mumbai Central', status: 'accepted', createdAt: '2026-03-14T10:00', ngoId: 'u4', volunteerId: null, image: null },
    { id: 'd5', donorId: 'u2', donorName: 'Priya Sharma', foodType: 'Cakes & Pastries', quantity: 40, pickupTime: '2026-03-15T10:00', location: 'Bandra West', status: 'pending', createdAt: '2026-03-14T10:30', ngoId: null, volunteerId: null, image: null },
  ];

  const seedDeliveries = [
    { id: 'del1', foodId: 'd1', volunteerId: 'u7', volunteerName: 'Rahul Verma', pickupTime: '2026-03-12T19:00', deliveryTime: '2026-03-12T19:45', status: 'completed', ngoName: 'Hope Foundation' },
    { id: 'del2', foodId: 'd2', volunteerId: 'u8', volunteerName: 'Meena Devi', pickupTime: '2026-03-13T20:00', deliveryTime: '2026-03-13T20:35', status: 'completed', ngoName: 'Feeding India' },
    { id: 'del3', foodId: 'd3', volunteerId: 'u7', volunteerName: 'Rahul Verma', pickupTime: '2026-03-14T21:00', deliveryTime: null, status: 'in-transit', ngoName: 'Feeding India' },
  ];

  const seedNotifications = [
    { id: 'n1', userId: 'u4', message: 'New donation: 50 Cooked Meals from Anand Kumar', status: 'read', time: '2026-03-12T14:01', type: 'donation' },
    { id: 'n2', userId: 'u7', message: 'Pickup request: Cooked Meals from Mumbai Central', status: 'read', time: '2026-03-12T14:02', type: 'pickup' },
    { id: 'n3', userId: 'u5', message: 'New donation: 80 Sandwiches from Priya Sharma', status: 'read', time: '2026-03-13T16:01', type: 'donation' },
    { id: 'n4', userId: 'u5', message: 'New donation: 120 Biryani from Green Plate Hotel', status: 'unread', time: '2026-03-14T09:01', type: 'donation' },
    { id: 'n5', userId: 'u7', message: 'Pickup request: Biryani from Juhu Beach at 9 PM', status: 'unread', time: '2026-03-14T09:02', type: 'pickup' },
    { id: 'n6', userId: 'u4', message: 'New donation: 35 Dal & Rice from Anand Kumar', status: 'unread', time: '2026-03-14T10:01', type: 'donation' },
    { id: 'n7', userId: 'u1', message: 'Hope Foundation accepted your donation of Dal & Rice', status: 'unread', time: '2026-03-14T10:05', type: 'accepted' },
  ];

  // ---------- Init ----------
  function init() {
    if (!localStorage.getItem(KEYS.users)) {
      localStorage.setItem(KEYS.users, JSON.stringify(seedUsers));
    }
    if (!localStorage.getItem(KEYS.donations)) {
      localStorage.setItem(KEYS.donations, JSON.stringify(seedDonations));
    }
    if (!localStorage.getItem(KEYS.deliveries)) {
      localStorage.setItem(KEYS.deliveries, JSON.stringify(seedDeliveries));
    }
    if (!localStorage.getItem(KEYS.notifications)) {
      localStorage.setItem(KEYS.notifications, JSON.stringify(seedNotifications));
    }
  }

  // ---------- Generic CRUD ----------
  function getAll(key) {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }
  function saveAll(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }
  function getById(key, id) {
    return getAll(key).find(item => item.id === id) || null;
  }
  function add(key, item) {
    const all = getAll(key);
    all.push(item);
    saveAll(key, all);
    return item;
  }
  function update(key, id, updates) {
    const all = getAll(key);
    const idx = all.findIndex(item => item.id === id);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...updates };
      saveAll(key, all);
      return all[idx];
    }
    return null;
  }
  function remove(key, id) {
    const all = getAll(key).filter(item => item.id !== id);
    saveAll(key, all);
  }

  function genId(prefix) {
    return prefix + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
  }

  // ---------- Auth ----------
  async function login(email, password) {
    // Try Supabase Auth first (with 3s timeout so demo login is snappy)
    if (supabase) {
      try {
        const supabaseLogin = supabase.auth.signInWithPassword({ email, password });
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000));
        
        const { data, error } = await Promise.race([supabaseLogin, timeout]);
        if (!error && data && data.user) {
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
          const user = { ...data.user, ...profile };
          localStorage.setItem(KEYS.currentUser, JSON.stringify(user));
          return user;
        }
      } catch (e) {
        console.warn('Supabase auth skipped, using demo login:', e.message);
      }
    }

    // Fallback: check local seed data for demo accounts
    const users = getAll(KEYS.users);
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      localStorage.setItem(KEYS.currentUser, JSON.stringify(found));
      return found;
    }

    return null;
  }

  async function register(userData) {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password
    });

    if (error) return { error: error.message };

    // Create profile
    const { error: profileError } = await supabase.from('profiles').insert([{
      id: data.user.id,
      name: userData.name,
      role: userData.role,
      donor_type: userData.donorType,
      phone: userData.phone,
      location: userData.location
    }]);

    if (profileError) return { error: profileError.message };

    const newUser = { ...data.user, name: userData.name, role: userData.role };
    localStorage.setItem(KEYS.currentUser, JSON.stringify(newUser));
    return newUser;
  }

  function getCurrentUser() {
    const data = localStorage.getItem(KEYS.currentUser);
    return data ? JSON.parse(data) : null;
  }

  function logout() {
    localStorage.removeItem(KEYS.currentUser);
  }

  // ---------- Demo mode detection ----------
  function isDemoMode() {
    const user = getCurrentUser();
    if (!user) return true;
    // Demo users have simple IDs like 'u1', 'u2', etc.
    return typeof user.id === 'string' && /^u\d+$/.test(user.id);
  }

  // ---------- Donations ----------
  async function getDonations() {
    if (!isDemoMode()) {
      try {
        const { data, error } = await supabase.from('donations').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch (e) { /* fallback */ }
    }
    // Fallback to localStorage (map camelCase fields to snake_case for consistency)
    return getAll(KEYS.donations).map(d => ({
      ...d, donor_id: d.donorId, donor_name: d.donorName, food_type: d.foodType,
      pickup_time: d.pickupTime, ngo_id: d.ngoId, volunteer_id: d.volunteerId,
      created_at: d.createdAt
    }));
  }
  async function getDonationsByDonor(donorId) {
    if (!isDemoMode()) {
      try {
        const { data, error } = await supabase.from('donations').select('*').eq('donor_id', donorId).order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch (e) { /* fallback */ }
    }
    return (await getDonations()).filter(d => d.donor_id === donorId || d.donorId === donorId);
  }
  async function getDonationsByNGO(ngoId) {
    if (!isDemoMode()) {
      try {
        const { data, error } = await supabase.from('donations').select('*').eq('ngo_id', ngoId).order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch (e) { /* fallback */ }
    }
    return (await getDonations()).filter(d => d.ngo_id === ngoId || d.ngoId === ngoId);
  }
  async function getPendingDonations() {
    if (!isDemoMode()) {
      try {
        const { data, error } = await supabase.from('donations').select('*').eq('status', 'pending').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch (e) { /* fallback */ }
    }
    return (await getDonations()).filter(d => d.status === 'pending');
  }

  async function addDonation(donationData) {
    const donation = {
      donor_id: donationData.donorId,
      donor_name: donationData.donorName,
      food_type: donationData.foodType,
      quantity: donationData.quantity,
      pickup_time: donationData.pickupTime,
      location: donationData.location,
      image: donationData.image,
      status: 'pending'
    };
    try {
      const { data: result, error } = await supabase.from('donations').insert([donation]).select().single();
      if (!error && result) return result;
    } catch (e) { /* fallback */ }
    // Fallback: save to localStorage
    const localDonation = { id: genId('d'), ...donationData, ...donation, createdAt: new Date().toISOString(), created_at: new Date().toISOString() };
    return add(KEYS.donations, localDonation);
  }

  async function updateDonation(id, updates) {
    try {
      const { data, error } = await supabase.from('donations').update(updates).eq('id', id);
      if (!error) return data;
    } catch (e) { /* fallback */ }
    return update(KEYS.donations, id, updates);
  }

  // ---------- Deliveries ----------
  function getDeliveries() { return getAll(KEYS.deliveries); }
  function getDeliveriesByVolunteer(volId) { return getAll(KEYS.deliveries).filter(d => d.volunteerId === volId); }
  function addDelivery(data) {
    const delivery = { id: genId('del'), ...data, status: 'in-transit' };
    return add(KEYS.deliveries, delivery);
  }
  function updateDelivery(id, updates) { return update(KEYS.deliveries, id, updates); }

  // ---------- Notifications ----------
  async function getNotifications(userId) {
    try {
      const { data, error } = await supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (e) { /* fallback */ }
    return getAll(KEYS.notifications).filter(n => n.userId === userId);
  }
  async function getUnreadCount(userId) {
    try {
      const { count, error } = await supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'unread');
      if (!error) return count || 0;
    } catch (e) { /* fallback */ }
    return getAll(KEYS.notifications).filter(n => n.userId === userId && n.status === 'unread').length;
  }
  async function addNotification(userId, message, type) {
    try {
      const { data, error } = await supabase.from('notifications').insert([{ user_id: userId, message, type, status: 'unread' }]);
      if (!error) return data;
    } catch (e) { /* fallback */ }
    return add(KEYS.notifications, { id: genId('n'), userId, message, type, status: 'unread', time: new Date().toISOString() });
  }
  async function markNotificationRead(id) {
    try { await supabase.from('notifications').update({ status: 'read' }).eq('id', id); } catch (e) { /* fallback */ }
    update(KEYS.notifications, id, { status: 'read' });
  }
  async function markAllRead(userId) {
    try { await supabase.from('notifications').update({ status: 'read' }).eq('user_id', userId); } catch (e) { /* fallback */ }
    const all = getAll(KEYS.notifications).map(n => n.userId === userId ? { ...n, status: 'read' } : n);
    saveAll(KEYS.notifications, all);
  }

  // ---------- Users ----------
  function getUsers() { return getAll(KEYS.users); }
  function getUsersByRole(role) { return getAll(KEYS.users).filter(u => u.role === role); }
  function getNGOs() { return getUsersByRole('ngo'); }
  function getVolunteers() { return getUsersByRole('volunteer'); }
  function getDonors() { return getUsersByRole('donor'); }

  // ---------- Stats ----------
  async function getStats() {
    const donations = await getDonations();
    const delivered = donations.filter(d => d.status === 'delivered');
    const totalMeals = delivered.reduce((sum, d) => sum + (d.quantity || 0), 0);
    return {
      totalDonations: donations.length,
      mealsDistributed: totalMeals,
      activeDonors: getDonors().length,
      activeNGOs: getNGOs().length,
      activeVolunteers: getVolunteers().length,
      pendingDonations: donations.filter(d => d.status === 'pending').length,
      inTransit: donations.filter(d => d.status === 'picked').length,
      wasteReduced: Math.round(totalMeals * 0.45), // kg estimate
      co2Saved: Math.round(totalMeals * 2.5) // kg CO2 estimate
    };
  }

  // ---------- Reset ----------
  function resetData() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    init();
  }

  return {
    init, login, register, getCurrentUser, logout,
    getDonations, getDonationsByDonor, getDonationsByNGO, getPendingDonations,
    addDonation, updateDonation,
    getDeliveries, getDeliveriesByVolunteer, addDelivery, updateDelivery,
    getNotifications, getUnreadCount, addNotification, markNotificationRead, markAllRead,
    getUsers, getUsersByRole, getNGOs, getVolunteers, getDonors, getUser: (id) => getById(KEYS.users, id),
    getStats, resetData, genId, KEYS
  };
})();
