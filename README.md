# API Starter
![Latest Release](https://img.shields.io/github/v/release/jefgodesky/api-starter?label=Latest+release&style=for-the-badge)
![Test Status](https://img.shields.io/github/actions/workflow/status/jefgodesky/api-starter/test.yaml?label=Test+status&style=for-the-badge)
![License](https://img.shields.io/github/license/jefgodesky/api-starter?style=for-the-badge)

A template for creating new RESTful APIs with
[Hono](https://hono.dev/),
[PostgreSQL](https://www.postgresql.org/),
[Drizzle](https://orm.drizzle.team/),
[Zod](https://zod.dev/),
[BetterAuth](https://better-auth.com/),
[Docker](https://www.docker.com/),
[OpenAPI](https://www.openapis.org/), and
[NeoStandard](https://github.com/neostandard/neostandard). Includes:

- **Schema-based architecture.** Use [Zod](https://zod.dev/) to define
  schemas that are translated to database tables and
  [OpenAPI](https://www.openapis.org/) documentation.
- **Role-based permissions.** Endpoints are already set up for users to
  authenticate through OAuth 2.0 servers using [BetterAuth](https://better-auth.com/)
  with role-based access control with ownership-scoped permissions already
  set up.
- **Continuous deployment.** Everything is fully Dockerized, with
  a fully-functional continuous deployment pipeline using
  [GitHub Actions](https://github.com/features/actions).
- **Test-driven development.** Everything in the template was developed
  using test-driven development (TDD) with [Vitest](https://vitest.dev/),
  so there’s a strong foundation, all the fixtures you’ll need, and
  examples of how to use them so you can just keep it going.
- **Structured logs.** [LogLayer](https://vitest.dev/) and
  [Pino](https://getpino.io/#/) are already set up.
- **URL versioning.** Use [Docker](https://www.docker.com/) images to
  run previous and future versions of your API alongside the live
  version, with each one scoped to a different versioned path by an
  [nginx](https://nginx.org/) reverse proxy.
- **OpenAPI documentation.** Find full documentation for your API,
  all of its endpoints, and the scheams they use at `/v1/docs`, or
  export that for things like client-side type safety from
  `/v1/spec`.