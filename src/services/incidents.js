import { apiGet, apiPost, apiPatch } from './api'

const INCIDENTS_BASE = '/incidents'

export const listIncidents = async (params = {}) => apiGet(INCIDENTS_BASE, { params })
export const createIncident = async (payload) => apiPost(INCIDENTS_BASE, payload)
export const assignIncident = async (id, payload) =>
  apiPost(`${INCIDENTS_BASE}/${id}/assign`, payload)
export const resolveIncident = async (id, payload) =>
  apiPost(`${INCIDENTS_BASE}/${id}/resolve`, payload)
export const closeIncident = async (id, payload) =>
  apiPost(`${INCIDENTS_BASE}/${id}/close`, payload)
export const updateIncident = async (id, payload) => apiPatch(`${INCIDENTS_BASE}/${id}`, payload)

