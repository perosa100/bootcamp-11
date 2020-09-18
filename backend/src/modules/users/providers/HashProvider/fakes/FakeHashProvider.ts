import IHahsProvider from '../models/IHashProvider'

class FakeHashProvider implements IHahsProvider {
  public async generateHash(payload: string): Promise<string> {
    return payload
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return payload === hashed
  }
}

export default FakeHashProvider
