// Re-export Supabase database functions
export { 
  saveContactMessage, 
  saveOrder, 
  saveCartSnapshot, 
  loadCartSnapshot,
  saveFavorite, 
  removeFavorite,
  loadFavorites
} from './supabase-db'
