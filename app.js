// Essenszeit PWA - Main Application (IIFE)
(function () {
  'use strict';

  // ============================================================
  // Constants & Configuration
  // ============================================================
  const STORAGE_MEALS = 'essenszeit-meals';
  const STORAGE_SELECTION = 'essenszeit-selection';
  const STORAGE_CHECKLIST = 'essenszeit-checklist';

  // Supabase client (set up in index.html)
  var sb = window.supabaseClient || null;

  const UNITS = ['g', 'kg', 'ml', 'l', 'Stk', 'EL', 'TL', 'Bund', 'Dose', 'Scheibe', 'Prise'];

  const CATEGORIES = [
    'Obst & Gem\u00fcse',
    'Milchprodukte',
    'Fleisch & Fisch',
    'Brot & Backwaren',
    'Pantry',
    'Gew\u00fcrze',
    'Sonstiges'
  ];

  const CATEGORY_ORDER = {};
  CATEGORIES.forEach(function (c, i) { CATEGORY_ORDER[c] = i; });

  // ============================================================
  // Seed Data - 10 example meals
  // ============================================================
  function createSeedMeals() {
    return [
      {
        id: uid(), name: 'Spaghetti Bolognese', image: null, tags: ['Klassiker', 'Pasta'], defaultServings: 2, isFavorite: true,
        ingredients: [
          { id: uid(), name: 'Spaghetti', amount: 250, unit: 'g', category: 'Pantry' },
          { id: uid(), name: 'Hackfleisch', amount: 250, unit: 'g', category: 'Fleisch & Fisch' },
          { id: uid(), name: 'Zwiebel', amount: 1, unit: 'Stk', category: 'Obst & Gem\u00fcse' },
          { id: uid(), name: 'Knoblauch', amount: 2, unit: 'Stk', category: 'Obst & Gem\u00fcse' },
          { id: uid(), name: 'Passierte Tomaten', amount: 400, unit: 'ml', category: 'Pantry' },
          { id: uid(), name: 'Tomatenmark', amount: 2, unit: 'EL', category: 'Pantry' },
          { id: uid(), name: 'Oliven\u00f6l', amount: 2, unit: 'EL', category: 'Pantry' },
          { id: uid(), name: 'Parmesan', amount: 30, unit: 'g', category: 'Milchprodukte' },
          { id: uid(), name: 'Salz', amount: 1, unit: 'Prise', category: 'Gew\u00fcrze' },
          { id: uid(), name: 'Pfeffer', amount: 1, unit: 'Prise', category: 'Gew\u00fcrze' }
        ]
      },
      {
        id: uid(), name: 'Caesar Salad', image: null, tags: ['Salat', 'Schnell'], defaultServings: 2, isFavorite: false,
        ingredients: [
          { id: uid(), name: 'Romana-Salat', amount: 1, unit: 'Stk', category: 'Obst & Gem\u00fcse' },
          { id: uid(), name: 'H\u00e4hnchenbrust', amount: 200, unit: 'g', category: 'Fleisch & Fisch' },
          { id: uid(), name: 'Parmesan', amount: 40, unit: 'g', category: 'Milchprodukte' },
          { id: uid(), name: 'Croutons', amount: 50, unit: 'g', category: 'Brot & Backwaren' },
          { id: uid(), name: 'Knoblauch', amount: 1, unit: 'Stk', category: 'Obst & Gem\u00fcse' },
          { id: uid(), name: 'Zitronensaft', amount: 1, unit: 'EL', category: 'Obst & Gem\u00fcse' },
          { id: uid(), name: 'Oliven\u00f6l', amount: 3, unit: 'EL', category: 'Pantry' },
          { id: uid(), name: 'Worcestersauce', amount: 1, unit: 'TL', category: 'Gew\u00fcrze' }
        ]
      },
      {
        id: uid(), name: 'Chicken Curry', image: null, tags: ['Asiatisch', 'W\u00fcrzig'], defaultServings: 3, isFavorite: true,
        ingredients: [
          { id: uid(), name: 'H\u00e4hnchenbrust', amount: 400, unit: 'g', category: 'Fleisch & Fisch' },
          { id: uid(), name: 'Kokosmilch', amount: 400, unit: 'ml', category: 'Pantry' },
          { id: uid(), name: 'Currypaste', amount: 2, unit: 'EL', category: 'Gew\u00fcrze' },
          { id: uid(), name: 'Zwiebel', amount: 1, unit: 'Stk', category: 'Obst & Gem\u00fcse' },
          { id: uid(), name: 'Paprika', amount: 1, unit: 'Stk', category: 'Obst & Gem\u00fcse' },
          { id: uid(), name: 'Basmatireis', amount: 250, unit: 'g', category: 'Pantry' },
          { id: uid(), name: 'Ingwer', amount: 1, unit: 'EL', category: 'Gew\u00fcrze' },
          { id: uid(), name: 'Knoblauch', amount: 2, unit: 'Stk', category: 'Obst & Gem\u00fcse' },
          { id: uid(), name: 'Koriander', amount: 1, unit: 'Bund', category: 'Obst & Gem\u00fcse' }
        ]
      },
      {
        id: uid(), name: 'Gem\u00fcsepfanne', image: null, tags: ['Veggie', 'Schnell'], defaultServings: 2, isFavorite: false,
        ingredients: [
          { id: uid(), name: 'Zucchini', amount: 1, unit: 'Stk', category: 'Obst & Gem\u00fcse' },
          { id: uid(), name: 'Paprika', amount: 2, unit: 'Stk', category: 'Obst & Gem\u00fcse' },
          { id: uid(), name: 'Champignons', amount: 200, unit: 'g', category: 'Obst & Gem\u00fcse' },
          { id: uid(), name: 'Zwiebel', amount: 1, unit: 'Stk', category: 'Obst & Gem\u00fcse' },
          { id: uid(), name: 'Knoblauch', amount: 2, unit: 'Stk', category: 'Obst & Gem\u00fcse' },
          { id: uid(), name: 'Sojasauce', amount: 2, unit: 'EL', category: 'Gew\u00fcrze' },
          { id: uid(), name: 'Oliven\u00f6l', amount: 2, unit: 'EL', category: 'Pantry' },
          { id: uid(), name: 'Reis', amount: 200, unit: 'g', category: 'Pantry' }
        ]
      },
      {
        id: uid(), name: 'Pancakes', image: null, tags: ['Fr\u00fchst\u00fcck', 'S\u00fc\u00df'], defaultServings: 2, isFavorite: true,
        ingredients: [
          { id: uid(), name: 'Mehl', amount: 200, unit: 'g', category: 'Pantry' },
          { id: uid(), name: 'Milch', amount: 250, unit: 'ml', category: 'Milchprodukte' },
          { id: uid(), name: 'Ei', amount: 2, unit: 'Stk', category: 'Milchprodukte' },
          { id: uid(), name: 'Zucker', amount: 2, unit: 'EL', category: 'Pantry' },
          { id: uid(), name: 'Backpulver', amount: 1, unit: 'TL', category: 'Pantry' },
          { id: uid(), name: 'Butter', amount: 30, unit: 'g', category: 'Milchprodukte' },
          { id: uid(), name: 'Ahornsirup', amount: 3, unit: 'EL', category: 'Pantry' }
        ]
      },
      {
        id: uid(), name: 'Kartoffelsuppe', image: null, tags: ['Suppe', 'Deutsch'], defaultServings: 4, isFavorite: false,
        ingredients: [
          { id: uid(), name: 'Kartoffeln', amount: 600, unit: 'g', category: 'Obst & Gem\u00fcse' },
          { id: uid(), name: 'Lauch', amount: 1, unit: 'Stk', category: 'Obst & Gem\u00fcse' },
          { id: uid(), name: 'Zwiebel', amount: 1, unit: 'Stk', category: 'Obst & Gem\u00fcse' },
          { id: uid(), name: 'Gem\u00fcsebr\u00fche', amount: 800, unit: 'ml', category: 'Pantry' },
          { id: uid(), name: 'Sahne', amount: 100, unit: 'ml', category: 'Milchprodukte' },
          { id: uid(), name: 'Muskatnuss', amount: 1, unit: 'Prise', category: 'Gew\u00fcrze' },
          { id: uid(), name: 'Butter', amount: 20, unit: 'g', category: 'Milchprodukte' },
          { id: uid(), name: 'W\u00fcrstchen', amount: 4, unit: 'Stk', category: 'Fleisch & Fisch' }
        ]
      },
      {
        id: uid(), name: 'Thai Basil Stir-Fry', image: null, tags: ['Asiatisch', 'Scharf'], defaultServings: 2, isFavorite: false,
        ingredients: [
          { id: uid(), name: 'H\u00e4hnchenbrust', amount: 300, unit: 'g', category: 'Fleisch & Fisch' },
          { id: uid(), name: 'Thai-Basilikum', amount: 1, unit: 'Bund', category: 'Obst & Gem\u00fcse' },
          { id: uid(), name: 'Chili', amount: 2, unit: 'Stk', category: 'Obst & Gem\u00fcse' },
          { id: uid(), name: 'Knoblauch', amount: 3, unit: 'Stk', category: 'Obst & Gem\u00fcse' },
          { id: uid(), name: 'Sojasauce', amount: 2, unit: 'EL', category: 'Gew\u00fcrze' },
          { id: uid(), name: 'Austernso\u00dfe', amount: 1, unit: 'EL', category: 'Gew\u00fcrze' },
          { id: uid(), name: 'Zucker', amount: 1, unit: 'TL', category: 'Pantry' },
          { id: uid(), name: 'Reis', amount: 200, unit: 'g', category: 'Pantry' },
          { id: uid(), name: 'Pflanzen\u00f6l', amount: 2, unit: 'EL', category: 'Pantry' }
        ]
      },
      {
        id: uid(), name: 'Griechischer Salat', image: null, tags: ['Salat', 'Veggie'], defaultServings: 2, isFavorite: false,
        ingredients: [
          { id: uid(), name: 'Tomate', amount: 3, unit: 'Stk', category: 'Obst & Gem\u00fcse' },
          { id: uid(), name: 'Gurke', amount: 1, unit: 'Stk', category: 'Obst & Gem\u00fcse' },
          { id: uid(), name: 'Rote Zwiebel', amount: 1, unit: 'Stk', category: 'Obst & Gem\u00fcse' },
          { id: uid(), name: 'Feta', amount: 150, unit: 'g', category: 'Milchprodukte' },
          { id: uid(), name: 'Oliven', amount: 80, unit: 'g', category: 'Pantry' },
          { id: uid(), name: 'Oliven\u00f6l', amount: 3, unit: 'EL', category: 'Pantry' },
          { id: uid(), name: 'Oregano', amount: 1, unit: 'TL', category: 'Gew\u00fcrze' },
          { id: uid(), name: 'Zitronensaft', amount: 1, unit: 'EL', category: 'Obst & Gem\u00fcse' }
        ]
      },
      {
        id: uid(), name: 'Lachs mit Reis', image: null, tags: ['Fisch', 'Gesund'], defaultServings: 2, isFavorite: false,
        ingredients: [
          { id: uid(), name: 'Lachsfilet', amount: 300, unit: 'g', category: 'Fleisch & Fisch' },
          { id: uid(), name: 'Reis', amount: 200, unit: 'g', category: 'Pantry' },
          { id: uid(), name: 'Brokkoli', amount: 200, unit: 'g', category: 'Obst & Gem\u00fcse' },
          { id: uid(), name: 'Zitrone', amount: 1, unit: 'Stk', category: 'Obst & Gem\u00fcse' },
          { id: uid(), name: 'Oliven\u00f6l', amount: 1, unit: 'EL', category: 'Pantry' },
          { id: uid(), name: 'Dill', amount: 1, unit: 'Bund', category: 'Obst & Gem\u00fcse' },
          { id: uid(), name: 'Salz', amount: 1, unit: 'Prise', category: 'Gew\u00fcrze' },
          { id: uid(), name: 'Pfeffer', amount: 1, unit: 'Prise', category: 'Gew\u00fcrze' }
        ]
      },
      {
        id: uid(), name: 'Flammkuchen', image: null, tags: ['Deutsch', 'Klassiker'], defaultServings: 2, isFavorite: true,
        ingredients: [
          { id: uid(), name: 'Mehl', amount: 250, unit: 'g', category: 'Pantry' },
          { id: uid(), name: 'Cr\u00e8me fra\u00eeche', amount: 200, unit: 'g', category: 'Milchprodukte' },
          { id: uid(), name: 'Speck', amount: 150, unit: 'g', category: 'Fleisch & Fisch' },
          { id: uid(), name: 'Zwiebel', amount: 2, unit: 'Stk', category: 'Obst & Gem\u00fcse' },
          { id: uid(), name: 'Oliven\u00f6l', amount: 2, unit: 'EL', category: 'Pantry' },
          { id: uid(), name: 'Salz', amount: 1, unit: 'Prise', category: 'Gew\u00fcrze' },
          { id: uid(), name: 'Pfeffer', amount: 1, unit: 'Prise', category: 'Gew\u00fcrze' }
        ]
      }
    ];
  }

  // ============================================================
  // Utility helpers
  // ============================================================
  function uid() {
    return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
  }

  function escapeHtml(str) {
    var el = document.createElement('span');
    el.textContent = str;
    return el.innerHTML;
  }

  function loadJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function saveJSON(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function roundAmount(n) {
    if (n === Math.floor(n)) return n;
    return Math.round(n * 100) / 100;
  }

  // ============================================================
  // State
  // ============================================================
  var state = {
    meals: [],
    selection: [],   // { mealId, servings }
    checklist: [],   // checked item keys
    activeTab: 'favorites',
    searchQuery: '',
    activeTag: null,
    editingMealId: null,
    userId: null     // Supabase user ID
  };

  // ============================================================
  // Supabase Helpers
  // ============================================================

  async function checkSession() {
    if (!sb) return null;
    try {
      var result = await sb.auth.getSession();
      if (result.data.session) return result.data.session.user.id;
      return null;
    } catch (e) {
      return null;
    }
  }

  function getCurrentUserEmail() {
    try {
      var key = Object.keys(localStorage).find(function (k) { return k.startsWith('sb-') && k.endsWith('-auth-token'); });
      if (!key) return null;
      var session = JSON.parse(localStorage.getItem(key));
      return session && session.user && session.user.email;
    } catch (e) {
      return null;
    }
  }

  async function loadMealsFromSupabase(userId) {
    var { data, error } = await sb
      .from('meals').select('*, ingredients(*)').eq('user_id', userId)
      .order('created_at', { ascending: true });
    if (error) { console.error('Meals laden fehlgeschlagen:', error); return null; }
    return data.map(function (m) {
      return {
        id: m.id, name: m.name, image: m.image, tags: m.tags || [],
        defaultServings: m.default_servings, isFavorite: !!m.is_favorite,
        ingredients: (m.ingredients || [])
          .sort(function (a, b) { return a.sort_order - b.sort_order; })
          .map(function (ing) {
            return { id: ing.id, name: ing.name, amount: Number(ing.amount), unit: ing.unit, category: ing.category };
          })
      };
    });
  }

  async function loadSelectionFromSupabase(userId) {
    var { data, error } = await sb
      .from('meal_selections').select('*').eq('user_id', userId);
    if (error) { console.error('Selection laden fehlgeschlagen:', error); return null; }
    return data.map(function (s) { return { mealId: s.meal_id, servings: s.servings }; });
  }

  async function loadChecklistFromSupabase(userId) {
    var { data, error } = await sb
      .from('checklist_items').select('item_key').eq('user_id', userId);
    if (error) { console.error('Checklist laden fehlgeschlagen:', error); return null; }
    return data.map(function (c) { return c.item_key; });
  }

  async function saveMealToSupabase(meal, userId) {
    var row = { user_id: userId, name: meal.name, image: meal.image,
      tags: meal.tags, default_servings: meal.defaultServings, is_favorite: !!meal.isFavorite };
    // Only send id if it's a valid UUID (skip client-generated ids for seed data)
    if (meal.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(meal.id)) {
      row.id = meal.id;
    }
    var { data, error } = await sb.from('meals').upsert(row).select().single();
    if (error) { console.error('Meal speichern fehlgeschlagen:', error); return; }

    await sb.from('ingredients').delete().eq('meal_id', data.id);
    if (meal.ingredients && meal.ingredients.length > 0) {
      var rows = meal.ingredients.map(function (ing, idx) {
        return { meal_id: data.id, name: ing.name, amount: ing.amount, unit: ing.unit, category: ing.category, sort_order: idx };
      });
      await sb.from('ingredients').insert(rows);
    }
  }

  async function deleteMealFromSupabase(mealId) {
    await sb.from('meals').delete().eq('id', mealId);
  }

  async function syncSelectionToSupabase(selection, userId) {
    await sb.from('meal_selections').delete().eq('user_id', userId);
    if (selection.length > 0) {
      var rows = selection.map(function (sel) {
        return { user_id: userId, meal_id: sel.mealId, servings: sel.servings };
      });
      await sb.from('meal_selections').insert(rows);
    }
  }

  async function syncChecklistToSupabase(checklist, userId) {
    await sb.from('checklist_items').delete().eq('user_id', userId);
    if (checklist.length > 0) {
      var rows = checklist.map(function (key) {
        return { user_id: userId, item_key: key };
      });
      await sb.from('checklist_items').insert(rows);
    }
  }

  function persistSelection() {
    saveJSON(STORAGE_SELECTION, state.selection);
    if (state.userId) syncSelectionToSupabase(state.selection, state.userId).catch(function (e) { console.error('Sync Selection fehlgeschlagen:', e); });
  }

  function persistChecklist() {
    saveJSON(STORAGE_CHECKLIST, state.checklist);
    if (state.userId) syncChecklistToSupabase(state.checklist, state.userId).catch(function (e) { console.error('Sync Checklist fehlgeschlagen:', e); });
  }

  // Load data from Supabase into state
  async function loadAppData(userId) {
    state.userId = userId;

    var remoteMeals = await loadMealsFromSupabase(userId);
    var remoteSelection = await loadSelectionFromSupabase(userId);
    var remoteChecklist = await loadChecklistFromSupabase(userId);

    if (remoteMeals && remoteMeals.length > 0) {
      state.meals = remoteMeals;
    } else {
      // New user — seed meals to Supabase
      state.meals = createSeedMeals();
      for (var i = 0; i < state.meals.length; i++) {
        await saveMealToSupabase(state.meals[i], userId);
      }
      state.meals = await loadMealsFromSupabase(userId) || state.meals;
    }

    state.selection = remoteSelection || [];
    state.checklist = remoteChecklist || [];

    // Cache locally for offline
    saveJSON(STORAGE_MEALS, state.meals);
    saveJSON(STORAGE_SELECTION, state.selection);
    saveJSON(STORAGE_CHECKLIST, state.checklist);

    render();
  }

  // ============================================================
  // Auth Screen
  // ============================================================
  var authMode = 'login'; // 'register' or 'login'

  function showAuthScreen() {
    document.getElementById('auth-screen').style.display = '';
    document.getElementById('app-container').style.display = 'none';
  }

  function hideAuthScreen() {
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('app-container').style.display = '';
  }

  function bindAuthScreen() {
    document.getElementById('btn-auth-submit').addEventListener('click', handleAuthSubmit);
    document.getElementById('btn-auth-toggle').addEventListener('click', toggleAuthMode);
    // Default to login mode
    authMode = 'login';
    updateAuthModeUI();
  }

  function toggleAuthMode() {
    authMode = authMode === 'register' ? 'login' : 'register';
    updateAuthModeUI();
    hideAuthMessage();
  }

  function updateAuthModeUI() {
    var confirmGroup = document.getElementById('auth-confirm-group');
    var submitBtn = document.getElementById('btn-auth-submit');
    var toggleText = document.getElementById('auth-toggle-text');
    var toggleBtn = document.getElementById('btn-auth-toggle');
    var subtitle = document.getElementById('auth-subtitle');

    if (authMode === 'register') {
      confirmGroup.style.display = '';
      submitBtn.textContent = 'Konto erstellen';
      toggleText.textContent = 'Bereits ein Konto?';
      toggleBtn.textContent = 'Anmelden';
      subtitle.textContent = 'Erstelle ein Konto, um deine Gerichte ger\u00e4te\u00fcbergreifend zu synchronisieren.';
    } else {
      confirmGroup.style.display = 'none';
      submitBtn.textContent = 'Anmelden';
      toggleText.textContent = 'Noch kein Konto?';
      toggleBtn.textContent = 'Registrieren';
      subtitle.textContent = 'Melde dich an, um auf deine Gerichte zuzugreifen.';
    }
  }

  async function handleAuthSubmit() {
    var email = document.getElementById('auth-email').value.trim();
    var password = document.getElementById('auth-password').value;

    if (!email || !password) {
      showAuthMessage('Bitte E-Mail und Passwort eingeben.', 'error');
      return;
    }

    if (password.length < 6) {
      showAuthMessage('Das Passwort muss mindestens 6 Zeichen lang sein.', 'error');
      return;
    }

    if (authMode === 'register') {
      var passwordConfirm = document.getElementById('auth-password-confirm').value;
      if (password !== passwordConfirm) {
        showAuthMessage('Die Passw\u00f6rter stimmen nicht \u00fcberein.', 'error');
        return;
      }
      await handleRegister(email, password);
    } else {
      await handleLogin(email, password);
    }
  }

  async function handleRegister(email, password) {
    if (!sb) return;
    var submitBtn = document.getElementById('btn-auth-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Wird erstellt...';

    try {
      var { data, error } = await sb.auth.signUp({ email: email, password: password });
      if (error) {
        showAuthMessage(translateAuthError(error.message), 'error');
        return;
      }
      showAuthMessage('Fast geschafft! Bitte best\u00e4tige deine E-Mail-Adresse \u00fcber den Link, den wir dir geschickt haben.', 'success');
    } catch (e) {
      showAuthMessage('Ein Fehler ist aufgetreten. Bitte versuche es erneut.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Konto erstellen';
    }
  }

  async function handleLogin(email, password) {
    if (!sb) return;
    var submitBtn = document.getElementById('btn-auth-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Wird angemeldet...';

    try {
      var { data, error } = await sb.auth.signInWithPassword({ email: email, password: password });
      if (error) {
        showAuthMessage(translateAuthError(error.message), 'error');
        return;
      }

      // Successfully logged in — load data and show app
      hideAuthScreen();
      await loadAppData(data.user.id);
      console.log('Angemeldet als:', data.user.email);
    } catch (e) {
      showAuthMessage('Ein Fehler ist aufgetreten. Bitte versuche es erneut.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Anmelden';
    }
  }

  async function handleLogout() {
    if (!sb) return;
    await sb.auth.signOut();

    // Clear local data
    localStorage.removeItem(STORAGE_MEALS);
    localStorage.removeItem(STORAGE_SELECTION);
    localStorage.removeItem(STORAGE_CHECKLIST);

    // Reset state
    state.userId = null;
    state.meals = [];
    state.selection = [];
    state.checklist = [];

    closeProfileModal();
    showAuthScreen();
  }

  function showAuthMessage(text, type) {
    var el = document.getElementById('auth-message');
    el.textContent = text;
    el.className = 'auth-message ' + type;
    el.style.display = '';
  }

  function hideAuthMessage() {
    var el = document.getElementById('auth-message');
    el.style.display = 'none';
    el.textContent = '';
  }

  function translateAuthError(msg) {
    if (msg.indexOf('Invalid login') >= 0) return 'E-Mail oder Passwort falsch.';
    if (msg.indexOf('Email not confirmed') >= 0) return 'Bitte best\u00e4tige zuerst deine E-Mail-Adresse.';
    if (msg.indexOf('already registered') >= 0 || msg.indexOf('already been registered') >= 0) return 'Diese E-Mail ist bereits registriert.';
    if (msg.indexOf('Password') >= 0 && msg.indexOf('short') >= 0) return 'Das Passwort ist zu kurz (mindestens 6 Zeichen).';
    if (msg.indexOf('rate limit') >= 0 || msg.indexOf('too many') >= 0) return 'Zu viele Versuche. Bitte warte einen Moment.';
    return msg;
  }

  // ============================================================
  // Profile Modal (logged-in user)
  // ============================================================
  function bindProfileModal() {
    document.getElementById('btn-account').addEventListener('click', openProfileModal);
    document.getElementById('btn-profile-close').addEventListener('click', closeProfileModal);
    document.getElementById('btn-logout').addEventListener('click', handleLogout);
    document.getElementById('modal-profile').addEventListener('click', function (e) {
      if (e.target === this) closeProfileModal();
    });
  }

  function openProfileModal() {
    var email = getCurrentUserEmail();
    document.getElementById('profile-email').textContent = email || 'Unbekannt';
    var modal = document.getElementById('modal-profile');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeProfileModal() {
    var modal = document.getElementById('modal-profile');
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  // ============================================================
  // Initialization
  // ============================================================
  async function init() {
    // Bind auth screen events (always needed)
    bindAuthScreen();
    registerSW();

    // Check for existing session
    var userId = await checkSession();

    if (userId) {
      // Already logged in — show app directly
      hideAuthScreen();

      // Load cached local data first (instant)
      state.meals = loadJSON(STORAGE_MEALS, []);
      state.selection = loadJSON(STORAGE_SELECTION, []);
      state.checklist = loadJSON(STORAGE_CHECKLIST, []);

      // Bind app events
      bindNavigation();
      bindSearch();
      bindMealModal();
      bindConfirmModal();
      bindPlanActions();
      bindShoppingActions();
      bindProfileModal();

      // Render with local data first
      if (state.meals.length > 0) render();

      // Then sync from Supabase
      try {
        await loadAppData(userId);
        console.log('Supabase-Sync erfolgreich. User:', userId);
      } catch (e) {
        console.error('Supabase-Sync fehlgeschlagen, nutze lokale Daten:', e);
        if (state.meals.length > 0) render();
      }
    } else {
      // No session — show auth screen, bind app events for later
      showAuthScreen();

      bindNavigation();
      bindSearch();
      bindMealModal();
      bindConfirmModal();
      bindPlanActions();
      bindShoppingActions();
      bindProfileModal();
    }
  }

  // ============================================================
  // Service Worker Registration
  // ============================================================
  function registerSW() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(function () {});
    }
  }

  // ============================================================
  // Navigation
  // ============================================================
  function bindNavigation() {
    var nav = document.getElementById('bottom-nav');
    nav.addEventListener('click', function (e) {
      var btn = e.target.closest('.nav-item');
      if (!btn) return;
      switchTab(btn.dataset.tab);
    });

  }

  function switchTab(tab) {
    state.activeTab = tab;
    document.querySelectorAll('.nav-item').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    document.querySelectorAll('.tab-content').forEach(function (el) {
      el.classList.toggle('active', el.id === 'tab-' + tab);
    });
    if (tab === 'favorites') renderFavorites();
    else if (tab === 'all') renderMeals();
    else if (tab === 'plan') renderPlan();
    else if (tab === 'shopping') renderShopping();
  }

  // ============================================================
  // Render dispatcher
  // ============================================================
  function render() {
    renderFavorites();
    renderMeals();
    renderPlan();
    renderShopping();

  }

  // ============================================================
  // Favorites Tab
  // ============================================================
  function renderFavorites() {
    var grid = document.getElementById('favorites-grid');
    var emptyEl = document.getElementById('favorites-empty');
    var favorites = state.meals.filter(function (m) { return m.isFavorite; });

    if (favorites.length === 0) {
      grid.innerHTML = '';
      emptyEl.style.display = '';
      return;
    }

    emptyEl.style.display = 'none';
    grid.innerHTML = favorites.map(function (meal) {
      return buildMealCardHTML(meal);
    }).join('');
    bindMealCardEvents(grid);

  }

  function toggleFavorite(mealId) {
    var meal = state.meals.find(function (m) { return m.id === mealId; });
    if (!meal) return;
    meal.isFavorite = !meal.isFavorite;
    saveJSON(STORAGE_MEALS, state.meals);
    if (state.userId) {
      saveMealToSupabase(meal, state.userId).catch(function (e) { console.error('Favorit-Sync fehlgeschlagen:', e); });
    }
    renderFavorites();
    renderMealGrid();
  }

  // ============================================================
  // Shared Meal Card Builder
  // ============================================================
  function buildMealCardHTML(meal) {
    var sel = state.selection.find(function (s) { return s.mealId === meal.id; });
    var isSelected = !!sel;
    var servings = sel ? sel.servings : meal.defaultServings;

    return '<div class="meal-card' + (isSelected ? ' selected' : '') + '" data-id="' + meal.id + '">' +
      '<div class="meal-card-image">' +
        (meal.image
          ? '<img src="' + meal.image + '" alt="' + escapeHtml(meal.name) + '" loading="lazy">'
          : '<svg class="placeholder-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><ellipse cx="12" cy="14" rx="9" ry="7"/><rect x="3" y="8" width="18" height="3" rx="1.5"/><circle cx="12" cy="5" r="2.5"/></svg>') +
      '</div>' +
      '<button class="favorite-btn' + (meal.isFavorite ? ' active' : '') + '" data-fav-id="' + meal.id + '" aria-label="Toggle favorite">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="' + (meal.isFavorite ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg>' +
      '</button>' +
      '<div class="check-badge"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>' +
      '<div class="portion-pill">' + servings + ' Port.</div>' +
      '<div class="meal-card-info">' +
        '<div class="meal-card-name">' + escapeHtml(meal.name) + '</div>' +
        '<div class="meal-card-tags">' + escapeHtml((meal.tags || []).join(', ')) + '</div>' +
      '</div>' +
    '</div>';
  }

  function bindMealCardEvents(container) {
    container.querySelectorAll('.meal-card').forEach(function (card) {
      // Favorite button
      var favBtn = card.querySelector('.favorite-btn');
      if (favBtn) {
        favBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          toggleFavorite(favBtn.dataset.favId);
        });
      }

      var longPressTimer = null;
      var didLongPress = false;
      var startX = 0;
      var startY = 0;
      var cancelled = false;
      var MOVE_THRESHOLD = 10;

      card.addEventListener('pointerdown', function (e) {
        if (e.target.closest('.favorite-btn')) return;
        didLongPress = false;
        cancelled = false;
        startX = e.clientX;
        startY = e.clientY;
        card.style.transition = 'transform 0.2s ease';
        card.style.transform = 'scale(0.97)';
        longPressTimer = setTimeout(function () {
          if (!cancelled) {
            didLongPress = true;
            card.style.transform = '';
            openMealEditor(card.dataset.id);
          }
        }, 600);
      });

      card.addEventListener('pointermove', function (e) {
        if (cancelled || didLongPress) return;
        var dx = e.clientX - startX;
        var dy = e.clientY - startY;
        if (Math.abs(dx) > MOVE_THRESHOLD || Math.abs(dy) > MOVE_THRESHOLD) {
          cancelled = true;
          clearTimeout(longPressTimer);
          card.style.transform = '';
        }
      });

      card.addEventListener('pointerup', function (e) {
        if (e.target.closest('.favorite-btn')) return;
        clearTimeout(longPressTimer);
        card.style.transform = '';
        if (!didLongPress && !cancelled) {
          toggleMealSelection(card.dataset.id);
        }
      });

      card.addEventListener('pointerleave', function () {
        clearTimeout(longPressTimer);
        card.style.transform = '';
      });

      card.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    });
  }

  // ============================================================
  // Meals Gallery (All Meals)
  // ============================================================
  function bindSearch() {
    var input = document.getElementById('search-input');
    input.addEventListener('input', function () {
      state.searchQuery = input.value.trim().toLowerCase();
      renderMealGrid();
    });
  }

  function renderMeals() {
    renderChips();
    renderMealGrid();

  }

  function renderChips() {
    var bar = document.getElementById('chip-bar');
    var tagSet = {};
    state.meals.forEach(function (m) {
      (m.tags || []).forEach(function (t) { tagSet[t] = true; });
    });
    var tags = Object.keys(tagSet).sort();

    var html = '<button class="chip' + (!state.activeTag ? ' active' : '') + '" data-tag="">Alle</button>';
    tags.forEach(function (tag) {
      html += '<button class="chip' + (state.activeTag === tag ? ' active' : '') + '" data-tag="' + escapeHtml(tag) + '">' + escapeHtml(tag) + '</button>';
    });
    bar.innerHTML = html;

    bar.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (!chip) return;
      state.activeTag = chip.dataset.tag || null;
      renderMeals();
    });
  }

  function renderMealGrid() {
    var grid = document.getElementById('meal-grid');
    var filtered = state.meals.filter(function (m) {
      if (state.searchQuery && m.name.toLowerCase().indexOf(state.searchQuery) === -1) return false;
      if (state.activeTag && (!m.tags || m.tags.indexOf(state.activeTag) === -1)) return false;
      return true;
    });

    grid.innerHTML = filtered.map(function (meal) {
      return buildMealCardHTML(meal);
    }).join('');

    bindMealCardEvents(grid);
  }

  function toggleMealSelection(mealId) {
    var idx = state.selection.findIndex(function (s) { return s.mealId === mealId; });
    if (idx >= 0) {
      state.selection.splice(idx, 1);
    } else {
      var meal = state.meals.find(function (m) { return m.id === mealId; });
      if (meal) {
        state.selection.push({ mealId: mealId, servings: meal.defaultServings });
      }
    }
    persistSelection();
    renderFavorites();
    renderMealGrid();

  }


  // ============================================================
  // Meal Modal (Add / Edit)
  // ============================================================
  function bindMealModal() {
    document.getElementById('btn-add-meal').addEventListener('click', function () {
      openMealEditor(null);
    });

    document.getElementById('btn-cancel-meal').addEventListener('click', closeMealModal);
    document.getElementById('btn-save-meal').addEventListener('click', saveMeal);
    document.getElementById('btn-add-ingredient').addEventListener('click', addIngredientRow);

    document.getElementById('meal-image-input').addEventListener('change', function (e) {
      var file = e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (ev) {
        var preview = document.getElementById('image-preview');
        preview.innerHTML = '<img src="' + ev.target.result + '" alt="Preview">';
        preview.dataset.image = ev.target.result;
      };
      reader.readAsDataURL(file);
    });

    document.getElementById('modal-meal').addEventListener('click', function (e) {
      if (e.target === this) closeMealModal();
    });
  }

  function openMealEditor(mealId) {
    state.editingMealId = mealId;
    var modal = document.getElementById('modal-meal');
    var title = document.getElementById('modal-meal-title');
    var nameInput = document.getElementById('meal-name');
    var tagsInput = document.getElementById('meal-tags');
    var servingsInput = document.getElementById('meal-servings');
    var preview = document.getElementById('image-preview');
    var ingredientsList = document.getElementById('ingredients-list');

    if (mealId) {
      var meal = state.meals.find(function (m) { return m.id === mealId; });
      if (!meal) return;
      title.textContent = 'Gericht bearbeiten';
      nameInput.value = meal.name;
      tagsInput.value = (meal.tags || []).join(', ');
      servingsInput.value = meal.defaultServings;
      if (meal.image) {
        preview.innerHTML = '<img src="' + meal.image + '" alt="Preview">';
        preview.dataset.image = meal.image;
      } else {
        resetImagePreview();
      }
      ingredientsList.innerHTML = '';
      (meal.ingredients || []).forEach(function (ing) {
        addIngredientRow(null, ing);
      });
    } else {
      title.textContent = 'Neues Gericht';
      nameInput.value = '';
      tagsInput.value = '';
      servingsInput.value = '2';
      resetImagePreview();
      ingredientsList.innerHTML = '';
      addIngredientRow();
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeMealModal() {
    var modal = document.getElementById('modal-meal');
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    state.editingMealId = null;
    document.getElementById('meal-image-input').value = '';
  }

  function resetImagePreview() {
    var preview = document.getElementById('image-preview');
    preview.innerHTML = '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#E07A5F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><span>Foto hinzuf\u00fcgen</span>';
    delete preview.dataset.image;
  }

  function addIngredientRow(e, data) {
    var list = document.getElementById('ingredients-list');
    var row = document.createElement('div');
    row.className = 'ingredient-row';

    var unitOptions = UNITS.map(function (u) {
      var selected = data && data.unit === u ? ' selected' : '';
      return '<option value="' + u + '"' + selected + '>' + u + '</option>';
    }).join('');

    var catOptions = CATEGORIES.map(function (c) {
      var selected = data && data.category === c ? ' selected' : '';
      return '<option value="' + escapeHtml(c) + '"' + selected + '>' + escapeHtml(c) + '</option>';
    }).join('');

    row.innerHTML =
      '<input type="text" placeholder="Zutat" value="' + (data ? escapeHtml(data.name) : '') + '" class="ing-name">' +
      '<input type="number" placeholder="0" value="' + (data ? data.amount : '') + '" min="0" step="any" class="ing-amount">' +
      '<select class="ing-unit">' + unitOptions + '</select>' +
      '<select class="ing-category">' + catOptions + '</select>' +
      '<button type="button" class="remove-ingredient" aria-label="Remove ingredient">&times;</button>';

    row.querySelector('.remove-ingredient').addEventListener('click', function () {
      row.remove();
    });

    list.appendChild(row);
  }

  function saveMeal() {
    var nameInput = document.getElementById('meal-name');
    var name = nameInput.value.trim();
    if (!name) {
      nameInput.focus();
      return;
    }

    var tags = document.getElementById('meal-tags').value
      .split(',')
      .map(function (t) { return t.trim(); })
      .filter(Boolean);

    var servings = parseInt(document.getElementById('meal-servings').value, 10) || 2;

    var preview = document.getElementById('image-preview');
    var image = preview.dataset.image || null;

    var ingredients = [];
    document.querySelectorAll('#ingredients-list .ingredient-row').forEach(function (row) {
      var ingName = row.querySelector('.ing-name').value.trim();
      var ingAmount = parseFloat(row.querySelector('.ing-amount').value) || 0;
      var ingUnit = row.querySelector('.ing-unit').value;
      var ingCat = row.querySelector('.ing-category').value;
      if (ingName) {
        ingredients.push({
          id: uid(),
          name: ingName,
          amount: ingAmount,
          unit: ingUnit,
          category: ingCat
        });
      }
    });

    if (state.editingMealId) {
      var meal = state.meals.find(function (m) { return m.id === state.editingMealId; });
      if (meal) {
        meal.name = name;
        meal.tags = tags;
        meal.defaultServings = servings;
        meal.image = image;
        meal.ingredients = ingredients;
      }
    } else {
      state.meals.push({
        id: uid(),
        name: name,
        image: image,
        tags: tags,
        defaultServings: servings,
        ingredients: ingredients
      });
    }

    saveJSON(STORAGE_MEALS, state.meals);
    if (state.userId) {
      var savedMeal = state.editingMealId
        ? state.meals.find(function (m) { return m.id === state.editingMealId; })
        : state.meals[state.meals.length - 1];
      if (savedMeal) saveMealToSupabase(savedMeal, state.userId).catch(function (e) { console.error('Meal-Sync fehlgeschlagen:', e); });
    }
    closeMealModal();
    renderFavorites();
    renderMeals();
  }

  // ============================================================
  // Confirm Modal
  // ============================================================
  var confirmCallback = null;

  function bindConfirmModal() {
    document.getElementById('btn-confirm-cancel').addEventListener('click', closeConfirmModal);
    document.getElementById('btn-confirm-ok').addEventListener('click', function () {
      var cb = confirmCallback;
      closeConfirmModal();
      if (cb) cb();
    });
    document.getElementById('modal-confirm').addEventListener('click', function (e) {
      if (e.target === this) closeConfirmModal();
    });
  }

  function showConfirm(title, message, callback) {
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-message').textContent = message;
    confirmCallback = callback;
    var modal = document.getElementById('modal-confirm');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeConfirmModal() {
    var modal = document.getElementById('modal-confirm');
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    confirmCallback = null;
  }

  // ============================================================
  // Essensplan (Meal Plan)
  // ============================================================
  function bindPlanActions() {
    document.getElementById('btn-generate-list').addEventListener('click', function () {
      generateShoppingList();
      switchTab('shopping');
    });
  }

  function renderPlan() {
    var emptyEl = document.getElementById('plan-empty');
    var listEl = document.getElementById('plan-list');
    var btnGenerate = document.getElementById('btn-generate-list');

    if (state.selection.length === 0) {
      emptyEl.style.display = '';
      listEl.innerHTML = '';
      btnGenerate.style.display = 'none';
      return;
    }

    emptyEl.style.display = 'none';
    btnGenerate.style.display = '';

    listEl.innerHTML = state.selection.map(function (sel) {
      var meal = state.meals.find(function (m) { return m.id === sel.mealId; });
      if (!meal) return '';

      return '<div class="plan-item" data-id="' + meal.id + '">' +
        '<div class="delete-bg">L\u00f6schen</div>' +
        '<div class="plan-item-image">' +
          (meal.image
            ? '<img src="' + meal.image + '" alt="' + escapeHtml(meal.name) + '">'
            : '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#bbb" stroke-width="1.2"><ellipse cx="12" cy="14" rx="9" ry="7"/><rect x="3" y="8" width="18" height="3" rx="1.5"/><circle cx="12" cy="5" r="2.5"/></svg>') +
        '</div>' +
        '<div class="plan-item-info">' +
          '<div class="plan-item-name">' + escapeHtml(meal.name) + '</div>' +
          '<div class="plan-item-servings-label">' + sel.servings + ' Portion' + (sel.servings !== 1 ? 'en' : '') + '</div>' +
        '</div>' +
        '<div class="stepper">' +
          '<button data-action="dec" aria-label="Decrease servings">&minus;</button>' +
          '<span class="stepper-value">' + sel.servings + '</span>' +
          '<button data-action="inc" aria-label="Increase servings">+</button>' +
        '</div>' +
      '</div>';
    }).join('');

    listEl.querySelectorAll('.plan-item').forEach(function (item) {
      var mealId = item.dataset.id;

      item.querySelectorAll('.stepper button').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          var sel = state.selection.find(function (s) { return s.mealId === mealId; });
          if (!sel) return;
          if (btn.dataset.action === 'inc') {
            sel.servings = Math.min(sel.servings + 1, 20);
          } else {
            sel.servings = Math.max(sel.servings - 1, 1);
          }
          persistSelection();
          renderPlan();
          renderMealGrid();
        });
      });

      bindSwipeToDelete(item, mealId);
    });
  }

  function bindSwipeToDelete(item, mealId) {
    var startX = 0;
    var currentX = 0;
    var swiping = false;
    var deleteBg = item.querySelector('.delete-bg');

    item.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
      swiping = true;
      item.classList.add('swiping');
    }, { passive: true });

    item.addEventListener('touchmove', function (e) {
      if (!swiping) return;
      currentX = e.touches[0].clientX;
      var dx = Math.min(0, currentX - startX);
      if (dx < -10) {
        item.style.transform = 'translateX(' + dx + 'px)';
        deleteBg.style.opacity = Math.min(1, Math.abs(dx) / 80);
      }
    }, { passive: true });

    item.addEventListener('touchend', function () {
      swiping = false;
      item.classList.remove('swiping');
      var dx = currentX - startX;
      if (dx < -80) {
        item.classList.add('removing');
        setTimeout(function () {
          removeMealFromPlan(mealId);
        }, 300);
      } else {
        item.style.transform = '';
        deleteBg.style.opacity = '0';
      }
    });
  }

  function removeMealFromPlan(mealId) {
    state.selection = state.selection.filter(function (s) { return s.mealId !== mealId; });
    persistSelection();
    renderPlan();
    renderMealGrid();

  }

  // ============================================================
  // Shopping List - Consolidation Logic
  // ============================================================
  function generateShoppingList() {
    state.checklist = [];
    persistChecklist();
    renderShopping();
  }

  function getConsolidatedList() {
    var grouped = {};

    state.selection.forEach(function (sel) {
      var meal = state.meals.find(function (m) { return m.id === sel.mealId; });
      if (!meal) return;

      var scale = sel.servings / (meal.defaultServings || 1);

      (meal.ingredients || []).forEach(function (ing) {
        var key = ing.name.trim().toLowerCase() + '||' + ing.unit.trim().toLowerCase();
        if (!grouped[key]) {
          grouped[key] = {
            name: ing.name.trim(),
            unit: ing.unit.trim(),
            amount: 0,
            category: ing.category || 'Sonstiges'
          };
        }
        grouped[key].amount += ing.amount * scale;
      });
    });

    var items = Object.keys(grouped).map(function (key) {
      var item = grouped[key];
      item.key = key;
      item.amount = roundAmount(item.amount);
      return item;
    });

    items.sort(function (a, b) {
      var catA = CATEGORY_ORDER[a.category] !== undefined ? CATEGORY_ORDER[a.category] : 99;
      var catB = CATEGORY_ORDER[b.category] !== undefined ? CATEGORY_ORDER[b.category] : 99;
      if (catA !== catB) return catA - catB;
      return a.name.localeCompare(b.name);
    });

    return items;
  }

  function bindShoppingActions() {
    document.getElementById('btn-share').addEventListener('click', shareList);
    document.getElementById('btn-clear-list').addEventListener('click', function () {
      showConfirm(
        'Liste l\u00f6schen',
        'M\u00f6chtest du die Einkaufsliste und alle ausgew\u00e4hlten Gerichte zur\u00fccksetzen?',
        function () {
          state.selection = [];
          state.checklist = [];
          persistSelection();
          persistChecklist();
          render();
        }
      );
    });
  }

  function renderShopping() {
    var emptyEl = document.getElementById('shopping-empty');
    var listEl = document.getElementById('shopping-list');
    var progressContainer = document.getElementById('progress-container');
    var btnClear = document.getElementById('btn-clear-list');

    if (state.selection.length === 0) {
      emptyEl.style.display = '';
      listEl.innerHTML = '';
      progressContainer.style.display = 'none';
      btnClear.style.display = 'none';
      return;
    }

    emptyEl.style.display = 'none';
    progressContainer.style.display = '';
    btnClear.style.display = '';

    var items = getConsolidatedList();
    var total = items.length;
    var checked = items.filter(function (it) { return state.checklist.indexOf(it.key) >= 0; }).length;

    document.getElementById('progress-bar').style.width = (total > 0 ? (checked / total * 100) : 0) + '%';
    document.getElementById('progress-label').textContent = checked + '/' + total;

    var categories = {};
    items.forEach(function (item) {
      if (!categories[item.category]) categories[item.category] = [];
      categories[item.category].push(item);
    });

    var html = '';
    CATEGORIES.forEach(function (cat) {
      if (!categories[cat]) return;
      html += '<div class="shopping-category">';
      html += '<div class="shopping-category-title">' + escapeHtml(cat) + '</div>';
      categories[cat].forEach(function (item) {
        var isChecked = state.checklist.indexOf(item.key) >= 0;
        html += '<div class="shopping-item' + (isChecked ? ' checked' : '') + '" data-key="' + escapeHtml(item.key) + '">' +
          '<div class="check-circle">' +
            (isChecked ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>' : '') +
          '</div>' +
          '<span class="item-text">' + escapeHtml(item.name) + '</span>' +
          '<span class="item-amount">' + item.amount + ' ' + escapeHtml(item.unit) + '</span>' +
        '</div>';
      });
      html += '</div>';
    });

    Object.keys(categories).forEach(function (cat) {
      if (CATEGORIES.indexOf(cat) >= 0) return;
      html += '<div class="shopping-category">';
      html += '<div class="shopping-category-title">' + escapeHtml(cat) + '</div>';
      categories[cat].forEach(function (item) {
        var isChecked = state.checklist.indexOf(item.key) >= 0;
        html += '<div class="shopping-item' + (isChecked ? ' checked' : '') + '" data-key="' + escapeHtml(item.key) + '">' +
          '<div class="check-circle">' +
            (isChecked ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>' : '') +
          '</div>' +
          '<span class="item-text">' + escapeHtml(item.name) + '</span>' +
          '<span class="item-amount">' + item.amount + ' ' + escapeHtml(item.unit) + '</span>' +
        '</div>';
      });
      html += '</div>';
    });

    listEl.innerHTML = html;

    listEl.querySelectorAll('.shopping-item').forEach(function (el) {
      el.addEventListener('click', function () {
        var key = el.dataset.key;
        var idx = state.checklist.indexOf(key);
        if (idx >= 0) {
          state.checklist.splice(idx, 1);
        } else {
          state.checklist.push(key);
        }
        persistChecklist();
        renderShopping();
      });
    });
  }

  function shareList() {
    var items = getConsolidatedList();
    if (items.length === 0) return;

    var text = 'Einkaufsliste\n\n';
    var currentCat = '';
    items.forEach(function (item) {
      if (item.category !== currentCat) {
        currentCat = item.category;
        text += '\n' + currentCat + ':\n';
      }
      var check = state.checklist.indexOf(item.key) >= 0 ? '\u2611' : '\u2610';
      text += check + ' ' + item.amount + ' ' + item.unit + ' ' + item.name + '\n';
    });

    if (navigator.share) {
      navigator.share({ title: 'Einkaufsliste', text: text }).catch(function () {});
    } else {
      navigator.clipboard.writeText(text).then(function () {}).catch(function () {});
    }
  }

  // ============================================================
  // Keyboard: Escape closes modals
  // ============================================================
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeConfirmModal();
      closeMealModal();
      closeProfileModal();
    }
  });

  // ============================================================
  // Start
  // ============================================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
