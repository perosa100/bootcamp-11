import { createConnections } from 'typeorm'

createConnections()
/* import { Connection, createConnection, getConnectionOptions } from 'typeorm'

export default async (name = 'default'): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions()

  return createConnection(
    Object.assign(defaultOptions, {
      name,
      database:
        process.env.NODE_ENV === 'test'
          ? 'gobarber2020'
          : defaultOptions.database
    })
  )
}
 */
