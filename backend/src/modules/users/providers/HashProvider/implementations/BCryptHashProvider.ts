import { compare, hash } from 'bcryptjs'
import IHahsProvider from '../models/IHashProvider'

class BCryptHashProvider implements IHahsProvider {
  public async generateHash(payload: string): Promise<string> {
    return hash(payload, 8)
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed)
  }
}

export default BCryptHashProvider
