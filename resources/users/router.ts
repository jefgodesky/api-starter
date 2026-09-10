import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { type Env } from '../../types/jsonapi-query.ts'
import { UserParams, UserPatchBody, usersType } from './schema.ts'
import { serializeUser, serializeUsers } from './serializer.ts'
import { MEDIA_TYPE } from '../../utils/media-type.ts'
import sendError from '../../utils/error.ts'
import defaultHook from '../../middlewares/jsonapi/hook.ts'
import countUsers from './db/count.ts'
import listUsers from './db/list.ts'
import findUser from './db/find.ts'
import updateUser from './db/update.ts'
import deleteUser from './db/delete.ts'

const users = new OpenAPIHono<Env>({ defaultHook })

users.openapi(
  createRoute({
    method: 'get',
    path: `/${usersType}`,
    responses: { 200: { description: 'A list of users.' } },
  }),
  async (c) => {
    const { page, fields } = c.get('query')
    const users = await listUsers(page.limit, page.offset)
    const count = await countUsers()
    const params = new URL(c.req.url).searchParams
    const total = Number(count)
    return c.json(
      await serializeUsers(
        users,
        { ...page, total },
        params,
        fields[usersType],
      ),
      200,
    )
  },
)

users.openapi(
  createRoute({
    method: 'get',
    path: `/${usersType}/{id}`,
    request: { params: UserParams },
    responses: {
      200: { description: 'Retrieves an individual user.' },
      404: { description: 'User not found.' },
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param')
    const user = await findUser(id)
    const { fields } = c.get('query')
    if (!user) return sendError(c, 404, 'user_not_found')
    return c.json(await serializeUser(user, fields[usersType]), 200)
  },
)

users.openapi(
  createRoute({
    method: 'patch',
    path: `/${usersType}/{id}`,
    request: {
      params: UserParams,
      body: { content: { [MEDIA_TYPE]: { schema: UserPatchBody } } },
    },
    responses: {
      200: { description: 'The updated user.' },
      404: { description: 'User not found.' },
      409: { description: 'Provided user ID did not match the resource.' },
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param')
    const { data } = c.req.valid('json')
    const existing = await findUser(id)
    if (!existing) return sendError(c, 404, 'user_not_found')
    if (data.id !== existing.id) return sendError(c, 409, 'id_mismatch')
    const noop = Object.keys(data.attributes).length === 0
    const updated = noop
      ? existing
      : await updateUser(existing.id, data.attributes)
    if (!updated) return sendError(c, 500, 'update_error')
    return c.json(await serializeUser(updated), 200)
  },
)

users.openapi(
  createRoute({
    method: 'delete',
    path: `/${usersType}/{id}`,
    request: { params: UserParams },
    responses: {
      204: { description: 'The user has been deleted.' },
      404: { description: 'User not found.' },
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param')
    const existing = await findUser(id)
    if (!existing) return sendError(c, 404, 'user_not_found')
    await deleteUser(id)
    return c.body(null, 204)
  },
)

export default users
