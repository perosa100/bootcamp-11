import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider'
import { container } from 'tsyringe'
import BCryptHashProvider from './HashProvider/implementations/BCryptHashProvider'

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider)
