// import { createClient } from "@libsql/client";
import 'dotenv/config'
import Fastify from 'fastify'
import path from 'node:path'
import fs from 'node:fs'
import { pipeline } from 'node:stream/promises'
import fastifyMultipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import fastifyView from '@fastify/view'
import ejs from 'ejs'
import slugify from "slugify";
import { tursoPlatform } from './turso/platform.js'
import { createTursoClient } from './turso/turso.js'

const fastify = Fastify({ logger: true })


fastify.register(fastifyMultipart)

fastify.register(fastifyStatic, {
  root: path.join(process.cwd(), 'public'),
})

fastify.register(fastifyView, {
  engine: {
    ejs,
  },
  root: "views",
  viewExt: "ejs"
});

// const client = createClient({
//     url: "libsql://...",
//     authToken: "...",
//   });

fastify.get('/', async (request, reply) => {
  const databases = await tursoPlatform.databases.list()
  return reply.view("index", { databases })
})

fastify.post('/upload', async (request, reply) => {
  const data = await request.file()
  await pipeline(data.file, fs.createWriteStream(data.filename))
  // filename: top-100-world-university-2024.csv
  //  mimetype: 'text/csv'
  // file: FileStream
  // fields
  const slug = slugify(data.fields.name.value, { lower: true })
  // TODO:
  // - Create dictionary from file
  // - Create dynamic SQL statetment (CREATE TABLE)
  // - Insert values into table
  const database = await tursoPlatform.databases.create(slug, "ams");
  const client = createTursoClient(database.hostname)
  reply.redirect('/')
})

// Run the server!
fastify.listen({ port: 3000 }, (err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
