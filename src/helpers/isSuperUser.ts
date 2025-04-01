import { User } from '../payload-types'

export const isSuperUser = (user: User): boolean => {
  return Boolean(user?.roles?.includes('super'))
}
