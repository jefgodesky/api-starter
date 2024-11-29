FROM denoland/deno

EXPOSE 8000

WORKDIR /app

ADD . /app

CMD ["run", "--allow-net", "--allow-env", "main.ts"]
