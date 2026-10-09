FROM denoland/deno

EXPOSE 8000

WORKDIR /api

ADD .. /api

CMD ["deno", "run", "start"]
