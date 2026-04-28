/**
 * supabaseService.js — SolarAxis Monitor: Data Access Layer
 * 
 * All Supabase queries go through this module.
 * Components should import from here, NOT directly from supabase.js.
 * This keeps queries centralized and easy to audit/change.
 */
import { supabase } from './supabase'

// ══════════════════════════════════════════════════════════════════════════════
// AUTH
// ══════════════════════════════════════════════════════════════════════════════

/** Sign up a new user with email/password and profile metadata */
export async function signUp({ email, password, fullName, phone, role = 'customer', vendorId = null }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, phone, role },
    },
  })
  if (error) throw error

  // Create profile record
  if (data.user) {
    const { error: profileErr } = await supabase.from('profiles').insert({
      id: data.user.id,
      role,
      full_name: fullName,
      email,
      phone,
      vendor_id: vendorId,
    })
    if (profileErr) console.error('Profile creation error:', profileErr)
  }

  return data
}

/** Sign in with email + password */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

/** Sign out the current session */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/** Get the current logged-in user (cached, no network call) */
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

/** Listen for auth state changes */
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback)
}

/** Get user profile from the profiles table */
export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

// ══════════════════════════════════════════════════════════════════════════════
// PLANTS
// ══════════════════════════════════════════════════════════════════════════════

/** Fetch all plants (optionally filter by vendor) */
export async function getPlants(vendorId = null) {
  let query = supabase.from('plants').select('*').order('created_at', { ascending: false })
  if (vendorId) query = query.eq('vendor_id', vendorId)
  const { data, error } = await query
  if (error) throw error
  return data || []
}

/** Get a single plant by ID */
export async function getPlant(plantId) {
  const { data, error } = await supabase
    .from('plants')
    .select('*')
    .eq('id', plantId)
    .single()
  if (error) throw error
  return data
}

/** Create a new plant */
export async function createPlant(plant) {
  const { data, error } = await supabase.from('plants').insert(plant).select().single()
  if (error) throw error
  return data
}

/** Update an existing plant */
export async function updatePlant(plantId, updates) {
  const { data, error } = await supabase
    .from('plants')
    .update(updates)
    .eq('id', plantId)
    .select()
    .single()
  if (error) throw error
  return data
}

/** Delete a plant */
export async function deletePlant(plantId) {
  const { error } = await supabase.from('plants').delete().eq('id', plantId)
  if (error) throw error
}

// ══════════════════════════════════════════════════════════════════════════════
// UNITS (Inverters)
// ══════════════════════════════════════════════════════════════════════════════

/** Fetch all units (optionally by plant or vendor) */
export async function getUnits({ plantId = null, vendorId = null } = {}) {
  let query = supabase.from('units').select('*').order('created_at', { ascending: false })
  if (plantId) query = query.eq('plant_id', plantId)
  if (vendorId) query = query.eq('vendor_id', vendorId)
  const { data, error } = await query
  if (error) throw error
  return data || []
}

/** Create a unit */
export async function createUnit(unit) {
  const { data, error } = await supabase.from('units').insert(unit).select().single()
  if (error) throw error
  return data
}

/** Update a unit */
export async function updateUnit(unitId, updates) {
  const { data, error } = await supabase
    .from('units')
    .update(updates)
    .eq('id', unitId)
    .select()
    .single()
  if (error) throw error
  return data
}

// ══════════════════════════════════════════════════════════════════════════════
// GENERATION DATA
// ══════════════════════════════════════════════════════════════════════════════

/** Fetch generation data for a plant (optionally filter by date range) */
export async function getGeneration(plantId, { from = null, to = null } = {}) {
  let query = supabase
    .from('generation')
    .select('*')
    .eq('plant_id', plantId)
    .order('date', { ascending: true })
  if (from) query = query.gte('date', from)
  if (to) query = query.lte('date', to)
  const { data, error } = await query
  if (error) throw error
  return data || []
}

/** Insert a generation record */
export async function saveGeneration(record) {
  const { data, error } = await supabase
    .from('generation')
    .upsert(record, { onConflict: 'plant_id,date' })
    .select()
    .single()
  if (error) throw error
  return data
}

// ══════════════════════════════════════════════════════════════════════════════
// ALERTS
// ══════════════════════════════════════════════════════════════════════════════

/** Fetch alerts (optionally filter by plant or vendor) */
export async function getAlerts({ plantId = null, vendorId = null, resolved = null } = {}) {
  let query = supabase.from('alerts').select('*').order('created_at', { ascending: false })
  if (plantId) query = query.eq('plant_id', plantId)
  if (vendorId) query = query.eq('vendor_id', vendorId)
  if (resolved !== null) query = query.eq('resolved', resolved)
  const { data, error } = await query
  if (error) throw error
  return data || []
}

/** Create an alert */
export async function createAlert(alert) {
  const { data, error } = await supabase.from('alerts').insert(alert).select().single()
  if (error) throw error
  return data
}

/** Resolve / update an alert */
export async function updateAlert(alertId, updates) {
  const { data, error } = await supabase
    .from('alerts')
    .update(updates)
    .eq('id', alertId)
    .select()
    .single()
  if (error) throw error
  return data
}

// ══════════════════════════════════════════════════════════════════════════════
// PROFILES (Admin)
// ══════════════════════════════════════════════════════════════════════════════

/** Fetch all profiles by role */
export async function getProfilesByRole(role) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', role)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

/** Update a profile */
export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}

// ══════════════════════════════════════════════════════════════════════════════
// REALTIME SUBSCRIPTIONS
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Subscribe to realtime changes on a table.
 * Returns an unsubscribe function.
 * 
 * Usage:
 *   const unsub = subscribeToTable('alerts', 'INSERT', (payload) => { ... })
 *   // later: unsub()
 */
export function subscribeToTable(table, event, callback) {
  const channel = supabase
    .channel(`${table}_changes`)
    .on(
      'postgres_changes',
      { event, schema: 'public', table },
      callback
    )
    .subscribe()

  return () => supabase.removeChannel(channel)
}

// ══════════════════════════════════════════════════════════════════════════════
// HEALTH CHECK — Verifies Supabase connectivity
// ══════════════════════════════════════════════════════════════════════════════

export async function checkSupabaseHealth() {
  try {
    const { data, error } = await supabase.from('profiles').select('id').limit(1)
    if (error) return { ok: false, error: error.message }
    return { ok: true, latency: 'connected' }
  } catch (e) {
    return { ok: false, error: e.message }
  }
}
