FROM denoland/deno:2.9.6

ENV DENO_DIR=/deno-dir
RUN mkdir -p /deno-dir && chown deno:deno /deno-dir

WORKDIR /api
RUN chown deno:deno /api

USER deno

COPY --chown=deno:deno deno.json deno.lock ./
RUN deno install

COPY --chown=deno:deno . .
RUN deno cache main.ts

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD ["deno","eval","--allow-net","const r=await fetch('http://localhost:8000/v1/').catch(()=>null);Deno.exit(r&&r.ok?0:1)"]

CMD ["deno", "task", "start"]