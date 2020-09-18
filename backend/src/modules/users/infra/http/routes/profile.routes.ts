import ensureAuthenticated from '@modules/users/infra/middlewares/ensureAuthenticated'
import { celebrate, Joi, Segments } from 'celebrate'
import { Router } from 'express'
import ProfileController from '../controller/ProfileController'

const profileRouter = Router()
const profileController = new ProfileController()

profileRouter.use(ensureAuthenticated)

profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password'))
    }
  }),
  profileController.update
)
profileRouter.get('/', profileController.show)
export default profileRouter
