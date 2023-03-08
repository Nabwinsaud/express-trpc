// import { initTRPC } from '@trpc/server';
// import { z } from 'zod';

// export const t = initTRPC.create();

// export const appRouter = t.router({
//   getUser: t.procedure.input(z.string()).query((req) => {
//     req.input; // string
//     return { id: req.input, name: 'Bilbo' };
//   }),
//   createUser: t.procedure
//     .input(z.object({ name: z.string().min(5) }))
//     .mutation(async (req) => {
//       // use your ORM of choice
//       return await UserModel.create({
//         data: req.input,
//       });
//     }),
// });

// // export type definition of API
// export type AppRouter = typeof appRouter;

import express from "express";
import { z } from "zod";
import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";

// created for each request
const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({}); // no context
type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();
const appRouter = t.router({
  ping: t.procedure.query(() => "pong"),

  //   http://localhost:3000/api/trpc/example.hello?batch=1&input={0:{json:{text:Nabin}}} // you might need to encode in %55%
  user: t.procedure.input(z.object({ text: z.string() })).query(({ input }) => {
    return {
      greeting: `Hello ${input.text}`,
    };
  }),

  //   http://localhost:4000/trpc/getUser?input=%22Nabin%22
  getUser: t.procedure.input(z.string()).query((req) => {
    req.input; // string
    return { id: req.input, name: "Hello the universe of Nabwin" };
  }),
});

const app = express();

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.listen(4000, () => {
  console.log("server running at localhost:4000");
});
