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

## Versioning

You can run multiple versions of your API at once by adding them to
`versions.yaml`. When you create your API, there’s just one: `/v1`,
which runs the current state of your API.

```yaml
versions:
  - path: /v1
    status: latest-version
```

Later on, if you want to introduce some breaking changes, you might
add a new version:

```yaml
versions:
  - path: /v1
    status: latest-version
    image: ghcr.io/username/example-api:v1
  - path: /v2
    status: successor-version
```

When you run `pnpm versions` will update all of the configuration files
you need so that when you run the API, `/v1` will serve the API from
the release package at `ghcr.io/username/example-api:v1`, while the
current state of your code will be served at `/v2`.

When you’re ready to launch version 2, just change the status entries
and run `pnpm versions` again.

```yaml
versions:
  - path: /v1
    status: predecessor-version
    image: ghcr.io/username/example-api:v1
  - path: /v2
    status: latest-version
```

And when you start work on version 3:

```yaml
versions:
  - path: /v1
    status: predecessor-version
    image: ghcr.io/username/example-api:v1
  - path: /v2
    status: latest-version
    image: ghcr.io/username/example-api:v2
  - path: /v3
    status: successor-version
```

Retiring a version is as simple as removing it from the YAML file.

```yaml
versions:
  - path: /v2
    status: latest-version
    image: ghcr.io/username/example-api:v2
  - path: /v3
    status: successor-version
```