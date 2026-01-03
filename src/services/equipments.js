import { apiGet, apiPost, apiPatch, apiDelete } from './api'

const EQUIPMENTS_BASE = '/equipments'

export const listEquipments = async (params = {}) => apiGet(EQUIPMENTS_BASE, { params })
export const createEquipment = async (payload) => apiPost(EQUIPMENTS_BASE, payload)
export const updateEquipment = async (id, payload) => apiPatch(`${EQUIPMENTS_BASE}/${id}`, payload)
export const deleteEquipment = async (id) => apiDelete(`${EQUIPMENTS_BASE}/${id}`)

export const assignEquipmentToSpace = async (id, payload) =>
  apiPost(`${EQUIPMENTS_BASE}/${id}/assign-space`, payload)

