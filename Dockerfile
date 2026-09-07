FROM denoland/deno:2.9.6

ENV DENO_DIR=/deno-dir
RUN mkdir -p /deno-dir && chown deno:deno /deno-dir

WORKDIR /api
RUN chown deno:deno /api

USER deno

COPY --chown=deno:deno . .
RUN deno cache main.ts db/migrate.ts

COPY --chown=deno:deno deno.json deno.lock ./
RUN deno install

COPY --chown=deno:deno . .
RUN deno cache main.ts

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD ["deno","eval","--allow-net","--allow-env","const r=await fetch(`http://localhost:${Deno.env.get('PORT')||8000}/v${Deno.env.get('API_VERSION')||1}`).catch(()=>null);Deno.exit(r&&r.ok?0:1)"]

ENTRYPOINT ["/api/docker-entrypoint.sh"]
CMD ["deno", "task", "start"]