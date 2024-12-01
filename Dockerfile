FROM denoland/deno

EXPOSE 8000

WORKDIR /app

ADD . /app

CMD ["deno", "run", "start:dev"]
