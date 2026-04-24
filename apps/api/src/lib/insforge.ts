import axios from 'axios'
import { env } from './env'

export const insforge = axios.create({
  baseURL: env.INSFORGE_URL,
  headers: {
    'Authorization': `Bearer ${env.INSFORGE_API_KEY}`,
    'Content-Type': 'application/json',
  },
})

// Collections
export const collections = {
  users: 'users',
  organizations: 'organizations',
  orgMembers: 'org_members',
  sessions: 'sessions',
  apiKeysVault: 'api_keys_vault',
  // Add all other collections here
}

// Helper functions
export async function insert(table: string, data: any) {
  const response = await insforge.post(`/collections/${table}`, data)
  return response.data
}

export async function select(table: string, query?: any) {
  const response = await insforge.get(`/collections/${table}`, { params: query })
  return response.data
}

export async function update(table: string, id: string, data: any) {
  const response = await insforge.patch(`/collections/${table}/${id}`, data)
  return response.data
}

export async function remove(table: string, id: string) {
  const response = await insforge.delete(`/collections/${table}/${id}`)
  return response.data
}