import ensureAuthenticated from '@modules/users/infra/middlewares/ensureAuthenticated'
import { celebrate, Joi, Segments } from 'celebrate'
import { Router } from 'express'
import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController'
import ProviderMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController'
import ProvidersController from '../controllers/ProvidersController'

const providersRouter = Router()
const providersController = new ProvidersController()
const providerDayAvailability = new ProviderDayAvailabilityController()
const providerMonthAvailability = new ProviderMonthAvailabilityController()

providersRouter.use(ensureAuthenticated)

providersRouter.get('/', providersController.index)

providersRouter.get(
  '/:provider_id/month-availability',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required()
    }
  }),
  providerMonthAvailability.index
)

providersRouter.get(
  '/:provider_id/day-availability',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required()
    }
  }),
  providerDayAvailability.index
)

export default providersRouter
