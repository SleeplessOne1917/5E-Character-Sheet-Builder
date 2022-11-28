import { getClass as getSrdClass } from '../server/5E-API/srdClientService';

export const getClass = async (index: string) => await getSrdClass(index);
