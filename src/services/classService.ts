import { getClass as getSrdClass } from '../graphql/srdClientService';

export const getClass = async (index: string) => await getSrdClass(index);
